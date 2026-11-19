import React, { useEffect } from 'react';

// Liga/desliga o aviso. false = sistema volta ao normal.
export const AVISO_ATUALIZACAO_ATIVO = true;

export default function AvisoAtualizacao() {
  useEffect(() => {
    const htmlOverflow = document.documentElement.style.overflow;
    const bodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    // Nenhuma tecla passa para a tela de baixo (Esc, Tab, atalhos).
    const travar = (e) => { e.stopPropagation(); e.preventDefault(); };
    window.addEventListener('keydown', travar, true);

    return () => {
      document.documentElement.style.overflow = htmlOverflow;
      document.body.style.overflow = bodyOverflow;
      window.removeEventListener('keydown', travar, true);
    };
  }, []);

  return (
    <div style={s.fundo} role="alertdialog" aria-modal="true" aria-labelledby="aviso-att-titulo"
      onClick={(e) => e.stopPropagation()} onContextMenu={(e) => e.preventDefault()}>
      <div style={s.caixa}>
        <div style={s.icone}>
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12a9 9 0 1 1-3-6.7" /><polyline points="21 3 21 9 15 9" />
          </svg>
        </div>
        <h2 id="aviso-att-titulo" style={s.titulo}>Atualização de API em andamento</h2>
        <p style={s.texto}>
          O sistema está passando por uma atualização de API e framework.
          Durante a manutenção o acesso fica temporariamente indisponível.
        </p>
        <div style={s.status}>
          <span style={s.ponto} />
          Atualização em andamento
        </div>
        <p style={s.rodape}>Fale com o responsável do sistema para verificar como é feita a atualização da API.</p>
      </div>
      <style>{`@keyframes avisoPulse{0%,100%{opacity:1}50%{opacity:.3}}`}</style>
    </div>
  );
}

const s = {
  fundo: {
    position: 'fixed', inset: 0, zIndex: 2147483647,
    background: 'rgba(10, 14, 20, 0.88)', backdropFilter: 'blur(6px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
    fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
  },
  caixa: {
    background: '#fff', borderRadius: 16, maxWidth: 440, width: '100%',
    padding: '32px 28px', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,.4)',
  },
  icone: {
    width: 64, height: 64, borderRadius: '50%', background: '#e67e22',
    display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px',
  },
  titulo: { margin: '0 0 10px', fontSize: 22, color: '#1f2937' },
  texto: { margin: '0 0 20px', fontSize: 15, lineHeight: 1.5, color: '#4b5563' },
  status: {
    display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 14px',
    borderRadius: 999, background: '#fff4e6', color: '#b45309', fontSize: 13, fontWeight: 600,
  },
  ponto: {
    width: 8, height: 8, borderRadius: '50%', background: '#e67e22',
    animation: 'avisoPulse 1.2s ease-in-out infinite',
  },
  rodape: { margin: '20px 0 0', fontSize: 12, color: '#9ca3af' },
};
