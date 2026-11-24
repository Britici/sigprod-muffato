/* ══════════════════════════════════════════════════════════════════
   SIGMAN — INSPEÇÃO DIÁRIA
   Muffato Foods
   ══════════════════════════════════════════════════════════════════ */

// Lista de inspeção (Sala → equipamentos → sub-itens): vem da aba InspecaoItens (GET readInspItens), com cópia local p/ uso sem rede.
let INSP_TMPL = [];
const INSP_TMPL_KEY = 'sigman_insp_tmpl_v1';
const INSP_ALERTAS_TTL_MS = 60 * 1000;
let _inspUltimaAssin = '', _inspUltimoId = '';   // mesmo conteúdo = mesmo ID: reenvio/fila não duplica no servidor
let _salvandoInsp = false;
let _inspAlertasTs = 0, _inspAlertasRes = null, _inspAlertasUser = '';

// ═══ INSP-PURO:INICIO ═══
// itens (do servidor, já em ordem; Sub_Item vazio = o próprio equipamento) → [{sala, equips:[{id, nome, subs:[{id, nome}]}]}]
function inspMontarTmpl_(itens) {
  const norm = x => String(x == null ? '' : x).replace(/\s+/g, ' ').trim().toLowerCase();
  const salas = [], porSala = {}, porEq = {};
  (Array.isArray(itens) ? itens : []).forEach(it => {
    if (!it || typeof it !== 'object') return;
    const id = String(it.ID_Item == null ? '' : it.ID_Item).trim(), sala = String(it.Sala == null ? '' : it.Sala).trim();
    const eq = String(it.Equipamento == null ? '' : it.Equipamento).trim(), sub = String(it.Sub_Item == null ? '' : it.Sub_Item).trim();
    if (!id || !sala || !eq) return;
    if (!sub) {
      const k = norm(sala) + '|' + norm(eq);
      if (porEq[k]) return;                                   // equipamento repetido: fica o primeiro
      let sec = porSala[norm(sala)];
      if (!sec) { sec = { sala, equips: [] }; porSala[norm(sala)] = sec; salas.push(sec); }
      porEq[k] = { id, nome: eq, subs: [] }; sec.equips.push(porEq[k]);
    }
  });
  (Array.isArray(itens) ? itens : []).forEach(it => {
    if (!it || typeof it !== 'object') return;
    const id = String(it.ID_Item == null ? '' : it.ID_Item).trim(), sala = String(it.Sala == null ? '' : it.Sala).trim();
    const eq = String(it.Equipamento == null ? '' : it.Equipamento).trim(), sub = String(it.Sub_Item == null ? '' : it.Sub_Item).trim();
    if (!id || !sala || !eq || !sub) return;
    const pai = porEq[norm(sala) + '|' + norm(eq)];
    if (pai && !pai.subs.some(s => norm(s.nome) === norm(sub))) pai.subs.push({ id, nome: sub });   // sub sem equipamento: ignorado
  });
  return salas;
}

// Resultado de GET inspAlertas → HTML do banner do dashboard ('' = nada a mostrar). Todo texto vem escapado.
function inspAlertasHtml_(res) {
  if (!res || !res.ok || !Array.isArray(res.alertas) || !res.alertas.length) return '';
  const dm = d => /^\d{4}-\d{2}-\d{2}$/.test(String(d)) ? String(d).slice(8, 10) + '/' + String(d).slice(5, 7) : '';
  const linha = a => {
    const dias = Number(a.dias) || 0;
    return `<div style="padding:5px 0;border-top:1px solid rgba(196,18,48,.25);font-size:14px;line-height:1.45">
      <strong>${_esc(a.sala)}</strong> · ${_esc(a.equipamento)}${a.sub_item ? ' / ' + _esc(a.sub_item) : ''}
      — <span style="color:#ff2244">NÃO OK desde ${_esc(dm(a.desde))}</span> <span style="color:var(--txt3)">(${dias > 0 ? _esc(dias) + ' dia' + (dias > 1 ? 's' : '') : 'hoje'})</span>
      ${a.manutentor ? ' · ' + _esc(a.manutentor) : ''}${a.obs ? ' · “' + _esc(a.obs) + '”' : ''}
    </div>`;
  };
  const MAX = 5, n = res.alertas.length;
  const resto = n > MAX ? `<details style="margin-top:2px"><summary style="cursor:pointer;font-size:13px;color:var(--txt3);padding:4px 0">Ver os outros ${_esc(n - MAX)}</summary>${res.alertas.slice(MAX).map(linha).join('')}</details>` : '';
  return `<div style="background:rgba(196,18,48,.12);border:1px solid rgba(196,18,48,.4);border-radius:var(--rs);padding:10px 14px;margin-bottom:12px">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:4px">
      <span style="font-size:22px">⚠️</span>
      <div><strong style="color:#ff2244;font-size:15px">Inspeção: ${_esc(n)} ${n > 1 ? 'itens' : 'item'} NÃO OK</strong>
      <div style="font-size:12px;color:var(--txt3)">Sai do alerta quando uma inspeção posterior marcar OK.${res.truncado ? ' (Leitura parcial do histórico.)' : ''}</div></div>
    </div>
    ${res.alertas.slice(0, MAX).map(linha).join('')}${resto}
  </div>`;
}
// ═══ INSP-PURO:FIM ═══

