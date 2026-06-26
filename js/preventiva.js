/* ══════════════════════════════════════════════════════════════════
   SIGMAN — PREVENTIVA (template - admin)
   Muffato Foods
   ══════════════════════════════════════════════════════════════════ */

const PREV_TAREFAS = {
  Mecânico: [
    'Inspecionar e apertar parafusos e fixações gerais',
    'Verificar desgaste e alinhamento de correias/correntes',
    'Inspecionar e substituir rolamentos (se necessário)',
    'Lubrificar pontos de lubrificação conforme plano',
    'Verificar e substituir vedações/gaxetas/retentores',
    'Limpar e inspecionar filtros',
    'Verificar folgas e ajustar componentes mecânicos',
    'Inspecionar acoplamentos e juntas',
    'Testar dispositivos de segurança mecânicos'
  ],
  Elétrico: [
    'Inspecionar e apertar conexões elétricas do quadro',
    'Medir e registrar corrente do motor (nominal × real)',
    'Verificar temperatura do motor e cabos',
    'Inspecionar e substituir fusíveis (se necessário)',
    'Verificar estado do inversor de frequência',
    'Testar e ajustar relés e proteções termomagnéticas',
    'Inspecionar sensores, fim-de-curso e botões de emergência',
    'Verificar aterramento',
    'Testar funcionamento da IHM/painel de controle'
  ],
  'Pneumático / Hidráulico': [
    'Verificar e registrar pressão de trabalho',
    'Identificar e eliminar vazamentos',
    'Trocar elemento filtrante do filtro de linha',
    'Drenar condensados do filtro',
    'Inspecionar cilindros (vedação e fixação)',
    'Verificar e ajustar reguladores de pressão',
    'Inspecionar mangueiras e conexões'
  ],
  'Limpeza e Organização': [
    'Limpeza externa completa da máquina',
    'Limpeza interna (interior do quadro elétrico)',
    'Remover acúmulo de produto/resíduo',
    'Verificar estado das proteções e guardas',
    'Conferir identificações e etiquetas da máquina'
  ]
};

function initPreventiva() {
  const sel = document.getElementById('prev-maq');
  if (!sel) return;
  sel.innerHTML = '<option value="">Selecione...</option>';
  [...db.maquinas].sort((a,b)=>a.nome.localeCompare(b.nome)).forEach(m=>{
    sel.innerHTML+=`<option value="${m.sala}|${m.nome}|${m.tag}|${m.periodicidade||'Mensal'}">${m.nome} (${m.sala})${m.tag?' – '+m.tag:''}</option>`;
  });
  sv('prev-dt',today());
  if(CU.tipo!=='producao') sv('prev-mn',CU.nome);
  carregarTarefasPreventiva();
}

function carregarTarefasPreventiva() {
  const maqVal=v('prev-maq').split('|');
  const per=maqVal[3]||v('prev-periodo')||'Mensal';
  if(maqVal[3]) sv('prev-periodo',maqVal[3]);

  const body = Object.entries(PREV_TAREFAS).map(([grp,tarefas],gi)=>`
    <div class="card" style="margin-bottom:10px">
      <div class="card-t">${grp}</div>
      ${tarefas.map((t,ti)=>`
        <div class="prev-row" data-key="${gi}-${ti}" style="display:grid;grid-template-columns:1fr auto auto 1.5fr;gap:8px;align-items:center;padding:7px 0;border-bottom:1px solid var(--bord)">
          <div style="font-size:13px">${t}</div>
          <div style="display:flex;gap:5px">
            <button class="iok"  onclick="setPrevStatus('${gi}-${ti}','ok',this)">OK</button>
            <button class="inok" onclick="setPrevStatus('${gi}-${ti}','nok',this)">NOK</button>          
          </div>
          <div><input type="number" placeholder="min" style="background:var(--inp);border:1px solid var(--bord);border-radius:4px;color:var(--txt);font-size:12px;padding:4px;width:60px;outline:none" id="pvmin-${gi}-${ti}"></div>
          <div><input type="text" placeholder="Materiais / Observações" style="background:var(--inp);border:1px solid var(--bord);border-radius:4px;color:var(--txt);font-size:12px;padding:4px 8px;width:100%;outline:none" id="pvobs-${gi}-${ti}"></div>
          <input type="hidden" value="" id="pvst-${gi}-${ti}">
        </div>`).join('')}
    </div>`).join('');
  document.getElementById('prev-body').innerHTML=body;
}

