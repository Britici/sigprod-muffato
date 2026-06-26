/* ═══════════════════════════════════════════════════════════════════════
   SIGMAN — Módulo: Solicitação de Compras
   Muffato Foods | PCM · Compras
   Integração: ComprasSolicitacao.render(el, { cache, user, gsUrl })
   ═══════════════════════════════════════════════════════════════════════ */

(function (global) {
  'use strict';

  /* ── CSS ──────────────────────────────────────────────────────────── */
  const CSS_ID = 'css-sigman-compras-sol';
  if (!document.getElementById(CSS_ID)) {
    const s = document.createElement('style');
    s.id = CSS_ID;
    s.textContent = `
/* SIGMAN Compras – Solicitação */
.csl-wrap{padding:20px;max-width:960px;margin:0 auto;font-family:inherit}
.csl-header{display:flex;align-items:center;gap:14px;margin-bottom:24px}
.csl-header h2{margin:0;font-size:1.25rem;font-weight:700;color:#e2e8f0}
.csl-header p{margin:4px 0 0;font-size:.8rem;color:#64748b}
.csl-header-icon{font-size:1.8rem;line-height:1}

.csl-section{background:#1e2533;border:1px solid #2d3748;border-radius:10px;padding:20px;margin-bottom:16px}
.csl-section-title{display:flex;align-items:center;gap:8px;font-size:.72rem;font-weight:700;
  letter-spacing:.1em;text-transform:uppercase;color:#94a3b8;margin-bottom:16px}
.csl-section-dot{width:3px;height:16px;background:#C41230;border-radius:2px;flex-shrink:0}

.csl-grid2{display:grid;grid-template-columns:1fr 1fr;gap:14px}
@media(max-width:600px){.csl-grid2{grid-template-columns:1fr}}

.csl-field{display:flex;flex-direction:column;gap:6px;margin-bottom:4px}
.csl-field label{font-size:.78rem;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:.06em}
.csl-field .req{color:#C41230}
.csl-field .opt{color:#475569;font-weight:400;text-transform:none;letter-spacing:0}

.csl-field select,
.csl-field input[type=text],
.csl-field input[type=number],
.csl-field textarea{
  background:#141c2d;border:1px solid #2d3748;color:#e2e8f0;border-radius:7px;
  padding:10px 12px;font-size:.9rem;outline:none;transition:border-color .2s;
  font-family:inherit;resize:vertical
}
.csl-field select:focus,
.csl-field input:focus,
.csl-field textarea:focus{border-color:#C41230}
.csl-field select:disabled,
.csl-field input[readonly]{color:#475569;cursor:default}
.csl-field select option{background:#1e2533}

/* Prioridade colors in select */
.pri-1{color:#ef4444!important}
.pri-2{color:#eab308!important}
.pri-3{color:#3b82f6!important}
.pri-4{color:#22c55e!important}

/* Foto drop zone */
.csl-foto-drop{
  border:2px dashed #2d3748;border-radius:8px;padding:28px;text-align:center;
  color:#475569;cursor:pointer;transition:border-color .2s,background .2s;font-size:.9rem
}
.csl-foto-drop:hover,.csl-foto-drop.drag-over{border-color:#C41230;background:#1a0a0f;color:#e2e8f0}
.csl-foto-drop svg{display:block;margin:0 auto 8px;opacity:.5}

.csl-foto-preview{display:flex;flex-wrap:wrap;gap:10px;margin-top:12px}
.csl-thumb{position:relative;width:90px;height:90px;border-radius:6px;overflow:hidden;
  border:1px solid #2d3748;flex-shrink:0}
.csl-thumb img{width:100%;height:100%;object-fit:cover}
.csl-thumb-del{position:absolute;top:3px;right:3px;background:rgba(0,0,0,.7);border:none;
  color:#fff;border-radius:50%;width:20px;height:20px;font-size:.65rem;cursor:pointer;
  display:flex;align-items:center;justify-content:center;line-height:1}
.csl-thumb-del:hover{background:#C41230}
.csl-thumb-name{position:absolute;bottom:0;left:0;right:0;background:rgba(0,0,0,.65);
  color:#e2e8f0;font-size:.6rem;padding:2px 4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}

.csl-actions{display:flex;justify-content:flex-end;gap:12px;margin-top:20px}
.btn-csl-secondary{
  padding:10px 22px;border-radius:7px;border:1px solid #2d3748;background:transparent;
  color:#94a3b8;font-size:.9rem;cursor:pointer;transition:background .2s
}
.btn-csl-secondary:hover{background:#1e2533}
.btn-csl-primary{
  padding:10px 28px;border-radius:7px;border:none;background:#C41230;
  color:#fff;font-size:.9rem;font-weight:600;cursor:pointer;
  transition:background .2s,opacity .2s;min-width:180px
}
.btn-csl-primary:hover{background:#a01028}
.btn-csl-primary:disabled{opacity:.5;cursor:not-allowed}

.csl-toast{
  position:fixed;bottom:24px;right:24px;z-index:9999;padding:12px 20px;
  border-radius:8px;font-size:.9rem;font-weight:500;opacity:0;pointer-events:none;
  transform:translateY(10px);transition:all .3s;max-width:360px
}
.csl-toast.show{opacity:1;transform:translateY(0)}
.csl-toast.ok{background:#14532d;color:#86efac;border:1px solid #22c55e}
.csl-toast.warn{background:#713f12;color:#fde68a;border:1px solid #eab308}
.csl-toast.err{background:#7f1d1d;color:#fca5a5;border:1px solid #ef4444}

.csl-spinner{display:inline-block;width:14px;height:14px;border:2px solid #fff4;
  border-top-color:#fff;border-radius:50%;animation:csl-spin .7s linear infinite;vertical-align:middle;margin-right:6px}
@keyframes csl-spin{to{transform:rotate(360deg)}}
    `;
    document.head.appendChild(s);
  }

  /* ── CONSTANTS ────────────────────────────────────────────────────── */
  const PRIORIDADES = [
    { val: 1, label: 'Emergencial', cor: '#ef4444', desc: 'Processo parado – compra imediata' },
    { val: 2, label: 'Urgente',     cor: '#eab308', desc: 'Risco de parada em até 15 dias' },
    { val: 3, label: 'Médio',       cor: '#3b82f6', desc: 'Entrega em até 45 dias' },
    { val: 4, label: 'Baixo',       cor: '#22c55e', desc: 'Entrega em até 90 dias' }
  ];
  const TIPOS_ACAO = ['Corretiva', 'Preventiva', 'Melhoria', 'Instalação', 'Reforma', 'Outros'];

  /* ── STATE ────────────────────────────────────────────────────────── */
  let _fotos = [];

  /* ── PUBLIC ───────────────────────────────────────────────────────── */
  function render(el, opts) {
    _fotos = [];
    const { cache = {}, user = {}, gsUrl } = opts;
    el.innerHTML = _buildHTML(cache, user);
    _bindEvents(el, opts);
  }

  /* ── HTML ─────────────────────────────────────────────────────────── */
  function _buildHTML(cache, user) {
    const salas   = (cache.salas   || []).filter(s => s.Ativo === 'sim');
    const nomeSolicitante = user.Nome || user.Login || '';

    const opsSalas = salas.map(s =>
      `<option value="${_esc(s.Nome)}">${_esc(s.Nome)}</option>`
    ).join('');

    const opsTipos = TIPOS_ACAO.map(t =>
      `<option value="${t}">${t}</option>`
    ).join('');

    const opsPrioridade = PRIORIDADES.map(p =>
      `<option value="${p.val}" class="pri-${p.val}">${p.val} – ${p.label} · ${p.desc}</option>`
    ).join('');

    return `
<div class="csl-wrap">
  <div class="csl-header">
    <div class="csl-header-icon">🛒</div>
    <div>
      <h2>Solicitação de Compras</h2>
      <p>Preencha os campos obrigatórios e envie para o fluxo de aprovação</p>
    </div>
  </div>

  <form id="form-csl" novalidate autocomplete="off">

    <!-- IDENTIFICAÇÃO -->
    <div class="csl-section">
      <div class="csl-section-title"><span class="csl-section-dot"></span>Identificação</div>
      <div class="csl-grid2">
        <div class="csl-field">
          <label>Sala / Local <span class="req">*</span></label>
          <select id="csl-sala" required>
            <option value="">Selecione...</option>
            ${opsSalas}
          </select>
        </div>
        <div class="csl-field">
          <label>Máquina / Ativo <span class="req">*</span></label>
          <select id="csl-maquina" disabled required>
            <option value="">Selecione a sala</option>
          </select>
        </div>
        <div class="csl-field">
          <label>Tipo de Ação <span class="req">*</span></label>
          <select id="csl-tipo" required>
            <option value="">Selecione...</option>
            ${opsTipos}
          </select>
        </div>
        <div class="csl-field">
          <label>Prioridade <span class="req">*</span></label>
          <select id="csl-prioridade" required>
            <option value="">Selecione...</option>
            ${opsPrioridade}
          </select>
        </div>
      </div>
      <div class="csl-field" style="max-width:340px;margin-top:4px">
        <label>Manutentor Responsável</label>
        <input type="text" id="csl-manutentor" value="${_esc(nomeSolicitante)}" readonly>
      </div>
    </div>

    <!-- ITEM DE COMPRA -->
    <div class="csl-section">
      <div class="csl-section-title"><span class="csl-section-dot"></span>Item de Compra</div>
      <div class="csl-field">
        <label>Descrição do Item <span class="req">*</span></label>
        <textarea id="csl-descricao" rows="3" required
          placeholder="Descreva o item a ser adquirido (especificações, modelo, referência...)"></textarea>
      </div>
      <div class="csl-grid2">
        <div class="csl-field">
          <label>Quantidade <span class="req">*</span></label>
          <input type="number" id="csl-qtd" min="0.01" step="any" required placeholder="0">
        </div>
        <div class="csl-field">
          <label>Fornecedor Sugerido <span class="opt">(opcional)</span></label>
          <input type="text" id="csl-fornecedor" placeholder="Nome do fornecedor preferencial...">
        </div>
      </div>
    </div>

    <!-- AÇÃO PREVENTIVA -->
    <div class="csl-section">
      <div class="csl-section-title"><span class="csl-section-dot"></span>Ação Preventiva Identificada</div>
      <textarea id="csl-preventiva" rows="3"
        placeholder="Ação para evitar recorrência..."></textarea>
    </div>

    <!-- FOTOS -->
    <div class="csl-section">
      <div class="csl-section-title"><span class="csl-section-dot"></span>
        Fotos da OS <span class="opt" style="margin-left:6px">(opcional)</span>
      </div>
      <div id="csl-drop" class="csl-foto-drop">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
          <polyline points="21 15 16 10 5 21"/>
        </svg>
        📷 Clique para anexar fotos ou arraste aqui
        <input type="file" id="csl-foto-input" accept="image/*" multiple style="display:none">
      </div>
      <div id="csl-preview" class="csl-foto-preview"></div>
    </div>

    <!-- AÇÕES -->
    <div class="csl-actions">
      <button type="button" id="csl-btn-limpar" class="btn-csl-secondary">Limpar</button>
      <button type="submit" id="csl-btn-submit" class="btn-csl-primary">Enviar Solicitação</button>
    </div>

  </form>
  <div id="csl-toast" class="csl-toast"></div>
</div>`;
  }

  /* ── EVENTS ───────────────────────────────────────────────────────── */
  function _bindEvents(el, opts) {
    const { cache = {}, gsUrl } = opts;
    const q = id => el.querySelector(id);

    /* Sala → Máquina cascade */
    q('#csl-sala').addEventListener('change', function () {
      const sel  = q('#csl-maquina');
      const maq  = (cache.maquinas || []).filter(m => m.Sala === this.value && m.Ativo === 'sim');
      sel.innerHTML = maq.length
        ? `<option value="">Selecione...</option>` +
          maq.map(m => `<option value="${_esc(m.Nome)}">${_esc(m.Nome)}${m.Tag ? ' · ' + m.Tag : ''}</option>`).join('')
        : `<option value="">Nenhum ativo cadastrado</option>`;
      sel.disabled = !maq.length;
    });

    /* Foto — drop zone */
    const drop = q('#csl-drop');
    const finp = q('#csl-foto-input');
    drop.addEventListener('click', () => finp.click());
    drop.addEventListener('dragover', e => { e.preventDefault(); drop.classList.add('drag-over'); });
    drop.addEventListener('dragleave', () => drop.classList.remove('drag-over'));
    drop.addEventListener('drop', e => {
      e.preventDefault(); drop.classList.remove('drag-over');
      _addFotos(Array.from(e.dataTransfer.files), el);
    });
    finp.addEventListener('change', () => { _addFotos(Array.from(finp.files), el); finp.value = ''; });

    /* Limpar */
    q('#csl-btn-limpar').addEventListener('click', () => _limpar(el));

    /* Submit */
    q('#form-csl').addEventListener('submit', e => { e.preventDefault(); _submit(el, opts); });
  }

  function _addFotos(files, el) {
    files.forEach(f => {
      if (!f.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = ev => {
        _fotos.push({ name: f.name, mime: f.type, b64: ev.target.result.split(',')[1] });
        _renderPreview(el);
      };
      reader.readAsDataURL(f);
    });
  }

  function _renderPreview(el) {
    const c = el.querySelector('#csl-preview');
    c.innerHTML = _fotos.map((f, i) => `
      <div class="csl-thumb">
        <img src="data:${f.mime};base64,${f.b64}" alt="${_esc(f.name)}">
        <button type="button" class="csl-thumb-del" data-i="${i}" title="Remover">✕</button>
        <span class="csl-thumb-name">${_esc(f.name)}</span>
      </div>`).join('');
    c.querySelectorAll('.csl-thumb-del').forEach(btn =>
      btn.addEventListener('click', () => { _fotos.splice(+btn.dataset.i, 1); _renderPreview(el); })
    );
  }

  function _limpar(el) {
    el.querySelector('#form-csl').reset();
    const sel = el.querySelector('#csl-maquina');
    sel.innerHTML = '<option value="">Selecione a sala</option>';
    sel.disabled = true;
    _fotos = [];
    el.querySelector('#csl-preview').innerHTML = '';
  }

  /* ── SUBMIT ───────────────────────────────────────────────────────── */
  async function _submit(el, opts) {
    const { user = {}, gsUrl } = opts;
    const q  = id => el.querySelector(id);
    const btn = q('#csl-btn-submit');

    const sala       = q('#csl-sala').value;
    const maquina    = q('#csl-maquina').value;
    const tipo       = q('#csl-tipo').value;
    const prioridade = q('#csl-prioridade').value;
    const descricao  = q('#csl-descricao').value.trim();
    const qtd        = q('#csl-qtd').value;

    if (!sala || !maquina || !tipo || !prioridade || !descricao || !qtd) {
      _toast(el, '⚠️ Preencha todos os campos obrigatórios.', 'warn');
      return;
    }

    btn.disabled = true;
    btn.innerHTML = `<span class="csl-spinner"></span>Enviando...`;

    try {
      /* 1 — Upload fotos (sequential para não sobrecarregar) */
      const urlsFotos = [];
      const idTemp = 'OC_' + Date.now();
      for (const f of _fotos) {
        const r = await _post(gsUrl, {
          action: 'uploadFoto',
          numero: idTemp,
          fileName: f.name,
          mimeType: f.mime,
          base64: f.b64
        });
        if (r.ok && r.fileUrl) urlsFotos.push(r.fileUrl);
      }

      /* 2 — Criar ordem */
      const r = await _post(gsUrl, {
        action: 'addOrdemCompra',
        dados: {
          solicitante:    user.Nome || user.Login || '',
          sala, maquina,
          tipoAcao:       tipo,
          prioridade:     Number(prioridade),
          descricao,
          quantidade:     q('#csl-qtd').value,
          fornecedor:     q('#csl-fornecedor').value.trim(),
          acaoPreventiva: q('#csl-preventiva').value.trim(),
          fotos:          urlsFotos
        }
      });

      if (!r.ok) throw new Error(r.error || 'Erro no servidor');

      _toast(el, `✅ Solicitação criada! ID: ${r.id}`, 'ok');
      setTimeout(() => _limpar(el), 1800);

    } catch (err) {
      _toast(el, '❌ ' + err.message, 'err');
    } finally {
      btn.disabled = false;
      btn.textContent = 'Enviar Solicitação';
    }
  }

  /* ── UTILS ────────────────────────────────────────────────────────── */
  async function _post(url, payload) {
    const r = await fetch(url, { method: 'POST', body: JSON.stringify(payload) });
    return r.json();
  }

  function _toast(el, msg, type) {
    const t = el.querySelector('#csl-toast');
    t.textContent = msg;
    t.className = `csl-toast ${type} show`;
    clearTimeout(t._tid);
    t._tid = setTimeout(() => t.classList.remove('show'), 5000);
  }

  function _esc(s) {
    return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  /* ── EXPORT ───────────────────────────────────────────────────────── */
  global.ComprasSolicitacao = { render };

})(window);