function inspTmplLerCache_() {
  try { const o = JSON.parse(localStorage.getItem(INSP_TMPL_KEY) || 'null'); return o && Array.isArray(o.tmpl) ? o.tmpl : []; } catch (e) { return []; }
}
function inspTmplGravarCache_(t) { try { localStorage.setItem(INSP_TMPL_KEY, JSON.stringify({ tmpl: t, em: Date.now() })); } catch (e) {} }

// Busca a lista no servidor. true = a lista mudou. Lista vazia/inválida NUNCA apaga a cópia local.
async function inspCarregarTmpl_() {
  const r = await apiGet({ action: 'readInspItens' });
  if (!r || !r.ok || !Array.isArray(r.itens)) return false;
  const t = inspMontarTmpl_(r.itens);
  if (!t.length) return false;
  const mudou = JSON.stringify(t) !== JSON.stringify(INSP_TMPL);
  INSP_TMPL = t; inspTmplGravarCache_(t);
  if (r.avisos && r.avisos.length) console.warn('[SIGMAN] avisos da lista de inspeção:', r.avisos);
  return mudou;
}

// Há algo marcado/digitado no formulário? (nesse caso nunca reconstruímos a tela)
function inspTemMarcas_() {
  return Array.from(document.querySelectorAll('#insp-secs .insp-row')).some(row =>
    row.dataset.status || Array.from(row.querySelectorAll('input')).some(i => String(i.value || '').trim() !== ''));
}

function inspAbrirPagina_() {
  if (!INSP_TMPL.length) INSP_TMPL = inspTmplLerCache_();
  buildInsp();
  apiLoadInspecoes().catch(() => {});   // histórico do relatório; não mexe no formulário
  inspCarregarTmpl_().then(mudou => {
    if (!mudou) return;
    if (inspTemMarcas_()) showToast('A lista de inspeção foi atualizada. Salve esta inspeção e reabra a tela para ver as mudanças.');
    else buildInsp();
  }).catch(() => {});
}

// Alerta de NÃO OK no dashboard (só alerta; não abre O.S.). force=true ignora o intervalo de 1 minuto.
async function inspAlertasAtualizar_(force) {
  const box = document.getElementById('dash-insp-alert');
  if (!box) return;
  const login = (typeof CU !== 'undefined' && CU) ? CU.login : '';
  if (!login || ['administracao', 'manutencao', 'diretoria'].indexOf(CU.tipo) < 0) { box.style.display = 'none'; box.innerHTML = ''; return; }
  if (_inspAlertasUser !== login) { _inspAlertasUser = login; _inspAlertasRes = null; _inspAlertasTs = 0; }
  const pintar = () => { const h = inspAlertasHtml_(_inspAlertasRes); box.innerHTML = h; box.style.display = h ? 'block' : 'none'; };
  pintar();
  if (!force && Date.now() - _inspAlertasTs < INSP_ALERTAS_TTL_MS) return;
  _inspAlertasTs = Date.now();          // marca antes de esperar: renderDash roda várias vezes seguidas
  try {
    const r = await apiGet({ action: 'inspAlertas' });
    if (r && r.ok && _inspAlertasUser === login) { _inspAlertasRes = r; pintar(); } else if (!(r && r.ok)) _inspAlertasTs = 0;
  } catch (e) { _inspAlertasTs = 0; }
}