async function salvarPreventiva() {
  const maqVal=v('prev-maq').split('|');
  const data=v('prev-dt'),manut=v('prev-mn').trim(),per=v('prev-periodo');
  if(!maqVal[1]||!data||!manut){showToast('Selecione máquina, data e manutentor.');return;}
  const agora=new Date().toISOString();
  Object.entries(PREV_TAREFAS).forEach(([grp,tarefas],gi)=>{
    tarefas.forEach((t,ti)=>{
      const st=v('pvst-'+gi+'-'+ti);
      if(!st)return;
      apiAppend('preventiva',{
        ID:agora,Data_Execucao:data,Maquina:maqVal[1],Tag:maqVal[2],
        Manutentor:manut,Periodicidade:per,Tarefa:grp+' — '+t,
        Status:st,Duracao_Min:v('pvmin-'+gi+'-'+ti)||0,
        Materiais:v('pvobs-'+gi+'-'+ti),Observacoes:'',Criado_Em:agora
      });
    });
  });
  showToast('Preventiva salva no banco de dados!');
}

function imprimirPreventiva() {
  const maqVal=v('prev-maq').split('|');
  const data=v('prev-dt')||today(),manut=v('prev-mn')||'_______________',per=v('prev-periodo')||'Mensal';
  const win=window.open('','_blank');
  win.document.write(`<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">
  <title>ORDEM DE MANUTENÇÃO PREVENTIVA</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}body{font-family:Arial,sans-serif;font-size:11px;color:#000;padding:15mm}
    h1{font-size:15px;text-align:center;color:#C41230;margin-bottom:4px}
    h2{font-size:12px;margin:10px 0 4px;background:#f0f0f0;padding:4px 8px;border-left:3px solid #C41230}
    .header{display:flex;justify-content:space-between;border-bottom:2px solid #C41230;padding-bottom:8px;margin-bottom:10px}
    .info-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:10px}
    .info-box{border:1px solid #ccc;border-radius:3px;padding:5px 8px}
    .info-label{font-size:9px;color:#666;text-transform:uppercase}
    .info-val{font-size:12px;font-weight:bold}
    table{width:100%;border-collapse:collapse;margin-bottom:8px}
    th{background:#C41230;color:#fff;padding:5px 7px;text-align:left;font-size:10px}
    td{padding:5px 7px;border:1px solid #ddd}
    .cb{width:14px;height:14px;border:1px solid #999;border-radius:2px;display:inline-block}
    .assinatura{border-top:1px solid #000;width:180px;margin-top:30px;padding-top:4px;font-size:9px}
    @media print{body{padding:10mm}}
  </style></head><body>
  <div class="header">
    <div style="display:flex;align-items:center;gap:10px">
      <img src="https://muffatofoods.com.br/assets/images/foods_logo.png" style="height:44px;object-fit:contain" alt="Muffato">
      <div><b>MUFFATO FOODS</b><br>Gestão de Manutenção — PCM</div>
    </div>
    <div><h1>ORDEM DE MANUTENÇÃO PREVENTIVA</h1></div>
    <div style="text-align:right;font-size:10px">Doc: SIGMAN-PREV<br>Rev: 01</div>
  </div>
  <div class="info-grid">
    <div class="info-box"><div class="info-label">Máquina</div><div class="info-val">${maqVal[1]||'___'}</div></div>
    <div class="info-box"><div class="info-label">Tag</div><div class="info-val">${maqVal[2]||'___'}</div></div>
    <div class="info-box"><div class="info-label">Data</div><div class="info-val">${fd(data)}</div></div>
    <div class="info-box"><div class="info-label">Periodicidade</div><div class="info-val">${per}</div></div>
    <div class="info-box" style="grid-column:span 2"><div class="info-label">Manutentor</div><div class="info-val">${manut}</div></div>
    <div class="info-box"><div class="info-label">Hora Início</div><div class="info-val">___:___</div></div>
    <div class="info-box"><div class="info-label">Hora Fim</div><div class="info-val">___:___</div></div>
  </div>
  ${Object.entries(PREV_TAREFAS).map(([grp,tarefas])=>`
  <h2>${grp}</h2>
  <table>
    <tr><th style="width:45%">Tarefa</th><th style="width:7%">OK</th><th style="width:7%">NOK</th><th style="width:18%">Duração (min)</th><th>Materiais / Observações</th></tr>
    ${tarefas.map(t=>`<tr>
      <td>${t}</td>
      <td style="text-align:center"><span class="cb"></span></td>
      <td style="text-align:center"><span class="cb"></span></td>
      <td></td><td></td>
    </tr>`).join('')}
  </table>`).join('')}
  <div style="display:flex;justify-content:space-between;margin-top:15px">
    <div><div class="assinatura">Assinatura do Manutentor</div></div>
    <div><div class="assinatura">Aprovação do Supervisor</div></div>
    <div><div class="assinatura">Revisão Próxima</div></div>
  </div>
  <script>window.print();<\/script></body></html>`);
  win.document.close();
}