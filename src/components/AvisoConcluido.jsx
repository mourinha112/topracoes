import React, { useEffect, useState } from 'react';

// Liga/desliga o popup de "atualizacao concluida". false = nao mostra.
export const AVISO_CONCLUIDO_ATIVO = true;

// Muda esta versao quando quiser que o popup apareca de novo para todos.
const CHAVE = 'topracoes_att_concluida_v1';

export default function AvisoConcluido() {
  const [mostrar, setMostrar] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(CHAVE)) setMostrar(true);
    } catch { setMostrar(true); }
  }, []);

  function fechar() {
    try { localStorage.setItem(CHAVE, '1'); } catch {}
    setMostrar(false);
  }

  if (!mostrar) return null;

  return (
    <div style={s.fundo} role="alertdialog" aria-modal="true" aria-labelledby="aviso-ok-titulo">
      <div style={s.caixa}>
        <div style={s.icone}>
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2 id="aviso-ok-titulo" style={s.titulo}>Update completed successfully</h2>
        <p style={s.texto}>
          The API and framework update has been completed.
          The system is now available for normal use.
        </p>
        <button type="button" style={s.botao} onClick={fechar}
          onMouseOver={(e) => (e.currentTarget.style.background = '#248043')}
          onMouseOut={(e) => (e.currentTarget.style.background = '#2f9e52')}>
          OK
        </button>
      </div>
    </div>
  );
}

const s = {
  fundo: {
    position: 'fixed', inset: 0, zIndex: 2147483647,
    background: 'rgba(10, 14, 20, 0.80)', backdropFilter: 'blur(5px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
    fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
  },
  caixa: {
    background: '#fff', borderRadius: 16, maxWidth: 420, width: '100%',
    padding: '32px 28px', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,.4)',
  },
  icone: {
    width: 64, height: 64, borderRadius: '50%', background: '#2f9e52',
    display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px',
  },
  titulo: { margin: '0 0 10px', fontSize: 22, color: '#1f2937' },
  texto: { margin: '0 0 24px', fontSize: 15, lineHeight: 1.5, color: '#4b5563' },
  botao: {
    appearance: 'none', border: 'none', cursor: 'pointer',
    background: '#2f9e52', color: '#fff', fontSize: 16, fontWeight: 700,
    padding: '12px 40px', borderRadius: 10, transition: 'background .15s',
  },
};