function buildInsp() {
  const c = document.getElementById('insp-secs');
  // Sempre reconstrói para resetar estado
  c.dataset.built = '1';
  if (!INSP_TMPL.length) {
    c.innerHTML = '<div class="empty"><div class="ei">🔍</div><p>A lista de inspeção ainda não foi carregada. Conecte-se à internet e reabra esta tela.</p></div>';
    return;
  }
  c.innerHTML = INSP_TMPL.map(sec => `
    <div class="insp-sec open">
      <div class="insp-hd" onclick="this.parentElement.classList.toggle('open')">
        <div class="insp-ht">${_esc(sec.sala)}</div>
        <span class="insp-chev">▶</span>
      </div>
      <div class="insp-bd">
        ${sec.equips.map(eq => renderEquip(eq)).join('')}
      </div>
    </div>`).join('');
}

function renderEquip(eq) {
  let html = `
    <div class="insp-row" id="row-${_esc(eq.id)}">
      <div class="insp-eq">${_esc(eq.nome)}</div>
      <div class="insp-btns">
        <button class="iok"  onclick="setStatus('${_escAttr(eq.id)}','ok',this)">OK</button>
        <button class="inok" onclick="setStatus('${_escAttr(eq.id)}','nok',this)">NÃO OK</button>
      </div>
      <div class="itime"><input type="time" id="t-${_esc(eq.id)}"></div>
      <div class="iobs"><input type="text" id="o-${_esc(eq.id)}" placeholder="Observações..."></div>
    </div>`;
  if (eq.subs && eq.subs.length) {
    html += `<div class="insp-sub-lbl">${_esc(eq.nome)} — Sub-itens</div><div class="insp-sub">`;
    html += eq.subs.map(s => `
      <div class="insp-row" id="row-${_esc(s.id)}">
        <div class="insp-eq">${_esc(s.nome)}</div>
        <div class="insp-btns">
          <button class="iok"  onclick="setStatus('${_escAttr(s.id)}','ok',this)">OK</button>
          <button class="inok" onclick="setStatus('${_escAttr(s.id)}','nok',this)">NÃO OK</button>
        </div>
        <div class="itime"><input type="time" id="t-${_esc(s.id)}"></div>
        <div class="iobs"><input type="text" id="o-${_esc(s.id)}" placeholder="Observações..."></div>
      </div>`).join('');
    html += '</div>';
  }
  return html;
}

function setStatus(id,st,btn) {
  const row = document.getElementById('row-'+id);
  row.querySelectorAll('.iok,.inok').forEach(b=>b.classList.remove('on'));
  btn.classList.add('on'); row.dataset.status = st;
  if (st==='ok') {
    const ti = document.getElementById('t-'+id);
    if (ti&&!ti.value){const now=new Date();ti.value=String(now.getHours()).padStart(2,'0')+':'+String(now.getMinutes()).padStart(2,'0');}
  }
}

function collectInsp() {
  const data=[];
  INSP_TMPL.forEach(sec=>{
    const equips=[];
    sec.equips.forEach(eq=>{
      const row=document.getElementById('row-'+eq.id);if(!row)return;
      const subs=(eq.subs||[]).map(s=>{const sr=document.getElementById('row-'+s.id);if(!sr)return null;return{id:s.id,nome:s.nome,status:sr.dataset.status||'',hora:v('t-'+s.id),obs:v('o-'+s.id)};}).filter(Boolean);
      equips.push({id:eq.id,nome:eq.nome,status:row.dataset.status||'',hora:v('t-'+eq.id),obs:v('o-'+eq.id),subs});
    });
    data.push({sala:sec.sala,equips});
  });
  return data;
}

