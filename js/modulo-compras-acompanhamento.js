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
/* SIGMAN Compras – Acompanhamento | usa variáveis globais do sigman.css */
.cac-wrap{padding:20px;max-width:1100px;margin:0 auto;font-family:inherit}

/* Header */
.cac-header{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;
  margin-bottom:18px;padding-bottom:16px;border-bottom:1px solid var(--bord)}
.cac-header-left{display:flex;align-items:center;gap:14px}
.cac-header-icon{font-size:1.8rem;line-height:1}
.cac-header h2{margin:0;font-size:1.15rem;font-weight:700;color:var(--txt1)}
.cac-header p{margin:4px 0 0;font-size:.8rem;color:var(--txt3)}
.btn-cac-refresh{
  padding:8px 16px;border-radius:7px;
  border:1px solid var(--bord);
  background:transparent;color:var(--txt2);
  font-size:.82rem;cursor:pointer;transition:background .2s,color .2s
}
.btn-cac-refresh:hover{background:var(--surf2);color:var(--txt1)}

/* Filtros */
.cac-filtros{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:16px;align-items:center}
.cac-filtros select{
  background:var(--surf2);
  border:1px solid var(--bord);
  color:var(--txt1);
  border-radius:7px;padding:7px 12px;font-size:.83rem;outline:none;cursor:pointer
}
.cac-filtros select:focus{border-color:#C41230}
.cac-search{
  background:var(--surf2);
  border:1px solid var(--bord);
  color:var(--txt1);
  border-radius:7px;padding:7px 12px;
  font-size:.83rem;outline:none;min-width:200px
}
.cac-search::placeholder{color:var(--txt3)}
.cac-search:focus{border-color:#C41230}

/* Tabs */
.cac-tabs{display:flex;gap:0;margin-bottom:16px;border-bottom:2px solid var(--bord)}
.cac-tab{
  padding:10px 22px;font-size:.88rem;font-weight:600;
  color:var(--txt3);cursor:pointer;
  border-bottom:2px solid transparent;margin-bottom:-2px;
  transition:color .2s,border-color .2s;user-select:none
}
.cac-tab:hover{color:var(--txt1)}
.cac-tab.ativo{color:var(--txt1);border-bottom-color:#C41230}
.cac-tab-count{
  display:inline-flex;align-items:center;justify-content:center;
  background:var(--bord);color:var(--txt2);
  border-radius:10px;font-size:.7rem;
  min-width:20px;height:18px;padding:0 6px;margin-left:7px
}
.cac-tab.ativo .cac-tab-count{background:#C41230;color:#fff}

/* Empty state */
.cac-empty{text-align:center;padding:60px 20px;color:var(--txt3);font-size:.9rem}
.cac-empty svg{display:block;margin:0 auto 14px;opacity:.3}

/* Cards — mesmo padrão visual de abertura-os */
.cac-card{
  background:var(--surf2);
  border:1px solid var(--bord);
  border-radius:var(--rs);
  margin-bottom:12px;overflow:hidden;
  transition:border-color .2s
}
.cac-card:hover{border-color:#374151}
.cac-card.pri-1{border-left:4px solid #ef4444}
.cac-card.pri-2{border-left:4px solid #eab308}
.cac-card.pri-3{border-left:4px solid #3b82f6}
.cac-card.pri-4{border-left:4px solid #22c55e}
.cac-card.concluida{border-left:4px solid #22c55e;opacity:.78}
.cac-card.orcamento_recusado{border-left:4px solid #ef4444;opacity:.78}

/* Cabeçalho do card */
.cac-card-head{
  display:flex;align-items:center;gap:12px;
  padding:13px 16px;cursor:pointer;user-select:none;flex-wrap:wrap
}
.cac-card-id{font-size:.72rem;font-weight:700;color:var(--txt3);font-family:monospace}
.cac-card-desc{
  flex:1;font-size:.9rem;color:var(--txt1);font-weight:600;
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0
}
.cac-card-meta{display:flex;align-items:center;gap:8px;flex-shrink:0;flex-wrap:wrap}
.cac-badge{
  display:inline-flex;align-items:center;
  padding:3px 10px;border-radius:20px;
  font-size:.7rem;font-weight:700;letter-spacing:.04em;
  border:1px solid currentColor
}
.cac-badge.pri-1{color:#ef4444;background:rgba(239,68,68,.1)}
.cac-badge.pri-2{color:#eab308;background:rgba(234,179,8,.1)}
.cac-badge.pri-3{color:#3b82f6;background:rgba(59,130,246,.1)}
.cac-badge.pri-4{color:#22c55e;background:rgba(34,197,94,.1)}
.cac-badge.status-em_andamento{color:#3b82f6;background:rgba(59,130,246,.1);border-color:#3b82f6}
.cac-badge.status-concluida{color:#22c55e;background:rgba(34,197,94,.1);border-color:#22c55e}
.cac-badge.status-orcamento_recusado{color:#ef4444;background:rgba(239,68,68,.1);border-color:#ef4444}
.cac-badge.status-atrasada{color:#ef4444;background:rgba(239,68,68,.1);border-color:#ef4444}

.cac-card-toggle{color:var(--txt3);font-size:.85rem;transition:transform .25s;margin-left:4px}
.cac-card-toggle.open{transform:rotate(180deg)}

/* Corpo do card */
.cac-card-body{padding:0 16px 16px;border-top:1px solid var(--bord);display:none}
.cac-card-body.open{display:block}

.cac-card-info{
  display:flex;gap:18px;flex-wrap:wrap;
  padding:12px 0 14px;font-size:.8rem;color:var(--txt3)
}
.cac-card-info span b{color:var(--txt2);font-weight:600}

/* Stepper */
.cac-stepper{display:flex;align-items:flex-start;gap:0;overflow-x:auto;padding:4px 0 14px}
.cac-step{
  display:flex;flex-direction:column;align-items:center;
  flex:1;min-width:80px;position:relative
}
.cac-step:not(:last-child)::after{
  content:'';position:absolute;top:14px;
  left:calc(50% + 14px);right:calc(-50% + 14px);
  height:2px;background:var(--bord);z-index:0
}
.cac-step:not(:last-child).step-done::after{background:#22c55e}

.cac-step-dot{
  width:28px;height:28px;border-radius:50%;
  display:flex;align-items:center;justify-content:center;
  font-size:.7rem;font-weight:700;z-index:1;position:relative;
  border:2px solid transparent;transition:all .3s;flex-shrink:0
}
.cac-step-dot.done{background:#22c55e;border-color:#22c55e;color:#fff}
.cac-step-dot.pending{background:var(--surf);border-color:var(--bord);color:var(--txt3)}
.cac-step-dot.active-ok{
  background:rgba(59,130,246,.12);border-color:#3b82f6;color:#93c5fd;
  animation:pulse-blue 1.6s ease-in-out infinite
}
.cac-step-dot.active-late{
  background:rgba(239,68,68,.12);border-color:#ef4444;color:#fca5a5;
  animation:pulse-red 1.0s ease-in-out infinite
}
@keyframes pulse-blue{
  0%,100%{box-shadow:0 0 0 0 rgba(59,130,246,.6)}
  50%{box-shadow:0 0 0 8px rgba(59,130,246,0)}
}
@keyframes pulse-red{
  0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,.7)}
  50%{box-shadow:0 0 0 8px rgba(239,68,68,0)}
}

.cac-step-label{font-size:.62rem;color:var(--txt3);margin-top:6px;text-align:center;line-height:1.3;max-width:72px}
.cac-step-date {font-size:.6rem;color:#22c55e;margin-top:2px;text-align:center}
.cac-step-prazo{font-size:.6rem;color:#ef4444;margin-top:2px;text-align:center}

.cac-step-dot.editavel{cursor:pointer;transition:transform .15s}
.cac-step-dot.editavel:hover{transform:scale(1.18)}

.cac-btn-etapa{
  margin-top:10px;padding:5px 13px;border-radius:6px;
  border:1px solid var(--bord);
  background:transparent;color:var(--txt2);
  font-size:.73rem;cursor:pointer;transition:all .2s
}
.cac-btn-etapa:hover{border-color:#C41230;color:var(--txt1);background:rgba(196,18,48,.06)}

.cac-btn-recusar{
  padding:5px 13px;border-radius:6px;
  border:1px solid rgba(239,68,68,.4);
  background:rgba(239,68,68,.08);color:#fca5a5;
  font-size:.73rem;cursor:pointer;transition:all .2s
}
.cac-btn-recusar:hover{background:rgba(239,68,68,.2)}

/* Fotos no card */
.cac-fotos-grid{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px;padding-top:12px;border-top:1px solid var(--bord)}
.cac-fotos-grid a img{
  width:64px;height:64px;object-fit:cover;
  border-radius:6px;border:1px solid var(--bord);
  transition:transform .15s;display:block
}
.cac-fotos-grid a:hover img{transform:scale(1.06)}

/* Observações e ação preventiva no card */
.cac-info-block{
  margin-top:10px;padding:10px 12px;
  background:var(--surf);border-radius:7px;
  border-left:3px solid var(--bord);
  font-size:.8rem;color:var(--txt2)
}
.cac-info-block b{color:var(--txt2);display:block;font-size:.7rem;font-weight:700;
  text-transform:uppercase;letter-spacing:.07em;margin-bottom:3px}

/* ── Modal ── */
.cac-modal-overlay{
  position:fixed;inset:0;background:rgba(0,0,0,.72);z-index:9990;
  display:flex;align-items:center;justify-content:center;padding:20px
}
.cac-modal{
  background:var(--surf2);
  border:1px solid var(--bord);
  border-radius:var(--rs);
  width:100%;max-width:500px;max-height:92vh;overflow-y:auto;
  box-shadow:0 24px 60px rgba(0,0,0,.55)
}
.cac-modal-header{
  display:flex;align-items:center;justify-content:space-between;
  padding:16px 20px;border-bottom:1px solid var(--bord)
}
.cac-modal-title{font-size:1rem;font-weight:700;color:var(--txt1)}
.cac-modal-close{
  background:none;border:none;color:var(--txt3);
  font-size:1.1rem;cursor:pointer;padding:4px;
  transition:color .2s;line-height:1
}
.cac-modal-close:hover{color:var(--txt1)}
.cac-modal-body{padding:20px}
.cac-modal-footer{
  display:flex;justify-content:flex-end;gap:10px;
  padding:14px 20px;border-top:1px solid var(--bord)
}

/* Campos do modal — mesmo padrão do abertura-os */
.cac-modal .mf{display:flex;flex-direction:column;gap:5px;margin-bottom:14px}
.cac-modal .mf label{
  font-size:.73rem;font-weight:700;
  color:var(--txt2);
  text-transform:uppercase;letter-spacing:.07em
}
.cac-modal .mf input,
.cac-modal .mf textarea,
.cac-modal .mf select{
  background:var(--bg);
  border:1px solid var(--bord);
  color:var(--txt1);
  border-radius:7px;padding:9px 11px;
  font-size:.88rem;outline:none;font-family:inherit
}
.cac-modal .mf input:focus,
.cac-modal .mf textarea:focus,
.cac-modal .mf select:focus{border-color:#C41230;box-shadow:0 0 0 2px rgba(196,18,48,.1)}
.cac-modal .mf input[type=date]::-webkit-calendar-picker-indicator{filter:invert(.6)}

/* Toggle */
.cac-toggle-row{display:flex;align-items:center;gap:10px;padding:4px 0}
.cac-toggle-row label{font-size:.88rem;color:var(--txt1);cursor:pointer;flex:1}
.cac-toggle{
  width:42px;height:24px;background:var(--bord);
  border-radius:12px;position:relative;cursor:pointer;
  border:none;transition:background .2s;flex-shrink:0
}
.cac-toggle.on{background:#ef4444}
.cac-toggle::after{
  content:'';position:absolute;top:3px;left:3px;
  width:18px;height:18px;border-radius:50%;
  background:#fff;transition:transform .2s
}
.cac-toggle.on::after{transform:translateX(18px)}

/* Drop zona de foto no modal */
.cac-foto-modal-drop{
  border:2px dashed var(--bord);
  border-radius:7px;padding:16px;
  text-align:center;cursor:pointer;
  color:var(--txt3);font-size:.83rem;
  transition:border-color .2s,background .2s
}
.cac-foto-modal-drop:hover{border-color:#C41230;background:rgba(196,18,48,.05);color:var(--txt1)}
.cac-foto-modal-preview{margin-top:8px}
.cac-foto-modal-thumb{
  display:flex;align-items:center;gap:10px;
  padding:8px 10px;background:var(--surf);
  border-radius:6px;border:1px solid var(--bord)
}
.cac-foto-modal-thumb img{width:44px;height:44px;object-fit:cover;border-radius:4px;flex-shrink:0}
.cac-foto-modal-thumb span{font-size:.78rem;color:var(--txt2);flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.cac-foto-modal-thumb button{
  background:none;border:none;color:var(--txt3);
  cursor:pointer;font-size:.85rem;padding:4px;
  transition:color .2s;flex-shrink:0
}
.cac-foto-modal-thumb button:hover{color:#ef4444}

/* Botões do modal */
.btn-cac-cancel{
  padding:9px 20px;border-radius:7px;
  border:1px solid var(--bord);
  background:transparent;color:var(--txt2);
  font-size:.88rem;cursor:pointer;transition:background .2s
}
.btn-cac-cancel:hover{background:var(--surf)}
.btn-cac-save{
  padding:9px 22px;border-radius:7px;border:none;
  background:#C41230;color:#fff;
  font-size:.88rem;font-weight:700;cursor:pointer;
  transition:background .2s
}
.btn-cac-save:hover{background:#a01028}
.btn-cac-save:disabled{opacity:.5;cursor:not-allowed}

/* Spinner */
.cac-spinner{
  display:inline-block;width:13px;height:13px;
  border:2px solid rgba(255,255,255,.25);
  border-top-color:#fff;border-radius:50%;
  animation:cac-spin .7s linear infinite;
  vertical-align:middle;margin-right:5px
}
@keyframes cac-spin{to{transform:rotate(360deg)}}

/* Toast */
.cac-toast{
  position:fixed;bottom:24px;right:24px;z-index:9999;
  padding:12px 20px;border-radius:8px;
  font-size:.88rem;font-weight:500;
  opacity:0;pointer-events:none;
  transform:translateY(10px);transition:all .3s;max-width:360px
}
.cac-toast.show{opacity:1;transform:translateY(0)}
.cac-toast.ok  {background:#14532d;color:#86efac;border:1px solid #22c55e}
.cac-toast.warn{background:#713f12;color:#fde68a;border:1px solid #eab308}
.cac-toast.err {background:#7f1d1d;color:#fca5a5;border:1px solid #ef4444}
    `;
    document.head.appendChild(s);
  }

  /* ── CONSTANTS ────────────────────────────────────────────────────── */
  const PRAZOS = {
    1: [0,  0,  0,  0,  0,  0,  7],
    2: [2,  3,  5,  3,  2, 15,  7],
    3: [7, 15,  7,  7, 10, 46,  7],
    4: [7, 30, 13, 10, 30, 90,  7]
  };

  const PRIORIDADE_LABELS = { 1:'Emergencial', 2:'Urgente', 3:'Médio', 4:'Baixo' };

  const ETAPAS = [
    { idx:0, label:'Solicitação',   col:'Data_Etapa1', editavel:false, extra:[] },
    { idx:1, label:'Orçamento',     col:'Data_Etapa2', editavel:true,
      extra:[
        { id:'Valor_Orcamento',    label:'Valor do Orçamento (R$)', type:'number', placeholder:'0,00' },
        { id:'Orcamento_Recusado', label:'Orçamento Recusado?',     type:'toggle'                     }
      ]
    },
    { idx:2, label:'RC / Pedido',   col:'Data_Etapa3', editavel:true,
      extra:[{ id:'Numero_RC', label:'N° RC / Pedido', type:'text', placeholder:'RC-000...' }]
    },
    { idx:3, label:'Aprovação',     col:'Data_Etapa4', editavel:true, extra:[] },
    { idx:4, label:'Envio Fornec.', col:'Data_Etapa5', editavel:true, extra:[] },
    { idx:5, label:'Prev. Entrega', col:'Data_Etapa6', editavel:true, extra:[],
      note:'Data prevista pelo fornecedor (pode ser futura)'
    },
    { idx:6, label:'Lançamento NF', col:'Data_Etapa7', editavel:true,
      extra:[{ id:'Numero_NF', label:'N° Nota Fiscal', type:'text', placeholder:'NF-000...' }]
    }
  ];

  /* ── STATE ────────────────────────────────────────────────────────── */
  let _opts     = {};
  let _ordens   = [];
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
    <input class="cac-search" id="cac-search" type="text" placeholder="Buscar por ID, descrição, sala...">
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
    lista.innerHTML = `<div class="cac-empty">Carregando ordens...</div>`;
    try {
      const r = await fetch(`${_opts.gsUrl}?action=read&sheet=compras`);
      const d = await r.json();
      _ordens = (d.data || []).sort((a, b) =>
        new Date(b.Data_Solicitacao) - new Date(a.Data_Solicitacao)
      );
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
      if (filPri  && String(o.Prioridade) !== filPri) return false;
      if (filSala && o.Sala !== filSala)               return false;
      if (busca   && !(
        (o.ID        || '').toLowerCase().includes(busca) ||
        (o.Descricao || '').toLowerCase().includes(busca) ||
        (o.Maquina   || '').toLowerCase().includes(busca) ||
        (o.Sala      || '').toLowerCase().includes(busca)
      )) return false;
      return true;
    };

    const andamento  = _ordens.filter(o => isAndamento(o) && filtrar(o));
    const concluidas = _ordens.filter(o => isConcluida(o) && filtrar(o));

    el.querySelector('#cnt-andamento').textContent = andamento.length;
    el.querySelector('#cnt-concluida').textContent = concluidas.length;

    const lista = el.querySelector('#cac-lista');
    const atual = _abaAtiva === 'em_andamento' ? andamento : concluidas;

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

    /* Bind eventos dos cards */
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
        const ordem = _ordens.find(o => o.ID === btn.dataset.id);
        if (ordem) _abrirModal(ordem, Number(btn.dataset.etapa), el);
      });
    });

    lista.querySelectorAll('.cac-btn-recusar').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const ordem = _ordens.find(o => o.ID === btn.dataset.id);
        if (ordem) _recusarOrcamento(ordem, el);
      });
    });
  }

  /* ── BUILD CARD ───────────────────────────────────────────────────── */
  function _buildCard(ordem) {
    const pri       = Number(ordem.Prioridade) || 2;
    const priLabel  = PRIORIDADE_LABELS[pri] || '';
    const isAdmin   = (_opts.user || {}).Tipo_Acesso === 'administracao';
    const isConcl   = ordem.Status === 'concluida' || ordem.Status === 'orcamento_recusado';
    const atrasada  = !isConcl && _estaAtrasada(ordem);

    const statusLabel = {
      em_andamento:       'Em Andamento',
      concluida:          '✅ Concluída',
      orcamento_recusado: '🚫 Orç. Recusado'
    }[ordem.Status] || ordem.Status;

    const statusClass = atrasada ? 'status-atrasada' : `status-${ordem.Status}`;
    const statusTxt   = atrasada ? '⚠️ Atrasada'    : statusLabel;

    const steps   = ETAPAS.map(e => _buildStep(ordem, e, isAdmin)).join('');
    const fotos   = _parseFotos(ordem.Fotos);

    const fotosHtml = fotos.length
      ? `<div class="cac-fotos-grid">
           ${fotos.map(url => `
             <a href="${_esc(url)}" target="_blank" rel="noopener" title="Ver foto">
               <img src="${_esc(url)}" alt="Foto">
             </a>`).join('')}
         </div>` : '';

    const etapa2Ok     = !!ordem.Data_Etapa2;
    const mostrarRecusar = isAdmin && !isConcl && etapa2Ok && ordem.Orcamento_Recusado !== 'TRUE';

    const obsHtml = ordem.Observacoes
      ? `<div class="cac-info-block"><b>Observações</b>${_esc(ordem.Observacoes)}</div>` : '';

    const prevHtml = ordem.Acao_Preventiva
      ? `<div class="cac-info-block"><b>Ação Preventiva</b>${_esc(ordem.Acao_Preventiva)}</div>` : '';

    return `
<div class="cac-card pri-${pri} ${isConcl ? (ordem.Status === 'orcamento_recusado' ? 'orcamento_recusado' : 'concluida') : ''}">
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
      <span><b>Qtd:</b> ${_esc(String(ordem.Quantidade || '—'))}</span>
      ${ordem.Fornecedor_Sugerido ? `<span><b>Fornecedor:</b> ${_esc(ordem.Fornecedor_Sugerido)}</span>` : ''}
      ${ordem.Numero_RC           ? `<span><b>RC:</b> ${_esc(ordem.Numero_RC)}</span>`               : ''}
      ${ordem.Numero_NF           ? `<span><b>NF:</b> ${_esc(ordem.Numero_NF)}</span>`               : ''}
      ${ordem.Valor_Orcamento     ? `<span><b>Orçamento:</b> R$ ${_esc(String(ordem.Valor_Orcamento))}</span>` : ''}
      <span><b>Data:</b> ${_fmtDate(ordem.Data_Solicitacao)}</span>
      <span><b>Solicitante:</b> ${_esc(ordem.Solicitante)}</span>
    </div>

    <!-- Stepper de etapas -->
    <div class="cac-stepper">${steps}</div>

    ${mostrarRecusar
      ? `<div style="margin-top:8px">
           <button class="cac-btn-recusar" data-id="${_esc(ordem.ID)}">🚫 Recusar Orçamento</button>
         </div>` : ''}

    ${fotosHtml}
    ${prevHtml}
    ${obsHtml}
  </div>
</div>`;
  }

  /* ── BUILD STEP ───────────────────────────────────────────────────── */
  function _buildStep(ordem, etapa, isAdmin) {
    const state    = _getStepState(ordem, etapa.idx);
    const isConcl  = ordem.Status === 'concluida' || ordem.Status === 'orcamento_recusado';
    const canEdit  = isAdmin && !isConcl && etapa.editavel && state !== 'done';
    const isActive = state === 'active-ok' || state === 'active-late';

    const prazoInfo = isActive
      ? `<span class="cac-step-prazo">${_prazoLabel(ordem, etapa.idx)}</span>` : '';

    const dateInfo = state === 'done'
      ? `<span class="cac-step-date">${_fmtDateShort(ordem[etapa.col])}</span>` : '';

    const btnEditar = canEdit
      ? `<button class="cac-btn-etapa" data-id="${_esc(ordem.ID)}" data-etapa="${etapa.idx}">
           ${state === 'active-late' ? '🔴' : '📝'} Preencher
         </button>` : '';

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
    if (ordem.Status === 'concluida' || ordem.Status === 'orcamento_recusado') return 'pending';

    const isAtual = ETAPAS.slice(0, idx).every(e => !!ordem[e.col]);
    if (!isAtual) return 'pending';

    const pri       = Number(ordem.Prioridade) || 2;
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
    const pri       = Number(ordem.Prioridade) || 2;
    const prazoDias = (PRAZOS[pri] || PRAZOS[2])[idx];
    const startDate = idx === 0
      ? new Date(ordem.Data_Solicitacao)
      : new Date(ordem[ETAPAS[idx - 1].col]);
    if (isNaN(startDate.getTime())) return '';
    const diffDias = Math.floor((Date.now() - startDate.getTime()) / 86400000);
    if (prazoDias === 0) return diffDias === 0 ? 'Hoje' : `+${diffDias}d`;
    if (diffDias > prazoDias) return `+${diffDias - prazoDias}d atraso`;
    const rest = prazoDias - diffDias;
    return `${rest}d restante${rest === 1 ? '' : 's'}`;
  }

  /* ── MODAL DE ETAPA ───────────────────────────────────────────────── */
  function _abrirModal(ordem, etapaIdx, el) {
    const etapa = ETAPAS[etapaIdx];
    const hoje  = new Date().toISOString().split('T')[0];

    /* State local da foto do modal */
    let _modalFotoFile   = null;
    let _modalFotoB64    = null;
    let _modalFotoMime   = null;
    let toggleState      = false;

    /* Campos extras da etapa */
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
      ? `<p style="font-size:.78rem;color:var(--txt3);margin:0 0 14px">${etapa.note}</p>` : '';

    const html = `
<div class="cac-modal-overlay" id="cac-modal-overlay">
  <div class="cac-modal">
    <div class="cac-modal-header">
      <span class="cac-modal-title">Etapa ${etapaIdx + 1} — ${etapa.label}</span>
      <button class="cac-modal-close" id="cac-modal-close-btn">✕</button>
    </div>
    <div class="cac-modal-body">
      <p style="font-size:.8rem;color:var(--txt3);margin:0 0 16px">
        Ordem: <b style="color:var(--txt2)">${_esc(ordem.ID)}</b>
        <span style="margin-left:8px;color:var(--txt3)">${_esc(ordem.Descricao || '')}</span>
      </p>

      ${noteHtml}

      <!-- Data obrigatória -->
      <div class="mf">
        <label for="m-data">Data de Conclusão <span style="color:#C41230">*</span></label>
        <input type="date" id="m-data" value="${hoje}" max="${hoje}" required>
      </div>

      ${extraHtml}

      <!-- ── OBSERVAÇÕES (novo) ── -->
      <div class="mf" style="margin-top:4px">
        <label for="m-obs">Observações <span style="text-transform:none;font-weight:400;color:var(--txt3)">(opcional)</span></label>
        <textarea id="m-obs" rows="2" style="resize:vertical"
          placeholder="Anotações desta etapa, detalhes relevantes..."></textarea>
      </div>

      <!-- ── FOTO (novo) ── -->
      <div class="mf">
        <label>Foto <span style="text-transform:none;font-weight:400;color:var(--txt3)">(opcional)</span></label>
        <div class="cac-foto-modal-drop" id="m-foto-drop">
          📷 Clique para anexar foto desta etapa
          <input type="file" id="m-foto-input" accept="image/*" style="display:none">
        </div>
        <div id="m-foto-preview" class="cac-foto-modal-preview"></div>
      </div>
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

    /* Foto bind */
    const fotoDropEl = overlay.querySelector('#m-foto-drop');
    const fotoInpEl  = overlay.querySelector('#m-foto-input');
    const fotoPrevEl = overlay.querySelector('#m-foto-preview');

    fotoDropEl.addEventListener('click', () => fotoInpEl.click());
    fotoInpEl.addEventListener('change', function () {
      const file = this.files[0];
      if (!file || !file.type.startsWith('image/')) return;
      _modalFotoFile = file;
      _modalFotoMime = file.type;
      const reader = new FileReader();
      reader.onload = ev => {
        _modalFotoB64 = ev.target.result.split(',')[1];
        fotoPrevEl.innerHTML = `
          <div class="cac-foto-modal-thumb">
            <img src="${ev.target.result}" alt="${_esc(file.name)}">
            <span>${_esc(file.name)} · ${(file.size/1024).toFixed(0)} KB</span>
            <button type="button" id="m-foto-remover" title="Remover">✕</button>
          </div>`;
        overlay.querySelector('#m-foto-remover').addEventListener('click', () => {
          _modalFotoFile = null; _modalFotoB64 = null; _modalFotoMime = null;
          fotoInpEl.value = '';
          fotoPrevEl.innerHTML = '';
        });
      };
      reader.readAsDataURL(file);
    });

    /* Fechar */
    const fechar = () => overlay.remove();
    overlay.querySelector('#cac-modal-close-btn').addEventListener('click', fechar);
    overlay.querySelector('#cac-modal-cancel').addEventListener('click', fechar);
    overlay.addEventListener('click', e => { if (e.target === overlay) fechar(); });

    /* Salvar */
    overlay.querySelector('#cac-modal-salvar').addEventListener('click', async function () {
      const dataVal = overlay.querySelector('#m-data').value;
      if (!dataVal) { alert('Informe a data de conclusão.'); return; }

      this.disabled = true;
      this.innerHTML = `<span class="cac-spinner"></span>Salvando...`;

      const payload = { [etapa.col]: dataVal };

      /* Campos extras da etapa */
      etapa.extra.forEach(ex => {
        if (ex.type === 'toggle') {
          payload[ex.id] = toggleState ? 'TRUE' : 'FALSE';
        } else {
          const v = overlay.querySelector(`#m-${ex.id}`)?.value || '';
          if (v) payload[ex.id] = v;
        }
      });

      /* Observações */
      const obs = overlay.querySelector('#m-obs')?.value?.trim() || '';
      if (obs) {
        /* Concatena com obs existente se houver */
        const obsExist = (ordem.Observacoes || '').trim();
        payload.Observacoes = obsExist ? obsExist + '\n' + obs : obs;
      }

      /* Se etapa 7 → concluída */
      if (etapaIdx === 6) payload.Status = 'concluida';

      try {
        /* Upload da foto de acompanhamento (se houver) */
        if (_modalFotoB64 && _opts.gsUrl) {
          try {
            const ext = (_modalFotoFile?.name?.split('.').pop() || 'jpg').toLowerCase();
            const fr  = await _post(_opts.gsUrl, {
              action:   'uploadFoto',
              numero:   ordem.ID + '_etapa' + (etapaIdx + 1),
              fileName: `${ordem.ID}_etapa${etapaIdx + 1}.${ext}`,
              mimeType: _modalFotoMime || 'image/jpeg',
              base64:   _modalFotoB64
            });
            if (fr.ok && fr.fileUrl) {
              /* Adiciona URL ao array de fotos existente */
              const fotosAtuais = _parseFotos(ordem.Fotos);
              fotosAtuais.push(fr.fileUrl);
              payload.Fotos = JSON.stringify(fotosAtuais);
            }
          } catch (fotoErr) {
            console.warn('Foto da etapa não enviada:', fotoErr);
          }
        }

        const r = await _post(_opts.gsUrl, {
          action: 'update',
          sheet:  'compras',
          id:      ordem.ID,
          idCol:  'ID',
          row:     payload
        });
        if (!r.ok) throw new Error(r.error || 'Erro no servidor');

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
    if (!confirm(`Recusar o orçamento da ordem ${ordem.ID}?\nEssa ação encerrará a ordem como "Orçamento Recusado".`)) return;
    try {
      const r = await _post(_opts.gsUrl, {
        action: 'update',
        sheet:  'compras',
        id:      ordem.ID,
        idCol:  'ID',
        row:    {
          Orcamento_Recusado: 'TRUE',
          Status:             'orcamento_recusado',
          Data_Etapa2:        new Date().toISOString().split('T')[0]
        }
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
    try { return new Date(iso).toLocaleDateString('pt-BR'); }
    catch { return iso; }
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
    return String(s || '')
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /* ── EXPORT ───────────────────────────────────────────────────────── */
  global.ComprasAcompanhamento = { render };

})(window);
