// Tweaks panel
const TweakPanel = ({ state, setState, onClose }) => {
  const set = (k, v) => {
    const next = { ...state, [k]: v };
    setState(next);
    try {
      window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { [k]: v } }, '*');
    } catch (e) {}
  };
  return (
    <div style={{
      position: 'fixed', bottom: 20, right: 20, zIndex: 200,
      width: 280, background: 'var(--bg)', border: '1px solid var(--accent)',
      padding: 20,
      fontFamily: 'Inter, sans-serif',
      boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <span className="mono" style={{ color: 'var(--accent)' }}>TWEAKS</span>
        <button onClick={onClose} style={{ color: 'var(--ink-3)' }}><Icon.Close size={14} /></button>
      </div>

      <Row label="Тема">
        <div style={{ display: 'flex', gap: 4 }}>
          {[
            ['amber', '#D89B3C', '#0E0E0C'],
            ['forest', '#C89B4A', '#0C1410'],
            ['cream', '#A15C1C', '#F2EBDC'],
          ].map(([k, a, bg]) => (
            <button key={k} onClick={() => set('theme', k)}
              style={{
                width: 40, height: 32, position: 'relative',
                background: bg, border: `1px solid ${state.theme === k ? 'var(--accent)' : 'var(--line)'}`,
              }}>
              <span style={{ position: 'absolute', inset: 6, background: a }} />
            </button>
          ))}
        </div>
      </Row>

      <Row label="Стиль карток">
        <div style={{ display: 'flex', gap: 4 }}>
          {[['flip', 'Flip'], ['lift', 'Lift']].map(([k, v]) => (
            <button key={k} onClick={() => set('cardStyle', k)}
              className="mono"
              style={{
                padding: '6px 10px', fontSize: 10,
                border: `1px solid ${state.cardStyle === k ? 'var(--accent)' : 'var(--line)'}`,
                color: state.cardStyle === k ? 'var(--accent)' : 'var(--ink-2)',
              }}>{v}</button>
          ))}
        </div>
      </Row>

      <Row label="Сітка">
        <div style={{ display: 'flex', gap: 4 }}>
          {[['comfortable', '3 кол.'], ['compact', '4 кол.']].map(([k, v]) => (
            <button key={k} onClick={() => set('density', k)}
              className="mono"
              style={{
                padding: '6px 10px', fontSize: 10,
                border: `1px solid ${state.density === k ? 'var(--accent)' : 'var(--line)'}`,
                color: state.density === k ? 'var(--accent)' : 'var(--ink-2)',
              }}>{v}</button>
          ))}
        </div>
      </Row>

      <Row label="Зернистість">
        <button onClick={() => set('showGrain', !state.showGrain)}
          className="mono"
          style={{
            padding: '6px 10px', fontSize: 10,
            border: `1px solid ${state.showGrain ? 'var(--accent)' : 'var(--line)'}`,
            color: state.showGrain ? 'var(--accent)' : 'var(--ink-2)',
          }}>{state.showGrain ? 'Увімкнено' : 'Вимкнено'}</button>
      </Row>
    </div>
  );
};

const Row = ({ label, children }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderTop: '1px solid var(--line)' }}>
    <span className="mono" style={{ color: 'var(--ink-3)', fontSize: 10 }}>{label}</span>
    {children}
  </div>
);

window.TweakPanel = TweakPanel;