async function salvarInsp() {
  if (_salvandoInsp) return;
  const data=v('insp-dt'),turno=v('insp-tn'),manut=v('insp-mn').trim(),
        horas=parseInt(v('insp-horas'))||8;
  if(!data||!manut){showAlert('al-insp','Informe data e manutentor.','er');return;}
  const itens=collectInsp();
  // Monta TODAS as linhas em memória e envia em UMA única chamada POST
  const rows = [];
  itens.forEach(sec => {
    sec.equips.forEach(eq => {
      if (!eq.status) return; // item não avaliado: não grava
      rows.push({
        Data:data, Turno:turno, Horas_Turno:horas,
        Manutentor:manut, Sala:sec.sala, Equipamento:eq.nome,
        Sub_Item:'', Status:eq.status, Hora:eq.hora||'',
        Observacoes:eq.obs||''
      });
      (eq.subs||[]).forEach(s => {
        if (!s.status) return;
        rows.push({
          Data:data, Turno:turno, Horas_Turno:horas,
          Manutentor:manut, Sala:sec.sala, Equipamento:eq.nome,
          Sub_Item:s.nome, Status:s.status, Hora:s.hora||'',
          Observacoes:s.obs||''
        });
      });
    });
  });
  if (!rows.length) { showAlert('al-insp','Avalie ao menos um item (OK ou NÃO OK) antes de salvar.','er'); return; }
  // Mesmo conteúdo = mesmo ID: se a 1ª tentativa ficou na fila offline e o usuário salva de novo, o servidor reconhece e não duplica.
  const assin = JSON.stringify([data, turno, manut, horas, rows.map(r => [r.Sala, r.Equipamento, r.Sub_Item, r.Status, r.Hora, r.Observacoes])]);
  if (assin !== _inspUltimaAssin) { _inspUltimaAssin = assin; _inspUltimoId = crypto.randomUUID(); }
  const id=_inspUltimoId, agora=new Date().toISOString();
  rows.forEach(r => { r.ID_Inspecao = id; });
  _salvandoInsp = true;
  document.querySelectorAll('button[onclick="salvarInsp()"]').forEach(b => { b.disabled = true; });
  try {
    db.inspecoes = db.inspecoes.filter(i => i.id !== id);
    db.inspecoes.push({id,data,turno,horasTurno:horas,manut,itens,criadoEm:agora});
    db.inspC++; saveDB();
    showAlert('al-insp', `Salvando ${rows.length} itens...`, 'ok');
    const r = await apiPost({ action:'appendBatch', sheet:'inspecoes', rows });
    if (!r) { showAlert('al-insp', 'Sem conexão: a inspeção ficou guardada e será enviada automaticamente.', 'er'); return; }
    if (!r.ok) {
      showAlert('al-insp', _erroPermanente(r) ? 'O servidor recusou a inspeção: ' + (r.error || r.code) : 'Servidor indisponível: a inspeção ficou guardada e será reenviada.', 'er');
      return;
    }
    _inspUltimaAssin = ''; _inspUltimoId = '';
    showAlert('al-insp', r.duplicado ? 'Esta inspeção já estava salva.' : `Inspeção salva! ${rows.length} itens gravados.`, 'ok');
    inspAlertasAtualizar_(true);
    setTimeout(()=>showPage('dashboard'), 900);
  } finally {
    _salvandoInsp = false;
    document.querySelectorAll('button[onclick="salvarInsp()"]').forEach(b => { b.disabled = false; });
  }
}

function gerarTextoRel(insp) {
  if (!insp) return '';
  let txt = `*INSPEÇÃO DIÁRIA — ${insp.data} — ${insp.turno}*\n*Manutentor: ${insp.manut}*\n\n`;
  if (!insp.itens || !insp.itens.length) return txt + '(sem itens registrados)';

  // Detecta formato: hierárquico (salvo localmente) ou plano (vindo do Sheets)
  const isHierarquico = insp.itens[0] && 'equips' in insp.itens[0];

  if (isHierarquico) {
    // formato local: itens[] → { sala, equips:[{nome, status, hora, obs, subs:[...]}] }
    insp.itens.forEach(sec => {
      txt += `● Sala: ${sec.sala}\n`;
      (sec.equips || []).forEach(eq => {
        if (!eq.status) return;
        txt += `${eq.nome} / ${eq.status === 'ok' ? 'ok' : 'Não vai rodar'}`;
        txt += `${eq.hora ? ' ' + eq.hora + 'h' : ''}${eq.obs ? ' – ' + eq.obs : ''}\n`;
        (eq.subs || []).forEach(s => {
          if (!s.status) return;
          txt += `  ${s.nome} / ${s.status === 'ok' ? 'ok' : 'Não vai rodar'}`;
          txt += `${s.hora ? ' ' + s.hora + 'h' : ''}${s.obs ? ' – ' + s.obs : ''}\n`;
        });
      });
      txt += '\n';
    });
  } else {
    // formato Sheets: itens[] → { sala, equip, sub, status, hora, obs }
    const bySala = {};
    insp.itens.forEach(item => {
      if (!bySala[item.sala]) bySala[item.sala] = [];
      bySala[item.sala].push(item);
    });
    Object.entries(bySala).forEach(([sala, items]) => {
      txt += `● Sala: ${sala}\n`;
      items.forEach(item => {
        if (!item.status) return;
        const nome = item.sub ? `${item.equip} / ${item.sub}` : item.equip;
        txt += `${nome} / ${item.status === 'ok' ? 'ok' : 'Não vai rodar'}`;
        txt += `${item.hora ? ' ' + item.hora + 'h' : ''}${item.obs ? ' – ' + item.obs : ''}\n`;
      });
      txt += '\n';
    });
  }
  return txt;
}

