/* ═══════════════════════════════════════════════════════════════════════
   SIGMAN — Módulo: Acompanhamento das Ordens de Compra
   Muffato Foods | PCM · Compras
   Integração: ComprasAcompanhamento.render(el, { cache, user, gsUrl })
   ═══════════════════════════════════════════════════════════════════════ */

(function (global) {
  'use strict';

  /* ── CSS ──────────────────────────────────────────────────────────── */
  const CSS_ID = 'css-sigman-compras-aco';
  if (!document.getElementById(CSS_ID)) {
    const s = document.createElement('style');
    s.id = CSS_ID;
    s.textContent = `
/* SIGMAN Compras – Acompanhamento */
.cac-wrap{padding:20px;max-width:1100px;margin:0 auto;font-family:inherit}
.cac-header{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;margin-bottom:20px}
.cac-header-left{display:flex;align-items:center;gap:14px}
.cac-header-icon{font-size:1.8rem;line-height:1}
.cac-header h2{margin:0;font-size:1.2rem;font-weight:700;color:#e2e8f0}
.cac-header p{margin:4px 0 0;font-size:.8rem;color:#64748b}
.btn-cac-refresh{padding:8px 16px;border-radius:7px;border:1px solid #2d3748;
  background:transparent;color:#94a3b8;font-size:.82rem;cursor:pointer;transition:background .2s}
.btn-cac-refresh:hover{background:#1e2533;color:#e2e8f0}

/* Filtros */
.cac-filtros{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:18px;align-items:center}
.cac-filtros select{background:#1e2533;border:1px solid #2d3748;color:#e2e8f0;
  border-radius:7px;padding:7px 12px;font-size:.83rem;outline:none;cursor:pointer}
.cac-filtros select:focus{border-color:#C41230}
.cac-search{background:#1e2533;border:1px solid #2d3748;color:#e2e8f0;border-radius:7px;
  padding:7px 12px;font-size:.83rem;outline:none;min-width:200px}
.cac-search:focus{border-color:#C41230}

/* Tabs */
.cac-tabs{display:flex;gap:0;margin-bottom:18px;border-bottom:2px solid #2d3748}
.cac-tab{padding:10px 22px;font-size:.88rem;font-weight:600;color:#64748b;cursor:pointer;
  border-bottom:2px solid transparent;margin-bottom:-2px;transition:color .2s,border-color .2s;
  user-select:none}
.cac-tab:hover{color:#e2e8f0}
.cac-tab.ativo{color:#e2e8f0;border-bottom-color:#C41230}
.cac-tab-count{display:inline-flex;align-items:center;justify-content:center;
  background:#2d3748;color:#94a3b8;border-radius:10px;font-size:.7rem;
  min-width:20px;height:18px;padding:0 6px;margin-left:7px}
.cac-tab.ativo .cac-tab-count{background:#C41230;color:#fff}

/* Cards */
.cac-empty{text-align:center;padding:60px 20px;color:#475569;font-size:.9rem}
.cac-empty svg{display:block;margin:0 auto 14px;opacity:.3}

.cac-card{background:#1e2533;border:1px solid #2d3748;border-radius:10px;
  margin-bottom:14px;overflow:hidden;transition:border-color .2s}
.cac-card:hover{border-color:#374151}
.cac-card.pri-1{border-left:4px solid #ef4444}
.cac-card.pri-2{border-left:4px solid #eab308}
.cac-card.pri-3{border-left:4px solid #3b82f6}
.cac-card.pri-4{border-left:4px solid #22c55e}
.cac-card.concluida{border-left:4px solid #22c55e;opacity:.75}
.cac-card.orcamento_recusado{border-left:4px solid #ef4444;opacity:.75}

.cac-card-head{display:flex;align-items:center;gap:12px;padding:14px 16px;
  cursor:pointer;user-select:none;flex-wrap:wrap}
.cac-card-id{font-size:.75rem;font-weight:700;color:#64748b;font-family:monospace}
.cac-card-desc{flex:1;font-size:.9rem;color:#e2e8f0;font-weight:500;
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}
.cac-card-meta{display:flex;align-items:center;gap:8px;flex-shrink:0;flex-wrap:wrap}
.cac-badge{display:inline-flex;align-items:center;padding:3px 10px;border-radius:20px;
  font-size:.7rem;font-weight:700;letter-spacing:.04em;border:1px solid currentColor}
.cac-badge.pri-1{color:#ef4444;background:#7f1d1d22}
.cac-badge.pri-2{color:#eab308;background:#71350022}
.cac-badge.pri-3{color:#3b82f6;background:#1e3a8a22}
.cac-badge.pri-4{color:#22c55e;background:#14532d22}
.cac-badge.status-em_andamento{color:#3b82f6;background:#1e3a8a22;border-color:#3b82f6}
.cac-badge.status-concluida{color:#22c55e;background:#14532d22;border-color:#22c55e}
.cac-badge.status-orcamento_recusado{color:#ef4444;background:#7f1d1d22;border-color:#ef4444}
.cac-badge.status-atrasada{color:#ef4444;background:#7f1d1d22;border-color:#ef4444}

.cac-card-toggle{color:#475569;font-size:.9rem;transition:transform .25s;margin-left:4px}
.cac-card-toggle.open{transform:rotate(180deg)}

.cac-card-body{padding:0 16px 18px;border-top:1px solid #1a2236;display:none}
.cac-card-body.open{display:block}

.cac-card-info{display:flex;gap:20px;flex-wrap:wrap;padding:12px 0 16px;font-size:.8rem;color:#64748b}
.cac-card-info span b{color:#94a3b8;font-weight:600}

/* Stepper */
.cac-stepper{display:flex;align-items:flex-start;gap:0;overflow-x:auto;padding:4px 0 12px}
.cac-step{display:flex;flex-direction:column;align-items:center;flex:1;min-width:80px;position:relative}
.cac-step:not(:last-child)::after{content:'';position:absolute;top:14px;left:calc(50% + 14px);
  right:calc(-50% + 14px);height:2px;background:#2d3748;z-index:0}
.cac-step:not(:last-child).step-done::after{background:#22c55e}

.cac-step-dot{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;
  justify-content:center;font-size:.7rem;font-weight:700;z-index:1;position:relative;
  border:2px solid transparent;transition:all .3s;flex-shrink:0;cursor:default}
.cac-step-dot.done{background:#22c55e;border-color:#22c55e;color:#fff}
.cac-step-dot.pending{background:#1a2236;border-color:#2d3748;color:#374151}
.cac-step-dot.active-ok{background:#1d3461;border-color:#3b82f6;color:#93c5fd;
  animation:pulse-blue 1.6s ease-in-out infinite}
.cac-step-dot.active-late{background:#4c0a0f;border-color:#ef4444;color:#fca5a5;
  animation:pulse-red 1.0s ease-in-out infinite}

@keyframes pulse-blue{
  0%,100%{box-shadow:0 0 0 0 rgba(59,130,246,.6)}
  50%{box-shadow:0 0 0 8px rgba(59,130,246,.0)}
}
@keyframes pulse-red{
  0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,.7)}
  50%{box-shadow:0 0 0 8px rgba(239,68,68,.0)}
}

.cac-step-label{font-size:.65rem;color:#475569;margin-top:6px;text-align:center;
  line-height:1.3;max-width:72px}
.cac-step-date{font-size:.6rem;color:#22c55e;margin-top:2px;text-align:center}
.cac-step-prazo{font-size:.6rem;color:#ef4444;margin-top:2px;text-align:center}

/* Admin click on step */
.cac-step-dot.editavel{cursor:pointer;transition:transform .15s,box-shadow .15s}
.cac-step-dot.editavel:hover{transform:scale(1.15)}

/* Admin fill button */
.cac-btn-etapa{margin-top:10px;padding:6px 14px;border-radius:6px;border:1px solid #2d3748;
  background:transparent;color:#64748b;font-size:.75rem;cursor:pointer;transition:all .2s}
.cac-btn-etapa:hover{border-color:#C41230;color:#e2e8f0;background:#1a0a0f}

/* Recusar orçamento */
.cac-btn-recusar{padding:6px 14px;border-radius:6px;border:1px solid #7f1d1d;
  background:#7f1d1d22;color:#fca5a5;font-size:.75rem;cursor:pointer;transition:all .2s}
.cac-btn-recusar:hover{background:#7f1d1d55}

/* Modal */
.cac-modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:9990;
  display:flex;align-items:center;justify-content:center;padding:20px}
.cac-modal{background:#1e2533;border:1px solid #2d3748;border-radius:12px;
  width:100%;max-width:460px;max-height:90vh;overflow-y:auto;box-shadow:0 24px 60px rgba(0,0,0,.5)}
.cac-modal-header{display:flex;align-items:center;justify-content:space-between;
  padding:16px 20px;border-bottom:1px solid #2d3748}
.cac-modal-title{font-size:1rem;font-weight:700;color:#e2e8f0}
.cac-modal-close{background:none;border:none;color:#475569;font-size:1.2rem;cursor:pointer;
  line-height:1;padding:4px;transition:color .2s}
.cac-modal-close:hover{color:#e2e8f0}
.cac-modal-body{padding:20px}
.cac-modal-footer{display:flex;justify-content:flex-end;gap:10px;padding:14px 20px;
  border-top:1px solid #2d3748}

.cac-modal .mf{display:flex;flex-direction:column;gap:5px;margin-bottom:14px}
.cac-modal .mf label{font-size:.75rem;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:.05em}
.cac-modal .mf input,.cac-modal .mf textarea,.cac-modal .mf select{
  background:#141c2d;border:1px solid #2d3748;color:#e2e8f0;border-radius:6px;
  padding:9px 11px;font-size:.88rem;outline:none;font-family:inherit}
.cac-modal .mf input:focus,.cac-modal .mf textarea:focus{border-color:#C41230}
.cac-modal .mf input[type=date]::-webkit-calendar-picker-indicator{filter:invert(.6)}

.cac-toggle-row{display:flex;align-items:center;gap:10px;padding:4px 0}
.cac-toggle-row label{font-size:.88rem;color:#e2e8f0;cursor:pointer;flex:1}
.cac-toggle{width:42px;height:24px;background:#2d3748;border-radius:12px;position:relative;
  cursor:pointer;border:none;transition:background .2s;flex-shrink:0}
.cac-toggle.on{background:#ef4444}
.cac-toggle::after{content:'';position:absolute;top:3px;left:3px;width:18px;height:18px;
  border-radius:50%;background:#fff;transition:transform .2s}
.cac-toggle.on::after{transform:translateX(18px)}

.btn-cac-cancel{padding:9px 20px;border-radius:7px;border:1px solid #2d3748;
  background:transparent;color:#94a3b8;font-size:.88rem;cursor:pointer}
.btn-cac-cancel:hover{background:#1a2236}
.btn-cac-save{padding:9px 22px;border-radius:7px;border:none;background:#C41230;
  color:#fff;font-size:.88rem;font-weight:600;cursor:pointer;transition:background .2s}
.btn-cac-save:hover{background:#a01028}
.btn-cac-save:disabled{opacity:.5;cursor:not-allowed}

.cac-spinner{display:inline-block;width:13px;height:13px;border:2px solid #fff4;
  border-top-color:#fff;border-radius:50%;animation:cac-spin .7s linear infinite;vertical-align:middle;margin-right:5px}
@keyframes cac-spin{to{transform:rotate(360deg)}}

.cac-toast{position:fixed;bottom:24px;right:24px;z-index:9999;padding:12px 20px;
  border-radius:8px;font-size:.88rem;font-weight:500;opacity:0;pointer-events:none;
  transform:translateY(10px);transition:all .3s;max-width:360px}
.cac-toast.show{opacity:1;transform:translateY(0)}
.cac-toast.ok{background:#14532d;color:#86efac;border:1px solid #22c55e}
.cac-toast.warn{background:#713f12;color:#fde68a;border:1px solid #eab308}
.cac-toast.err{background:#7f1d1d;color:#fca5a5;border:1px solid #ef4444}
    `;
    document.head.appendChild(s);
  }

  /* ── CONSTANTS ────────────────────────────────────────────────────── */
  const PRAZOS = {
    1: [0, 0, 0, 0, 0,  0,  7],
    2: [2, 3, 5, 3, 2, 15,  7],
    3: [7,15, 7, 7,10, 46,  7],
    4: [7,30,13,10,30, 90,  7]
  };

  const PRIORIDADE_LABELS = { 1:'Emergencial', 2:'Urgente', 3:'Médio', 4:'Baixo' };

  const ETAPAS = [
    { idx:0, label:'Solicitação',    col:'Data_Etapa1', editavel:false, extra:[] },
    { idx:1, label:'Orçamento',      col:'Data_Etapa2', editavel:true,
      extra:[
        { id:'Valor_Orcamento',    label:'Valor do Orçamento (R$)', type:'number', placeholder:'0,00' },
        { id:'Orcamento_Recusado', label:'Orçamento Recusado?',     type:'toggle' }
      ]
    },
    { idx:2, label:'RC / Pedido',    col:'Data_Etapa3', editavel:true,
      extra:[
        { id:'Numero_RC', label:'N° RC / Pedido', type:'text', placeholder:'RC-000...' }
      ]
    },
    { idx:3, label:'Aprovação',      col:'Data_Etapa4', editavel:true, extra:[] },
    { idx:4, label:'Envio Fornec.',  col:'Data_Etapa5', editavel:true, extra:[] },
    { idx:5, label:'Prev. Entrega',  col:'Data_Etapa6', editavel:true, extra:[],
      note:'Data prevista pelo fornecedor (pode ser futura)'
    },
    { idx:6, label:'Lançamento NF',  col:'Data_Etapa7', editavel:true,
      extra:[
        { id:'Numero_NF', label:'N° Nota Fiscal', type:'text', placeholder:'NF-000...' }
      ]
    }
  ];

  /* ── STATE ────────────────────────────────────────────────────────── */
  let _opts  = {};
  let _ordens = [];
  let _abaAtiva = 'em_andamento';

  /* ── PUBLIC ───────────────────────────────────────────────────────── */
  async function render(el, opts) {
    _opts = opts;
    el.innerHTML = _buildSkeleton();
    await _carregarOrdens(el);
  }

  /* ── SKELETON ─────────────────────────────────────────────────────── */
  function _buildSkeleton() {
    return `
<div class="cac-wrap">
  <div class="cac-header">
    <div class="cac-header-left">
      <div class="cac-header-icon">📦</div>
      <div>
        <h2>Acompanhamento das Ordens de Compra</h2>
        <p>Monitoramento em tempo real do fluxo de aquisições</p>
      </div>
    </div>
    <button class="btn-cac-refresh" id="cac-btn-refresh">⟳ Atualizar</button>
  </div>

  <div class="cac-filtros">
    <select id="cac-fil-prioridade">
      <option value="">Todas as prioridades</option>
      <option value="1">1 – Emergencial</option>
      <option value="2">2 – Urgente</option>
      <option value="3">3 – Médio</option>
      <option value="4">4 – Baixo</option>
    </select>
    <select id="cac-fil-sala">
      <option value="">Todas as salas</option>
    </select>
    <input class="cac-search" id="cac-search" type="text" placeholder="Buscar por ID, descrição...">
  </div>

  <div class="cac-tabs">
    <div class="cac-tab ativo" data-tab="em_andamento">
      Em Andamento <span class="cac-tab-count" id="cnt-andamento">0</span>
    </div>
    <div class="cac-tab" data-tab="concluida">
      Concluídas <span class="cac-tab-count" id="cnt-concluida">0</span>
    </div>
  </div>

  <div id="cac-lista"></div>
  <div id="cac-toast" class="cac-toast"></div>
</div>`;
  }

  /* ── LOAD ─────────────────────────────────────────────────────────── */
  async function _carregarOrdens(el) {
    const lista = el.querySelector('#cac-lista');
    lista.innerHTML = `<div class="cac-empty">Carregando...</div>`;
    try {
      const r = await fetch(`${_opts.gsUrl}?action=read&sheet=compras`);
      const d = await r.json();
      _ordens = (d.data || []).sort((a, b) => new Date(b.Data_Solicitacao) - new Date(a.Data_Solicitacao));
      _popularFiltroSala(el);
      _bindTopEvents(el);
      _renderLista(el);
    } catch (e) {
      lista.innerHTML = `<div class="cac-empty">❌ Erro ao carregar: ${e.message}</div>`;
    }
  }

  function _popularFiltroSala(el) {
    const salas = [...new Set(_ordens.map(o => o.Sala).filter(Boolean))].sort();
    const sel   = el.querySelector('#cac-fil-sala');
    sel.innerHTML = `<option value="">Todas as salas</option>` +
      salas.map(s => `<option value="${_esc(s)}">${_esc(s)}</option>`).join('');
  }

  /* ── EVENTS TOP ───────────────────────────────────────────────────── */
  function _bindTopEvents(el) {
    el.querySelector('#cac-btn-refresh').addEventListener('click', () => _carregarOrdens(el));

    el.querySelectorAll('.cac-tab').forEach(tab =>
      tab.addEventListener('click', function () {
        _abaAtiva = this.dataset.tab;
        el.querySelectorAll('.cac-tab').forEach(t => t.classList.remove('ativo'));
        this.classList.add('ativo');
        _renderLista(el);
      })
    );

    ['#cac-fil-prioridade','#cac-fil-sala','#cac-search'].forEach(id =>
      el.querySelector(id).addEventListener('input', () => _renderLista(el))
    );
  }

  /* ── RENDER LISTA ─────────────────────────────────────────────────── */
  function _renderLista(el) {
    const filPri  = el.querySelector('#cac-fil-prioridade').value;
    const filSala = el.querySelector('#cac-fil-sala').value;
    const busca   = el.querySelector('#cac-search').value.toLowerCase();

    const isAndamento = o => o.Status === 'em_andamento';
    const isConcluida = o => o.Status === 'concluida' || o.Status === 'orcamento_recusado';

    const filtrar = o => {
      if (filPri  && String(o.Prioridade) !== filPri)           return false;
      if (filSala && o.Sala !== filSala)                         return false;
      if (busca   && !(
        (o.ID          || '').toLowerCase().includes(busca) ||
        (o.Descricao   || '').toLowerCase().includes(busca) ||
        (o.Maquina     || '').toLowerCase().includes(busca) ||
        (o.Sala        || '').toLowerCase().includes(busca)
      )) return false;
      return true;
    };

    const andamento = _ordens.filter(o => isAndamento(o) && filtrar(o));
    const concluidas = _ordens.filter(o => isConcluida(o) && filtrar(o));

    el.querySelector('#cnt-andamento').textContent = andamento.length;
    el.querySelector('#cnt-concluida').textContent = concluidas.length;

    const lista  = el.querySelector('#cac-lista');
    const atual  = _abaAtiva === 'em_andamento' ? andamento : concluidas;

    if (!atual.length) {
      lista.innerHTML = `
        <div class="cac-empty">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
            <path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/>
            <path d="M16 3H8L6 7h12l-2-4z"/>
          </svg>
          Nenhuma ordem encontrada
        </div>`;
      return;
    }

    lista.innerHTML = atual.map(o => _buildCard(o)).join('');

    /* Bind card events */
    lista.querySelectorAll('.cac-card-head').forEach(head => {
      head.addEventListener('click', function () {
        const body   = this.parentElement.querySelector('.cac-card-body');
        const toggle = this.querySelector('.cac-card-toggle');
        const open   = body.classList.toggle('open');
        toggle.classList.toggle('open', open);
      });
    });

    lista.querySelectorAll('.cac-btn-etapa').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const id     = btn.dataset.id;
        const etaIdx = Number(btn.dataset.etapa);
        const ordem  = _ordens.find(o => o.ID === id);
        if (ordem) _abrirModal(ordem, etaIdx, el);
      });
    });

    lista.querySelectorAll('.cac-btn-recusar').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const id    = btn.dataset.id;
        const ordem = _ordens.find(o => o.ID === id);
        if (ordem) _recusarOrcamento(ordem, el);
      });
    });
  }

  /* ── BUILD CARD ───────────────────────────────────────────────────── */
  function _buildCard(ordem) {
    const pri        = Number(ordem.Prioridade) || 2;
    const priLabel   = PRIORIDADE_LABELS[pri] || '';
    const isAdmin    = (_opts.user || {}).Tipo_Acesso === 'Administração';
    const isConcluida = ordem.Status === 'concluida' || ordem.Status === 'orcamento_recusado';
    const atrasada   = !isConcluida && _estaAtrasada(ordem);

    const statusLabel = {
      em_andamento:       'Em Andamento',
      concluida:          '✅ Concluída',
      orcamento_recusado: '🚫 Orç. Recusado'
    }[ordem.Status] || ordem.Status;

    const statusClass = atrasada ? 'status-atrasada' : `status-${ordem.Status}`;
    const statusTxt   = atrasada ? '⚠️ Atrasada' : statusLabel;

    const steps = ETAPAS.map(e => _buildStep(ordem, e, isAdmin)).join('');

    const fotos = _parseFotos(ordem.Fotos);
    const fotosHtml = fotos.length
      ? `<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px">
           ${fotos.map(url => `<a href="${_esc(url)}" target="_blank" rel="noopener">
             <img src="${_esc(url)}" style="width:64px;height:64px;object-fit:cover;border-radius:6px;border:1px solid #2d3748">
           </a>`).join('')}
         </div>` : '';

    /* Botão Recusar Orçamento — só aparece para admin, etapa 2 ainda pendente */
    const etapa2Preenchida = !!ordem.Data_Etapa2;
    const mostrarRecusar   = isAdmin && !isConcluida && etapa2Preenchida && ordem.Orcamento_Recusado !== 'TRUE';

    return `
<div class="cac-card pri-${pri} ${isConcluida ? (ordem.Status === 'orcamento_recusado' ? 'orcamento_recusado' : 'concluida') : ''}">
  <div class="cac-card-head">
    <span class="cac-card-id">${_esc(ordem.ID)}</span>
    <span class="cac-card-desc" title="${_esc(ordem.Descricao)}">${_esc(ordem.Descricao || '—')}</span>
    <div class="cac-card-meta">
      <span class="cac-badge pri-${pri}">${priLabel}</span>
      <span class="cac-badge ${statusClass}">${statusTxt}</span>
      <span class="cac-card-toggle">▼</span>
    </div>
  </div>
  <div class="cac-card-body">
    <div class="cac-card-info">
      <span><b>Sala:</b> ${_esc(ordem.Sala)}</span>
      <span><b>Máquina:</b> ${_esc(ordem.Maquina)}</span>
      <span><b>Qty:</b> ${_esc(String(ordem.Quantidade))}</span>
      ${ordem.Fornecedor_Sugerido ? `<span><b>Fornecedor:</b> ${_esc(ordem.Fornecedor_Sugerido)}</span>` : ''}
      ${ordem.Numero_RC           ? `<span><b>RC:</b> ${_esc(ordem.Numero_RC)}</span>` : ''}
      ${ordem.Numero_NF           ? `<span><b>NF:</b> ${_esc(ordem.Numero_NF)}</span>` : ''}
      ${ordem.Valor_Orcamento     ? `<span><b>Orçamento:</b> R$ ${_esc(String(ordem.Valor_Orcamento))}</span>` : ''}
      <span><b>Data:</b> ${_fmtDate(ordem.Data_Solicitacao)}</span>
      <span><b>Solicitante:</b> ${_esc(ordem.Solicitante)}</span>
    </div>

    <div class="cac-stepper">${steps}</div>

    ${mostrarRecusar
      ? `<div style="margin-top:8px">
           <button class="cac-btn-recusar" data-id="${_esc(ordem.ID)}">🚫 Recusar Orçamento</button>
         </div>` : ''}

    ${fotosHtml}

    ${ordem.Acao_Preventiva
      ? `<div style="margin-top:12px;font-size:.8rem;color:#64748b">
           <b style="color:#94a3b8">Ação Preventiva:</b> ${_esc(ordem.Acao_Preventiva)}
         </div>` : ''}
    ${ordem.Observacoes
      ? `<div style="margin-top:6px;font-size:.8rem;color:#64748b">
           <b style="color:#94a3b8">Obs:</b> ${_esc(ordem.Observacoes)}
         </div>` : ''}
  </div>
</div>`;
  }

  /* ── BUILD STEP ───────────────────────────────────────────────────── */
  function _buildStep(ordem, etapa, isAdmin) {
    const state    = _getStepState(ordem, etapa.idx);
    const isConcluida = ordem.Status === 'concluida' || ordem.Status === 'orcamento_recusado';
    const canEdit  = isAdmin && !isConcluida && etapa.editavel && state !== 'done';
    const isActive = state === 'active-ok' || state === 'active-late';

    const prazoInfo = isActive
      ? `<span class="cac-step-prazo">${_prazoLabel(ordem, etapa.idx)}</span>` : '';

    const dateInfo = state === 'done'
      ? `<span class="cac-step-date">${_fmtDateShort(ordem[etapa.col])}</span>` : '';

    const btnEditar = canEdit
      ? `<button class="cac-btn-etapa" data-id="${_esc(ordem.ID)}" data-etapa="${etapa.idx}">
           ${state === 'active-late' ? '🔴' : '📝'} Preencher
         </button>` : '';

    /* Mark line as done if current step is done */
    const lineDone = state === 'done' ? 'step-done' : '';

    return `
<div class="cac-step ${lineDone}">
  <div class="cac-step-dot ${state} ${canEdit ? 'editavel' : ''}"
    ${canEdit ? `data-id="${_esc(ordem.ID)}" data-etapa="${etapa.idx}" title="Clique para preencher"` : ''}
    ${canEdit ? `onclick="document.querySelector('.cac-btn-etapa[data-id=&quot;${_esc(ordem.ID)}&quot;][data-etapa=&quot;${etapa.idx}&quot;]')?.click()"` : ''}
  >
    ${state === 'done' ? '✓' : etapa.idx + 1}
  </div>
  <span class="cac-step-label">${etapa.label}</span>
  ${dateInfo}
  ${prazoInfo}
  ${btnEditar}
</div>`;
  }

  /* ── STEP STATE ───────────────────────────────────────────────────── */
  function _getStepState(ordem, idx) {
    const etapa = ETAPAS[idx];
    if (ordem[etapa.col]) return 'done';

    // Se a ordem está concluída, passos não preenchidos ficam 'pending'
    if (ordem.Status === 'concluida' || ordem.Status === 'orcamento_recusado') return 'pending';

    // Verificar se é o passo atual (todos os anteriores preenchidos)
    const isAtual = ETAPAS.slice(0, idx).every(e => !!ordem[e.col]);
    if (!isAtual) return 'pending';

    // Calcular prazo
    const pri      = Number(ordem.Prioridade) || 2;
    const prazoDias = (PRAZOS[pri] || PRAZOS[2])[idx];
    const startDate = idx === 0
      ? new Date(ordem.Data_Solicitacao)
      : new Date(ordem[ETAPAS[idx - 1].col]);

    if (isNaN(startDate.getTime())) return 'active-ok';

    const diffDias = (Date.now() - startDate.getTime()) / 86400000;
    return Math.floor(diffDias) > prazoDias ? 'active-late' : 'active-ok';
  }

  function _estaAtrasada(ordem) {
    return ETAPAS.some((_, idx) => _getStepState(ordem, idx) === 'active-late');
  }

  function _prazoLabel(ordem, idx) {
    const pri      = Number(ordem.Prioridade) || 2;
    const prazoDias = (PRAZOS[pri] || PRAZOS[2])[idx];
    const startDate = idx === 0
      ? new Date(ordem.Data_Solicitacao)
      : new Date(ordem[ETAPAS[idx - 1].col]);
    if (isNaN(startDate.getTime())) return '';
    const diffDias = Math.floor((Date.now() - startDate.getTime()) / 86400000);
    if (prazoDias === 0) return diffDias === 0 ? 'Hoje' : `+${diffDias}d`;
    if (diffDias > prazoDias) return `+${diffDias - prazoDias}d atraso`;
    return `${prazoDias - diffDias}d restante${prazoDias - diffDias === 1 ? '' : 's'}`;
  }

  /* ── MODAL ────────────────────────────────────────────────────────── */
  function _abrirModal(ordem, etapaIdx, el) {
    const etapa = ETAPAS[etapaIdx];
    const hoje  = new Date().toISOString().split('T')[0];
    let toggleState = false;

    const extraHtml = etapa.extra.map(ex => {
      if (ex.type === 'toggle') {
        return `
          <div class="mf">
            <div class="cac-toggle-row">
              <label for="m-${ex.id}">${ex.label}</label>
              <button type="button" class="cac-toggle" id="m-${ex.id}" aria-pressed="false"></button>
            </div>
          </div>`;
      }
      return `
        <div class="mf">
          <label for="m-${ex.id}">${ex.label}</label>
          <input type="${ex.type === 'number' ? 'number' : 'text'}"
            id="m-${ex.id}" min="0" step="0.01"
            placeholder="${_esc(ex.placeholder || '')}">
        </div>`;
    }).join('');

    const noteHtml = etapa.note
      ? `<p style="font-size:.78rem;color:#64748b;margin:0 0 14px">${etapa.note}</p>` : '';

    const html = `
<div class="cac-modal-overlay" id="cac-modal-overlay">
  <div class="cac-modal">
    <div class="cac-modal-header">
      <span class="cac-modal-title">Etapa ${etapaIdx + 1} — ${etapa.label}</span>
      <button class="cac-modal-close" id="cac-modal-close-btn">✕</button>
    </div>
    <div class="cac-modal-body">
      <p style="font-size:.8rem;color:#64748b;margin:0 0 16px">
        Ordem: <b style="color:#94a3b8">${_esc(ordem.ID)}</b> · ${_esc(ordem.Descricao || '')}
      </p>
      ${noteHtml}
      <div class="mf">
        <label for="m-data">Data de Conclusão *</label>
        <input type="date" id="m-data" value="${hoje}" max="${hoje}" required>
      </div>
      ${extraHtml}
    </div>
    <div class="cac-modal-footer">
      <button class="btn-cac-cancel" id="cac-modal-cancel">Cancelar</button>
      <button class="btn-cac-save"   id="cac-modal-salvar">Salvar Etapa</button>
    </div>
  </div>
</div>`;

    document.body.insertAdjacentHTML('beforeend', html);
    const overlay = document.getElementById('cac-modal-overlay');

    /* Toggle bind */
    overlay.querySelectorAll('.cac-toggle').forEach(tog => {
      tog.addEventListener('click', function () {
        toggleState = !toggleState;
        this.classList.toggle('on', toggleState);
        this.setAttribute('aria-pressed', toggleState);
      });
    });

    /* Fechar */
    const fechar = () => overlay.remove();
    overlay.querySelector('#cac-modal-close-btn').addEventListener('click', fechar);
    overlay.querySelector('#cac-modal-cancel').addEventListener('click', fechar);
    overlay.addEventListener('click', e => { if (e.target === overlay) fechar(); });

    /* Salvar */
    overlay.querySelector('#cac-modal-salvar').addEventListener('click', async function () {
      const data = overlay.querySelector('#m-data').value;
      if (!data) { alert('Informe a data de conclusão.'); return; }

      this.disabled = true;
      this.innerHTML = `<span class="cac-spinner"></span>Salvando...`;

      const payload = { [etapa.col]: data };

      /* Extra fields */
      etapa.extra.forEach(ex => {
        if (ex.type === 'toggle') {
          payload[ex.id] = toggleState ? 'TRUE' : 'FALSE';
        } else {
          const v = overlay.querySelector(`#m-${ex.id}`)?.value || '';
          if (v) payload[ex.id] = v;
        }
      });

      /* Se é etapa 7 → concluída */
      if (etapaIdx === 6) payload.Status = 'concluida';

      try {
        const r = await _post(_opts.gsUrl, {
          action: 'update',
          sheet:  'compras',
          id:      ordem.ID,
          idCol:  'ID',
          row:     payload
        });
        if (!r.ok) throw new Error(r.error || 'Erro');

        /* Atualiza local */
        Object.assign(ordem, payload);
        fechar();
        _renderLista(el);
        _toast(el, `✅ Etapa ${etapaIdx + 1} registrada!`, 'ok');
      } catch (err) {
        _toast(el, '❌ ' + err.message, 'err');
        this.disabled = false;
        this.textContent = 'Salvar Etapa';
      }
    });
  }

  /* ── RECUSAR ORÇAMENTO ────────────────────────────────────────────── */
  async function _recusarOrcamento(ordem, el) {
    if (!confirm(`Recusar o orçamento da ordem ${ordem.ID}?\nEssa ação irá encerrar a ordem como "Orçamento Recusado".`)) return;
    try {
      const r = await _post(_opts.gsUrl, {
        action: 'update',
        sheet:  'compras',
        id:      ordem.ID,
        idCol:  'ID',
        row:    { Orcamento_Recusado: 'TRUE', Status: 'orcamento_recusado', Data_Etapa2: new Date().toISOString().split('T')[0] }
      });
      if (!r.ok) throw new Error(r.error);
      Object.assign(ordem, { Orcamento_Recusado: 'TRUE', Status: 'orcamento_recusado' });
      _renderLista(el);
      _toast(el, '🚫 Orçamento recusado. Ordem encerrada.', 'warn');
    } catch (err) {
      _toast(el, '❌ ' + err.message, 'err');
    }
  }

  /* ── UTILS ────────────────────────────────────────────────────────── */
  async function _post(url, payload) {
    const r = await fetch(url, { method: 'POST', body: JSON.stringify(payload) });
    return r.json();
  }

  function _parseFotos(raw) {
    try { return JSON.parse(raw || '[]'); } catch { return []; }
  }

  function _fmtDate(iso) {
    if (!iso) return '—';
    try {
      const d = new Date(iso);
      return d.toLocaleDateString('pt-BR');
    } catch { return iso; }
  }

  function _fmtDateShort(iso) {
    if (!iso) return '';
    try {
      const d = new Date(iso);
      return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}`;
    } catch { return iso; }
  }

  function _toast(el, msg, type) {
    const t = el.querySelector('#cac-toast');
    if (!t) return;
    t.textContent = msg;
    t.className = `cac-toast ${type} show`;
    clearTimeout(t._tid);
    t._tid = setTimeout(() => t.classList.remove('show'), 5000);
  }

  function _esc(s) {
    return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  /* ── EXPORT ───────────────────────────────────────────────────────── */
  global.ComprasAcompanhamento = { render };

})(window);
