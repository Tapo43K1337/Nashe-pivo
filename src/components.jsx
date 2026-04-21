// Reusable components: ProductCard (flip), Modal, CartDrawer, etc.
const { useState, useEffect, useRef, useMemo } = React;
const useNpData = window.useNpData;

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

// Оформлення замовлення — окрема модалка поверх сторінки
const CheckoutModal = ({ open, onClose, onComplete, onReturnToCart, items }) => {
  const { addOrder } = useNpData();
  const [coStep, setCoStep] = useState(0);
  const [coName, setCoName] = useState('');
  const [coPhone, setCoPhone] = useState('');
  const [coAddress, setCoAddress] = useState('');
  const [coErr, setCoErr] = useState('');

  const total = items.reduce((s, it) => s + it.price * it.qty, 0);
  const grandTotal = total + (total >= 500 ? 0 : 80);

  useEffect(() => {
    if (!open) return;
    setCoStep(0);
    setCoName('');
    setCoPhone('');
    setCoAddress('');
    setCoErr('');
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      if (coStep === 3) onComplete();
      else onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, coStep, onClose, onComplete]);

  const dismissOverlay = () => {
    if (coStep === 3) onComplete();
    else onClose();
  };

  const checkoutBack = () => {
    setCoErr('');
    if (coStep === 0) {
      onClose();
      onReturnToCart?.();
    } else setCoStep(coStep - 1);
  };

  const checkoutNext = () => {
    setCoErr('');
    if (coStep === 0) {
      if (!coName.trim()) { setCoErr('Вкажіть ім’я'); return; }
      setCoStep(1);
    } else if (coStep === 1) {
      if (!coPhone.trim()) { setCoErr('Вкажіть номер телефону'); return; }
      setCoStep(2);
    } else if (coStep === 2) {
      if (!coAddress.trim()) { setCoErr('Вкажіть адресу доставки'); return; }
      const payload = {
        name: coName.trim(),
        phone: coPhone.trim(),
        address: coAddress.trim(),
        total: grandTotal,
        delivery: total >= 500 ? 0 : 80,
        items: items.map((i) => ({ id: i.id, name: i.name, qty: i.qty, price: i.price, line: i.price * i.qty })),
      };
      try {
        addOrder(payload);
        console.info('[Наше Пиво] Замовлення', payload);
      } catch (e) {}
      setCoStep(3);
    }
  };

  const inputBase = {
    width: '100%',
    boxSizing: 'border-box',
    padding: '14px 16px',
    background: 'var(--surface)',
    border: '1px solid var(--line)',
    color: 'var(--ink)',
    fontSize: 16,
    outline: 'none',
  };

  if (!open) return null;

  return (
    <div
      className="checkout-modal-overlay"
      onClick={dismissOverlay}
      style={{
        position: 'fixed', inset: 0, zIndex: 120,
        background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(8px)',
        display: 'grid', placeItems: 'center',
        padding: 'max(16px, env(safe-area-inset-top)) 20px max(20px, env(safe-area-inset-bottom))',
        animation: 'fadeUp .25s ease',
      }}
    >
      <div
        className="checkout-modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--bg)',
          border: '1px solid var(--line)',
          width: '100%',
          maxWidth: 440,
          maxHeight: 'min(92dvh, 640px)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          boxShadow: '0 32px 80px rgba(0,0,0,0.45)',
        }}
      >
        <button
          type="button"
          onClick={dismissOverlay}
          style={{
            position: 'absolute', top: 14, right: 14, zIndex: 2,
            width: 36, height: 36, border: '1px solid var(--line)',
            display: 'grid', placeItems: 'center', background: 'var(--bg)',
          }}
          aria-label="Закрити"
        >
          <Icon.Close />
        </button>

        <div style={{ padding: '24px 28px 16px', borderBottom: '1px solid var(--line)', paddingRight: 52 }}>
          <span className="mono" style={{ color: 'var(--ink-3)' }}>
            {coStep < 3 ? `ОФОРМЛЕННЯ · крок ${coStep + 1} з 3` : 'ГОТОВО'}
          </span>
          <h3 style={{ fontSize: 26, fontStyle: 'italic', marginTop: 8, marginBottom: 0 }}>
            {coStep < 3 ? 'Дані для доставки' : 'Дякуємо!'}
          </h3>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 28px', minHeight: 0 }}>
          {coStep === 3 ? (
            <div style={{ padding: '8px 0 12px', textAlign: 'center' }}>
              <p style={{ fontFamily: 'Fraunces, serif', fontSize: 21, fontStyle: 'italic', color: 'var(--ink-2)', lineHeight: 1.45, margin: '0 0 14px' }}>
                Ми отримали ваше замовлення.
              </p>
              <p style={{ color: 'var(--ink-2)', fontSize: 15, lineHeight: 1.6, margin: 0 }}>
                Ми зв’яжемося з вами для підтвердження замовлення.
              </p>
            </div>
          ) : (
            <div>
              <div className="mono" style={{ color: 'var(--ink-3)', marginBottom: 12, fontSize: 10 }}>
                До сплати: <span style={{ color: 'var(--accent)' }}>{grandTotal} ₴</span>
              </div>
              {coStep === 0 && (
                <>
                  <label className="mono" style={{ display: 'block', color: 'var(--ink-3)', marginBottom: 10 }}>Ім’я</label>
                  <input
                    type="text"
                    autoComplete="name"
                    value={coName}
                    onChange={(e) => setCoName(e.target.value)}
                    placeholder="Як до вас звертатись"
                    style={inputBase}
                  />
                </>
              )}
              {coStep === 1 && (
                <>
                  <label className="mono" style={{ display: 'block', color: 'var(--ink-3)', marginBottom: 10 }}>Телефон</label>
                  <input
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={coPhone}
                    onChange={(e) => setCoPhone(e.target.value)}
                    placeholder="+380 …"
                    style={inputBase}
                  />
                </>
              )}
              {coStep === 2 && (
                <>
                  <label className="mono" style={{ display: 'block', color: 'var(--ink-3)', marginBottom: 10 }}>Адреса</label>
                  <textarea
                    autoComplete="street-address"
                    value={coAddress}
                    onChange={(e) => setCoAddress(e.target.value)}
                    placeholder="Місто, вулиця, будинок, під’їзд / поверх"
                    rows={4}
                    style={{ ...inputBase, resize: 'vertical', minHeight: 100, fontFamily: 'inherit', lineHeight: 1.45 }}
                  />
                </>
              )}
              {coErr ? (
                <p role="alert" style={{ color: 'var(--danger)', fontSize: 13, marginTop: 14, marginBottom: 0 }}>{coErr}</p>
              ) : null}
            </div>
          )}
        </div>

        {coStep < 3 ? (
          <div style={{ borderTop: '1px solid var(--line)', padding: '18px 28px 22px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                type="button"
                onClick={checkoutBack}
                className="mono"
                style={{
                  flex: '0 0 auto',
                  padding: '14px 16px',
                  border: '1px solid var(--line)',
                  background: 'transparent',
                  color: 'var(--ink-2)',
                  fontSize: 11,
                  letterSpacing: '0.08em',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <Icon.Arrow dir="left" /> {coStep === 0 ? 'До кошика' : 'Назад'}
              </button>
              <button
                type="button"
                onClick={checkoutNext}
                style={{
                  flex: 1,
                  padding: '14px 16px',
                  background: 'var(--accent)',
                  color: '#1a1200',
                  border: 'none',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 11,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                {coStep === 2 ? 'Надіслати' : 'Далі'} {coStep < 2 ? <Icon.Arrow /> : null}
              </button>
            </div>
            <p className="mono" style={{ color: 'var(--ink-3)', textAlign: 'center', margin: 0, fontSize: 10 }}>
              18+ · Ми перевіримо вік при доставці
            </p>
          </div>
        ) : (
          <div style={{ borderTop: '1px solid var(--line)', padding: '20px 28px 24px' }}>
            <button
              type="button"
              onClick={onComplete}
              style={{
                width: '100%', padding: '18px',
                background: 'var(--accent)', color: '#1a1200', border: 'none',
                fontFamily: 'JetBrains Mono, monospace', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase',
              }}
            >
              Зрозуміло
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Cart Drawer — лише вміст кошика; оформлення відкриває CheckoutModal
const CartDrawer = ({ open, onClose, items, update, remove, onRequestCheckout }) => {
  const total = items.reduce((s, it) => s + it.price * it.qty, 0);
  const count = items.reduce((s, it) => s + it.qty, 0);
  const grandTotal = total + (total >= 500 ? 0 : 80);
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
          <button type="button" onClick={onClose} style={{ width: 36, height: 36, display: 'grid', placeItems: 'center' }}>
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
                  <button type="button" onClick={() => remove(it.id)} className="mono" style={{ color: 'var(--ink-3)', textDecoration: 'underline', textUnderlineOffset: 3 }}>
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
              <span style={{ fontFamily: 'Fraunces, serif', fontSize: 36 }}>{grandTotal} ₴</span>
            </div>
            <button
              type="button"
              onClick={onRequestCheckout}
              style={{
                width: '100%', padding: '18px',
                background: 'var(--accent)', color: '#1a1200', border: 'none',
                fontFamily: 'JetBrains Mono, monospace', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              }}
            >
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

Object.assign(window, { ProductCard, ProductModal, CartDrawer, CheckoutModal, Qty, Pill, DefRow });