function gerarRel() {
  const pgAtiva=document.getElementById('pg-inspecao').classList.contains('on');
  let txt='';
  if(pgAtiva){const itens=collectInsp();txt=gerarTextoRel({data:v('insp-dt'),turno:v('insp-tn'),manut:v('insp-mn'),itens});}
  else{const last=[...db.inspecoes].sort((a,b)=>(b.data||'').localeCompare(a.data||''))[0];if(last)txt=gerarTextoRel(last);}
  if(!txt){showToast('Nenhuma inspeção.');return;}
  document.getElementById('m-rel-b').textContent=txt;openM('m-rel');
}

// Histórico de inspeções (lista para navegar 1 a 1)
let _inspIdx = 0;
function verRelatorio() {
  const sorted=[...db.inspecoes].sort((a,b)=>(b.data||'').localeCompare(a.data||''));
  if(!sorted.length){showToast('Nenhuma inspeção registrada.');return;}
  _inspIdx=0;
  mostrarInspRel(sorted,_inspIdx);
}
function mostrarInspRel(sorted,idx) {
  const insp=sorted[idx];
  const nav=`<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
    <button class="btn btn-sm btn-gh" onclick="navInspRel(${idx-1})" ${idx===0?'disabled':''}>◀ Anterior</button>
    <span style="font-size:14px;color:var(--txt3)">${idx+1} de ${_esc(sorted.length)}</span>
    <button class="btn btn-sm btn-gh" onclick="navInspRel(${idx+1})" ${idx===sorted.length-1?'disabled':''}>Próxima ▶</button>
  </div>`;
  document.getElementById('m-rel-b').innerHTML='';
  const pre=document.createElement('pre');pre.style.cssText='white-space:pre-wrap;font-family:var(--fm);font-size:13px;color:var(--txt2);line-height:1.9';
  pre.textContent=gerarTextoRel(insp);
  document.getElementById('m-rel-b').innerHTML=nav;
  document.getElementById('m-rel-b').appendChild(pre);
  openM('m-rel');
}
function navInspRel(idx){
  const sorted=[...db.inspecoes].sort((a,b)=>(b.data||'').localeCompare(a.data||''));
  if(idx<0||idx>=sorted.length)return;
  _inspIdx=idx;mostrarInspRel(sorted,idx);
}
  
function copyRel(){
  const pre = document.querySelector('#m-rel-b pre');
  const txt = pre ? pre.textContent : (document.getElementById('m-rel-b').textContent || '');
  navigator.clipboard.writeText(txt).then(()=>showToast('Copiado!'));
}
  
