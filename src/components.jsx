// Reusable components: ProductCard (flip), Modal, CartDrawer, etc.
const { useState, useEffect, useRef, useMemo } = React;

// Product Card — flip variant (mobile: solo = 1 col large, duo = 2 col refined)
const ProductCard = ({ product, onOpen, onAdd, style = 'flip', density = 'comfortable', mobileCardMode = 'desktop' }) => {
  const [flipped, setFlipped] = useState(false);
  const compact = density === 'compact';
  const solo = mobileCardMode === 'solo';
  const duo = mobileCardMode === 'duo';
  const m = solo || duo;

  const aspect = solo ? '3 / 3.5' : duo ? '3 / 3.68' : compact ? '3 / 4.2' : '3 / 4.5';
  const padTop = !m ? '14px 16px 0' : solo ? '12px 18px 0' : '10px 14px 0';
  const padBot = !m ? '0 16px 16px' : solo ? '0 18px 22px' : '0 14px 16px';
  const padBotTop = !m ? 14 : solo ? 14 : 11;
  const titleSz = !m ? (compact ? 18 : 22) : solo ? 19 : 16;
  const monoHead = m ? (solo ? 10 : 9) : undefined;
  const monoFoot = m ? (solo ? 11 : 10) : undefined;
  const bottleSz = !m ? (compact ? 150 : 180) : solo ? 130 : 115;
  const backPad = !m ? '20px' : solo ? '18px' : '14px';
  const backTitle = !m ? 22 : solo ? 20 : 17;
  const backBody = !m ? 13 : solo ? 13 : 12;
  const btnPad = !m ? '14px' : solo ? '14px' : '12px';
  const btnFs = !m ? 11 : solo ? 11 : 10;
  const titleClamp = solo ? 3 : duo ? 2 : 3;

  const imageStyleBadge = m && product.image;
  const topBar = !(m && product.image);

  const cardClass = 'prod-card' + (m ? ` prod-card--mob${solo ? ' prod-card--mob-solo' : ' prod-card--mob-duo'}` : '');

  return (
    <div
      className={cardClass}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      onClick={() => onOpen(product)}
      style={{
        position: 'relative',
        perspective: '1400px',
        cursor: 'pointer',
        aspectRatio: aspect,
      }}
    >
      <div
        className="flip-inner"
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
          transition: style === 'flip' ? 'transform .8s cubic-bezier(.2,.8,.2,1)' : 'transform .4s',
          transform: style === 'flip' && flipped ? 'rotateY(180deg)' : 'none',
        }}
      >
        {/* Front */}
        <div style={{
          position: 'absolute', inset: 0,
          backfaceVisibility: 'hidden',
          background: 'var(--bg-2)',
          border: '1px solid var(--line)',
          display: 'flex', flexDirection: 'column',
        }}>
          {topBar && (
          <div style={{ padding: padTop, display: 'flex', justifyContent: !m ? 'space-between' : 'flex-end', alignItems: 'baseline', gap: 6 }}>
            {!m && <span className="mono" style={{ color: 'var(--ink-3)' }}>№ {product.id.slice(1)}</span>}
            <span className="mono" style={{ color: 'var(--ink-3)', fontSize: monoHead, letterSpacing: m ? '0.06em' : undefined }}>{product.style}</span>
          </div>
          )}
          <div style={{
            flex: 1,
            position: 'relative',
            overflow: 'hidden',
          }}>
            {product.image ? (
              <>
                {imageStyleBadge && (
                  <div
                    className="mono"
                    style={{
                      position: 'absolute', top: solo ? 14 : 11, right: solo ? 14 : 10, zIndex: 2,
                      padding: solo ? '8px 14px' : '6px 11px',
                      borderRadius: 999,
                      background: 'rgba(0,0,0,0.5)',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      color: 'rgba(255,255,255,0.92)',
                      fontSize: solo ? 11 : 10,
                      letterSpacing: '0.08em',
                    }}
                  >{product.style}</div>
                )}
                <img
                  src={product.image}
                  alt={product.name}
                  style={{
                    position: 'absolute', inset: 0,
                    width: '100%', height: '100%',
                    objectFit: 'cover',
                    transition: 'transform .6s ease',
                    transform: flipped && style !== 'flip' ? 'scale(1.05)' : 'scale(1)',
                  }}
                />
              </>
            ) : (
              <>
                <div style={{
                  position: 'absolute', inset: '8%',
                  background: `radial-gradient(circle at 50% 40%, color-mix(in srgb, ${product.color} 30%, transparent), transparent 60%)`,
                  opacity: 0.7,
                }} />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', position: 'relative', transition: 'transform .6s ease', transform: flipped && style !== 'flip' ? 'translateY(-8px)' : 'none' }}>
                  <Bottle product={product} size={bottleSz} />
                </div>
              </>
            )}
          </div>
          <div style={{ padding: padBot, borderTop: '1px solid color-mix(in srgb, var(--line) 75%, transparent)', paddingTop: padBotTop }}>
            <h3 style={{ fontSize: titleSz, lineHeight: 1.14, marginBottom: m ? 8 : 6, display: '-webkit-box', WebkitLineClamp: titleClamp, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.name}</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
              <span className="mono" style={{ color: 'var(--accent)', fontSize: solo ? 14 : m ? 12 : undefined, fontWeight: m ? 600 : undefined }}>{product.price} ₴</span>
              <span className="mono" style={{ color: 'var(--ink-3)', fontSize: monoFoot || undefined, textAlign: 'right' }}>{product.vol}{product.abv ? ` · ${product.abv}%` : ''}</span>
            </div>
          </div>
        </div>

        {/* Back */}
        <div style={{
          position: 'absolute', inset: 0,
          backfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
          background: 'var(--surface)',
          border: '1px solid var(--accent)',
          padding: backPad,
          display: 'flex', flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          <div>
            <span className="mono" style={{ color: 'var(--accent)', fontSize: monoHead }}>{product.style}</span>
            <h3 style={{ fontSize: backTitle, lineHeight: 1.1, margin: m ? '8px 0 10px' : '10px 0 14px', fontStyle: 'italic' }}>{product.name}</h3>
            <p style={{ fontSize: backBody, color: 'var(--ink-2)', margin: 0, lineHeight: 1.45 }}>{product.tagline}</p>
            <div style={{ height: 1, background: 'var(--line)', margin: m ? '12px 0' : '16px 0' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: m ? 6 : 8, fontSize: m ? (solo ? 12 : 11) : 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--ink-2)' }}>
                <span className="mono" style={{ color: 'var(--ink-3)' }}>СМАК</span>
                <span style={{ textAlign: 'right', maxWidth: '70%' }}>{product.notes}</span>
              </div>
              {product.abv != null && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--ink-2)' }}>
                  <span className="mono" style={{ color: 'var(--ink-3)' }}>МІЦНІСТЬ</span>
                  <span>{product.abv}% · {product.ibu} IBU</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--ink-2)' }}>
                <span className="mono" style={{ color: 'var(--ink-3)' }}>ОБ’ЄМ</span>
                <span>{product.vol}</span>
              </div>
            </div>
          </div>
          <button
            className="btn-primary"
            onClick={(e) => { e.stopPropagation(); onAdd(product); }}
            style={{
              width: '100%',
              padding: btnPad,
              background: 'var(--accent)',
              color: '#1a1200',
              border: 'none',
              fontFamily: 'JetBrains Mono, monospace',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              fontSize: btnFs,
              transition: 'background .2s',
            }}
            onMouseOver={(e) => e.currentTarget.style.background = 'var(--accent-2)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'var(--accent)'}
          >
            {m ? `Кошик · ${product.price} ₴` : `До кошика · ${product.price} ₴`}
          </button>
        </div>
      </div>
    </div>
  );
};

// Quantity selector
const Qty = ({ value, onChange }) => (
  <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid var(--line)' }}>
    <button onClick={() => onChange(Math.max(1, value - 1))} style={{ width: 32, height: 32, display: 'grid', placeItems: 'center' }}>
      <Icon.Minus />
    </button>
    <span style={{ width: 32, textAlign: 'center', fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>{value}</span>
    <button onClick={() => onChange(value + 1)} style={{ width: 32, height: 32, display: 'grid', placeItems: 'center' }}>
      <Icon.Plus />
    </button>
  </div>
);

// Product modal
const ProductModal = ({ product, onClose, onAdd }) => {
  const [qty, setQty] = useState(1);
  useEffect(() => {
    if (!product) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [product, onClose]);
  if (!product) return null;
  return (
    <div
      className="prod-modal-overlay"
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
        display: 'grid', placeItems: 'center', padding: 24,
        animation: 'fadeUp .3s ease',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--bg)', border: '1px solid var(--line)',
          maxWidth: 1040, width: '100%', maxHeight: '92vh',
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          position: 'relative', overflow: 'auto',
        }}
        className="prod-modal"
      >
        <button className="prod-modal-close" onClick={onClose} style={{
          position: 'absolute', top: 16, right: 16, zIndex: 3,
          width: 36, height: 36, border: '1px solid var(--line)',
          display: 'grid', placeItems: 'center', background: 'var(--bg)',
        }}>
          <Icon.Close />
        </button>
        {/* Visual */}
        <div className="prod-modal-visual" style={{
          background: `radial-gradient(circle at 50% 40%, color-mix(in srgb, ${product.color} 25%, var(--bg-2)), var(--bg-2) 75%)`,
          display: 'grid', placeItems: 'center', padding: 0,
          minHeight: 420, position: 'relative', overflow: 'hidden',
        }}>
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <>
              <div className="ph-stripe" style={{ position: 'absolute', inset: 0, opacity: 0.15 }} />
              <Bottle product={product} size={340} />
            </>
          )}
        </div>
        {/* Info */}
        <div className="prod-modal-body" style={{ padding: '56px 40px 40px', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <span className="mono prod-modal-kicker" style={{ color: 'var(--accent)' }}>{product.style} · {product.origin}</span>
          <h2 className="prod-modal-title" style={{ fontSize: 48, lineHeight: 1.05, margin: '16px 0 14px', fontStyle: 'italic' }}>{product.name}</h2>
          <p className="prod-modal-tagline" style={{ color: 'var(--ink-2)', fontSize: 16, lineHeight: 1.55, margin: 0 }}>{product.tagline}</p>

          <div className="prod-modal-divider" style={{ height: 1, background: 'var(--line)', margin: '22px 0' }} />

          <dl className="prod-modal-dl" style={{ margin: 0, display: 'grid', gap: 14 }}>
            <DefRow label="Смакові ноти" value={product.notes} />
            <DefRow label="Сполучається з" value={product.pair} />
            {product.abv != null && <DefRow label="Міцність / гіркота" value={`${product.abv}% ABV · ${product.ibu} IBU`} />}
            <DefRow label="Об’єм" value={product.vol} />
          </dl>

          <div className="prod-modal-divider" style={{ height: 1, background: 'var(--line)', margin: '22px 0' }} />

          <div className="prod-modal-footer-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, gap: 12, flexWrap: 'wrap' }}>
            <div>
              <div className="mono" style={{ color: 'var(--ink-3)', marginBottom: 4 }}>ЦІНА</div>
              <div className="prod-modal-price" style={{ fontFamily: 'Fraunces, serif', fontSize: 36 }}>{product.price} ₴</div>
            </div>
            <Qty value={qty} onChange={setQty} />
          </div>

          <button
            className="prod-modal-add"
            onClick={() => { onAdd(product, qty); onClose(); }}
            style={{
              padding: '18px',
              background: 'var(--accent)', color: '#1a1200', border: 'none',
              fontFamily: 'JetBrains Mono, monospace', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
            }}
          >
            <Icon.Cart /> Додати до кошика
          </button>
        </div>
      </div>
    </div>
  );
};

const DefRow = ({ label, value }) => (
  <div className="def-row" style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 16, alignItems: 'start' }}>
    <dt className="mono" style={{ color: 'var(--ink-3)' }}>{label}</dt>
    <dd style={{ margin: 0, color: 'var(--ink)', fontSize: 14, lineHeight: 1.55 }}>{value}</dd>
  </div>
);