function imprimirInspDiaria() {
  // Detecta qual inspeção está sendo exibida no modal
  const pgAtiva = document.getElementById('pg-inspecao').classList.contains('on');
  let insp;
  if (pgAtiva) {
    insp = {
      data:       v('insp-dt'),
      turno:      v('insp-tn'),
      horasTurno: parseInt(v('insp-horas')) || 10,
      manut:      v('insp-mn'),
      itens:      collectInsp()
    };
  } else {
    const sorted = [...db.inspecoes].sort((a,b) => (b.data||'').localeCompare(a.data||''));
    insp = sorted[_inspIdx] || sorted[0];
  }
  if (!insp) { showToast('Nenhuma inspeção para imprimir.'); return; }

  const isHierarquico = insp.itens && insp.itens[0] && 'equips' in insp.itens[0];

  // Monta linhas da tabela
  let linhas = '';
  if (isHierarquico) {
    insp.itens.forEach(sec => {
      linhas += `<tr><td colspan="4" style="background:#f0f0f0;font-weight:700;font-size:13px;padding:5px 8px;border-left:3px solid #C41230">● ${_esc(sec.sala)}</td></tr>`;
      (sec.equips || []).forEach(eq => {
        if (!eq.status) return;
        const stOk  = eq.status === 'ok';
        linhas += `<tr>
          <td style="padding-left:14px">${_esc(eq.nome)}</td>
          <td style="text-align:center">${stOk ? '✔' : ''}</td>
          <td style="text-align:center">${!stOk ? '✘' : ''}</td>
          <td>${_esc(eq.hora||'')}${eq.obs?_esc(' — '+eq.obs):''}</td>
        </tr>`;
        (eq.subs || []).forEach(s => {
          if (!s.status) return;
          const sOk = s.status === 'ok';
          linhas += `<tr style="background:#fafafa">
            <td style="padding-left:28px;font-size:11px;color:#444">↳ ${_esc(s.nome)}</td>
            <td style="text-align:center">${sOk ? '✔' : ''}</td>
            <td style="text-align:center">${!sOk ? '✘' : ''}</td>
            <td style="font-size:11px">${_esc(s.hora||'')}${s.obs?_esc(' — '+s.obs):''}</td>
          </tr>`;
        });
      });
    });
  } else {
    const bySala = {};
    (insp.itens || []).forEach(item => {
      if (!bySala[item.sala]) bySala[item.sala] = [];
      bySala[item.sala].push(item);
    });
    Object.entries(bySala).forEach(([sala, items]) => {
      linhas += `<tr><td colspan="4" style="background:#f0f0f0;font-weight:700;font-size:13px;padding:5px 8px;border-left:3px solid #C41230">● ${_esc(sala)}</td></tr>`;
      items.forEach(item => {
        if (!item.status) return;
        const stOk = item.status === 'ok';
        const nome = item.sub ? `${item.equip} / ${item.sub}` : item.equip;
        linhas += `<tr>
          <td style="padding-left:14px">${_esc(nome)}</td>
          <td style="text-align:center">${stOk ? '✔' : ''}</td>
          <td style="text-align:center">${!stOk ? '✘' : ''}</td>
          <td>${_esc(item.hora||'')}${item.obs?_esc(' — '+item.obs):''}</td>
        </tr>`;
      });
    });
  }

  const win = window.open('', '_blank');
  win.document.write(`<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">
  <title>INSPEÇÃO DIÁRIA</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:Arial,sans-serif;font-size:13px;color:#000;padding:15mm}
    .header{display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #C41230;padding-bottom:8px;margin-bottom:12px}
    .header-left{display:flex;align-items:center;gap:12px}
    .header-left img{height:44px;object-fit:contain}
    h1{font-size:17px;color:#C41230;margin-bottom:2px}
    .info-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:12px}
    .info-box{border:1px solid #ccc;border-radius:3px;padding:5px 8px}
    .info-label{font-size:10px;color:#666;text-transform:uppercase}
    .info-val{font-size:14px;font-weight:bold}
    table{width:100%;border-collapse:collapse;margin-bottom:12px}
    th{background:#C41230;color:#fff;padding:6px 8px;text-align:left;font-size:11px}
    td{padding:5px 8px;border:1px solid #ddd;vertical-align:middle}
    tr:nth-child(even) td{background:#fafafa}
    .assinatura{border-top:1px solid #000;width:200px;margin-top:40px;padding-top:4px;font-size:10px}
    @media print{body{padding:10mm}}
  </style></head><body>
  <div class="header">
    <div class="header-left">
      <img src="https://muffatofoods.com.br/assets/images/foods_logo.png" alt="Muffato Foods">
      <div><div style="font-weight:bold;font-size:15px">MUFFATO FOODS</div><div style="font-size:11px;color:#666">Gestão de Manutenção — SIGMAN</div></div>
    </div>
    <div style="text-align:center"><h1>INSPEÇÃO DIÁRIA</h1></div>
    <div style="text-align:right;font-size:10px;color:#666">Doc: SIGMAN-INSP<br>Rev: 01</div>
  </div>
  <div class="info-grid">
    <div class="info-box"><div class="info-label">Data</div><div class="info-val">${_esc(fd(insp.data))}</div></div>
    <div class="info-box"><div class="info-label">Turno</div><div class="info-val">${_esc(insp.turno||'—')}</div></div>
    <div class="info-box"><div class="info-label">Horas do Turno</div><div class="info-val">${_esc(insp.horasTurno||8)}h</div></div>
    <div class="info-box"><div class="info-label">Manutentor</div><div class="info-val">${_esc(insp.manut||'—')}</div></div>
  </div>
  <table>
    <tr>
      <th style="width:40%">Equipamento / Sub-item</th>
      <th style="width:8%;text-align:center">OK</th>
      <th style="width:8%;text-align:center">NOK</th>
      <th>Hora / Observações</th>
    </tr>
    ${linhas || '<tr><td colspan="4" style="text-align:center;color:#999;padding:20px">Nenhum item registrado</td></tr>'}
  </table>
  <div style="display:flex;justify-content:space-between;margin-top:20px">
    <div><div class="assinatura">Assinatura do Manutentor</div></div>
    <div><div class="assinatura">Visto do Supervisor</div></div>
  </div>
  <script>window.print();<\/script></body></html>`);
  win.document.close();
}
   