// Cart Drawer
const CartDrawer = ({ open, onClose, items, update, remove }) => {
  const total = items.reduce((s, it) => s + it.price * it.qty, 0);
  const count = items.reduce((s, it) => s + it.qty, 0);
  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 99,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)',
          opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity .3s',
        }}
      />
      <aside
        className="cart-drawer"
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0, width: '100%', maxWidth: 480, zIndex: 100,
          background: 'var(--bg)', borderLeft: '1px solid var(--line)',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform .4s cubic-bezier(.2,.8,.2,1)',
          display: 'flex', flexDirection: 'column',
        }}
      >
        <div style={{ padding: '24px 28px', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span className="mono" style={{ color: 'var(--ink-3)' }}>КОШИК · {count} поз.</span>
            <h3 style={{ fontSize: 28, fontStyle: 'italic', marginTop: 6 }}>Ваше замовлення</h3>
          </div>
          <button onClick={onClose} style={{ width: 36, height: 36, display: 'grid', placeItems: 'center' }}>
            <Icon.Close />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 28px' }}>
          {items.length === 0 ? (
            <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--ink-3)' }}>
              <div style={{ fontFamily: 'Fraunces, serif', fontSize: 32, fontStyle: 'italic', color: 'var(--ink-2)', marginBottom: 12 }}>Порожньо</div>
              <p className="mono">Додайте щось із каталогу</p>
            </div>
          ) : items.map(it => (
            <div key={it.id} style={{ display: 'grid', gridTemplateColumns: '72px 1fr auto', gap: 16, padding: '18px 0', borderBottom: '1px solid var(--line)', alignItems: 'center' }}>
              <div style={{
                width: 72, height: 88,
                background: `linear-gradient(180deg, color-mix(in srgb, ${it.color} 30%, var(--bg-2)), var(--bg-2))`,
                overflow: 'hidden', flexShrink: 0,
              }}>
                {it.image ? (
                  <img src={it.image} alt={it.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ display: 'grid', placeItems: 'center', height: '100%' }}>
                    <Bottle product={it} size={60} />
                  </div>
                )}
              </div>
              <div>
                <div className="mono" style={{ color: 'var(--ink-3)', marginBottom: 4 }}>{it.style}</div>
                <div style={{ fontFamily: 'Fraunces, serif', fontSize: 18, marginBottom: 10 }}>{it.name}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Qty value={it.qty} onChange={(q) => update(it.id, q)} />
                  <button onClick={() => remove(it.id)} className="mono" style={{ color: 'var(--ink-3)', textDecoration: 'underline', textUnderlineOffset: 3 }}>
                    видалити
                  </button>
                </div>
              </div>
              <div style={{ textAlign: 'right', fontFamily: 'Fraunces, serif', fontSize: 18 }}>
                {it.price * it.qty} ₴
              </div>
            </div>
          ))}
        </div>

        {items.length > 0 && (
          <div style={{ borderTop: '1px solid var(--line)', padding: '24px 28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--ink-2)', marginBottom: 8 }}>
              <span>Доставка</span>
              <span>{total >= 500 ? 'безкоштовно' : '80 ₴'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', margin: '18px 0 20px' }}>
              <span className="mono" style={{ color: 'var(--ink-3)' }}>РАЗОМ</span>
              <span style={{ fontFamily: 'Fraunces, serif', fontSize: 36 }}>{total + (total >= 500 ? 0 : 80)} ₴</span>
            </div>
            <button style={{
              width: '100%', padding: '18px',
              background: 'var(--accent)', color: '#1a1200', border: 'none',
              fontFamily: 'JetBrains Mono, monospace', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            }}>
              Оформити замовлення <Icon.Arrow />
            </button>
            <p className="mono" style={{ color: 'var(--ink-3)', textAlign: 'center', marginTop: 12, fontSize: 10 }}>
              18+ · Ми перевіримо вік при доставці
            </p>
          </div>
        )}
      </aside>
    </>
  );
};

// Pill button
const Pill = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className="mono"
    style={{
      padding: '8px 14px',
      border: `1px solid ${active ? 'var(--accent)' : 'var(--line)'}`,
      background: active ? 'var(--accent)' : 'transparent',
      color: active ? '#1a1200' : 'var(--ink-2)',
      transition: 'all .2s',
    }}
  >
    {children}
  </button>
);

Object.assign(window, { ProductCard, ProductModal, CartDrawer, Qty, Pill, DefRow });
