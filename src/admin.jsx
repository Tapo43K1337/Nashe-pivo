// Адмін-панель: /admin/* — той самий візуальний стиль (mono, Fraunces, змінні CSS)
const {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  Link,
  useNavigate,
  useLocation,
} = window.ReactRouterDOM;

const { useState, useMemo, useEffect, useRef, useCallback } = React;
const { useNpData, isAdminSession, isAdminPasswordConfigured, adminLogin, adminLogout } = window;

function RequireAuth() {
  if (!isAdminSession()) return <Navigate to="/admin/login" replace />;
  return <Outlet />;
}

function AdminLogin() {
  const nav = useNavigate();
  const [pwd, setPwd] = useState('');
  const [err, setErr] = useState('');
  const configured = typeof isAdminPasswordConfigured === 'function' && isAdminPasswordConfigured();
  const submit = (e) => {
    e.preventDefault();
    if (!configured) return;
    if (adminLogin(pwd)) {
      setErr('');
      nav('/admin/orders', { replace: true });
    } else setErr('Невірний пароль');
  };
  return (
    <div className="admin-login-wrap" style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24, background: 'var(--bg)' }}>
      <form onSubmit={submit} style={{ width: '100%', maxWidth: 400, border: '1px solid var(--line)', padding: 32, background: 'var(--bg-2)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', marginBottom: 4 }}>
          <span className="mono" style={{ color: 'var(--ink-3)', textAlign: 'center' }}>АДМІН</span>
          <h1 style={{
            fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontSize: 32, margin: '12px 0 20px',
            width: '100%', textAlign: 'center', alignSelf: 'stretch',
          }}>Вхід</h1>
        </div>
        {!configured ? (
          <p style={{ color: 'var(--danger)', fontSize: 13, lineHeight: 1.5, marginBottom: 16, textAlign: 'left' }}>
            Пароль не задано: у HTML перед скриптами додайте <span className="mono" style={{ color: 'var(--ink)' }}>window.__NP_ADMIN_PASSWORD__</span>.
          </p>
        ) : null}
        <label className="mono" style={{ display: 'block', color: 'var(--ink-3)', marginBottom: 8, fontSize: 10, textAlign: 'left' }}>ПАРОЛЬ</label>
        <input type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} autoComplete="current-password" disabled={!configured}
          style={{ width: '100%', padding: 14, marginBottom: 16, background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--ink)', fontSize: 15, opacity: configured ? 1 : 0.5 }} />
        {err ? <p style={{ color: 'var(--danger)', fontSize: 14, marginBottom: 12 }}>{err}</p> : null}
        <button type="submit" className="mono" disabled={!configured} style={{ width: '100%', padding: 16, background: 'var(--accent)', color: '#1a1200', border: 'none', letterSpacing: '0.1em', fontSize: 11, opacity: configured ? 1 : 0.45 }}>
          Увійти
        </button>
        <p className="mono" style={{ color: 'var(--ink-3)', fontSize: 10, marginTop: 20, textAlign: 'center' }}>
          <Link to="/" style={{ color: 'var(--accent)' }}>На сайт</Link>
        </p>
      </form>
    </div>
  );
}

function AdminLogoutBtn({ onAfter } = {}) {
  const nav = useNavigate();
  return (
    <button type="button" className="mono" onClick={() => { adminLogout(); nav('/admin/login', { replace: true }); onAfter?.(); }}
      style={{ width: '100%', padding: 12, border: '1px solid var(--line)', background: 'transparent', color: 'var(--ink-3)', fontSize: 10 }}>
      Вийти
    </button>
  );
}

/** Мобільна адмінка: компактна шапка, розділи за кнопкою «меню» */
function AdminMobileHeader() {
  const loc = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const panelId = 'admin-mobile-nav-panel';

  useEffect(() => {
    setMenuOpen(false);
  }, [loc.pathname]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  const link = (segment, label) => {
    const full = `/admin/${segment}`;
    const on = loc.pathname === full || loc.pathname.startsWith(`${full}/`);
    return (
      <Link key={segment} to={full} onClick={closeMenu} className={`mono admin-side-link${on ? ' is-active' : ''}`}>{label}</Link>
    );
  };

  return (
    <header className={`admin-mobile-header${menuOpen ? ' admin-mobile-header--menu-open' : ''}`} aria-label="Адмін-панель">
      <div className="admin-mobile-header-bar">
        <div className="admin-mobile-header-brand">
          <span className="mono admin-mobile-header-logo">НАШЕ ПИВО</span>
          <div className="admin-mobile-header-subtitle">Панель адміністратора</div>
        </div>
        <button
          type="button"
          className={`admin-mobile-menu-btn mono${menuOpen ? ' is-open' : ''}`}
          aria-expanded={menuOpen}
          aria-controls={panelId}
          aria-label={menuOpen ? 'Закрити меню' : 'Відкрити меню'}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className="admin-mobile-burger" aria-hidden>
            <span />
            <span />
            <span />
          </span>
        </button>
      </div>
      {menuOpen ? (
        <button type="button" className="admin-mobile-menu-backdrop" aria-label="Закрити меню" onClick={closeMenu} />
      ) : null}
      <div id={panelId} className={`admin-mobile-nav-panel${menuOpen ? ' is-open' : ''}`} hidden={!menuOpen}>
        <nav className="admin-mobile-topnav" aria-label="Розділи">
          {link('orders', 'Замовлення · клієнти')}
          {link('products', 'Товари')}
          {link('settings', 'Головна · контакти')}
        </nav>
        <div className="admin-mobile-header-foot">
          <AdminLogoutBtn onAfter={closeMenu} />
          <Link to="/" onClick={closeMenu} className="mono admin-mobile-site-link">На сайт</Link>
        </div>
      </div>
    </header>
  );
}

function AdminSidebar({ menuExpanded, onToggleMenu, onNavigate }) {
  const loc = useLocation();
  const link = (segment, label) => {
    const full = `/admin/${segment}`;
    const on = loc.pathname === full || loc.pathname.startsWith(`${full}/`);
    return (
      <Link to={full} onClick={() => onNavigate?.()} className={`mono admin-side-link${on ? ' is-active' : ''}`} style={{
        display: 'block', padding: '12px 16px', fontSize: 11, letterSpacing: '0.08em',
        color: on ? 'var(--accent)' : 'var(--ink-2)',
      }}>{label}</Link>
    );
  };
  return (
    <aside className={`admin-sidebar${menuExpanded ? '' : ' admin-sidebar--collapsed'}`} style={{ width: '100%', flexShrink: 0, borderRight: '1px solid var(--line)', background: 'var(--bg-2)', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <div
        className="admin-sidebar-header"
        style={{
          padding: '24px 20px', borderBottom: '1px solid var(--line)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10,
        }}
      >
        <div className="admin-sidebar-brand" style={{ minWidth: 0 }}>
          <span className="mono" style={{ color: 'var(--accent)' }}>НАШЕ ПИВО</span>
          <div style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontSize: 17, lineHeight: 1.2, marginTop: 6 }}>Панель адміністратора</div>
        </div>
        <button
          type="button"
          className="admin-sidebar-menu-toggle"
          aria-expanded={menuExpanded}
          aria-controls="admin-sidebar-nav"
          aria-label={menuExpanded ? 'Згорнути меню' : 'Розгорнути меню'}
          title={menuExpanded ? 'Згорнути меню' : 'Розгорнути меню'}
          onClick={onToggleMenu}
          style={{
            flexShrink: 0,
            width: 40,
            minWidth: 40,
            minHeight: 40,
            padding: 0,
            border: '1px solid var(--line)',
            background: 'var(--surface)',
            color: 'var(--accent)',
            fontSize: 22,
            lineHeight: 1,
            cursor: 'pointer',
            fontFamily: 'system-ui, "Segoe UI", Roboto, sans-serif',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >{menuExpanded ? '\u2039' : '\u203A'}</button>
      </div>
      <nav id="admin-sidebar-nav" style={{ padding: '16px 0', flex: 1 }}>
        {link('orders', 'Замовлення · клієнти')}
        {link('products', 'Товари')}
        {link('settings', 'Головна · контакти')}
      </nav>
      <div className="admin-sidebar-footer" style={{ padding: 16, borderTop: '1px solid var(--line)' }}>
        <AdminLogoutBtn />
        <Link to="/" onClick={() => onNavigate?.()} className="mono" style={{ display: 'block', textAlign: 'center', marginTop: 12, fontSize: 10, color: 'var(--ink-3)' }}>На сайт</Link>
      </div>
    </aside>
  );
}

function AdminShell() {
  const [menuExpanded, setMenuExpanded] = useState(() => {
    const mobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 900px)').matches;
    try {
      const raw = sessionStorage.getItem('np-admin-menu-expanded');
      if (raw === '1') return true;
      if (raw === '0' && mobile) return false;
    } catch (e) {}
    return mobile ? false : true;
  });
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.matchMedia('(max-width: 900px)').matches);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 900px)');
    const fn = () => setIsMobile(mq.matches);
    mq.addEventListener('change', fn);
    return () => mq.removeEventListener('change', fn);
  }, []);

  useEffect(() => {
    if (isMobile) return;
    setMenuExpanded(true);
    try {
      sessionStorage.setItem('np-admin-menu-expanded', '1');
    } catch (e) {}
  }, [isMobile]);

  const toggleMenu = () => {
    setMenuExpanded((v) => {
      const n = !v;
      try { sessionStorage.setItem('np-admin-menu-expanded', n ? '1' : '0'); } catch (e) {}
      return n;
    });
  };

  const drawerAttr = !isMobile ? (menuExpanded ? 'open' : 'closed') : 'off';

  return (
    <div className="admin-root" data-np-mobile-drawer={drawerAttr} style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
      {isMobile ? <AdminMobileHeader /> : null}
      {!isMobile ? <AdminSidebar menuExpanded={menuExpanded} onToggleMenu={toggleMenu} onNavigate={() => {}} /> : null}
      <main className="admin-main" style={{ flex: 1, minWidth: 0, padding: '32px 40px', overflow: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
}

const ORDER_STATUSES = [
  ['new', 'Нове'],
  ['processing', 'В обробці'],
  ['done', 'Виконано'],
  ['cancelled', 'Скасовано'],
];

function AdminOrderSklad({ o }) {
  const items = o.items || [];
  return (
    <>
      <p style={{ marginTop: 0 }}>
        <span className="mono" style={{ color: 'var(--ink-3)' }}>АДРЕСА</span>
        <br />
        {o.address || '—'}
      </p>
      <p><span className="mono" style={{ color: 'var(--ink-3)' }}>СКЛАД</span></p>
      {items.length ? (
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          {items.map((it, i) => (
            <li key={i}>{it.name} × {it.qty} — {it.line ?? it.price * it.qty} ₴</li>
          ))}
        </ul>
      ) : (
        <p className="mono" style={{ color: 'var(--ink-3)', fontSize: 10 }}>Немає позицій у збереженому замовленні</p>
      )}
    </>
  );
}

function AdminOrderDetailModal({ order, onClose }) {
  useEffect(() => {
    if (!order) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [order, onClose]);

  if (!order) return null;

  const stLabel = ORDER_STATUSES.find(([k]) => k === order.status)?.[1] || order.status;
  const delivery = order.delivery != null && Number(order.delivery) > 0 ? Number(order.delivery) : null;

  return (
    <div className="admin-product-edit-modal-root" role="dialog" aria-modal="true" aria-labelledby="admin-order-detail-modal-title">
      <button type="button" className="admin-product-edit-modal-backdrop" aria-label="Закрити" onClick={onClose} />
      <div className="admin-product-edit-modal-panel">
        <div className="admin-product-edit-modal-header">
          <div id="admin-order-detail-modal-title" style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontSize: 20, minWidth: 0 }}>
            Замовлення {order.id}
          </div>
          <button type="button" className="mono" onClick={onClose} style={{ padding: '10px 16px', border: '1px solid var(--line)', background: 'var(--surface)', color: 'var(--ink)', fontSize: 10, flexShrink: 0 }}>
            Закрити
          </button>
        </div>
        <div style={{ fontSize: 14, color: 'var(--ink-2)', display: 'grid', gap: 14 }}>
          <p style={{ margin: 0 }}>
            <span className="mono" style={{ color: 'var(--ink-3)', fontSize: 10 }}>ДАТА</span>
            <br />
            {new Date(order.createdAt).toLocaleString('uk-UA')}
          </p>
          <p style={{ margin: 0 }}>
            <span className="mono" style={{ color: 'var(--ink-3)', fontSize: 10 }}>ІМ’Я</span>
            <br />
            {order.name || '—'}
          </p>
          <p style={{ margin: 0 }}>
            <span className="mono" style={{ color: 'var(--ink-3)', fontSize: 10 }}>ТЕЛЕФОН</span>
            <br />
            {order.phone || '—'}
          </p>
          <p style={{ margin: 0 }}>
            <span className="mono" style={{ color: 'var(--ink-3)', fontSize: 10 }}>СУМА</span>
            <br />
            {order.total} ₴
            {delivery != null ? <span className="mono" style={{ display: 'block', marginTop: 6, fontSize: 10, color: 'var(--ink-3)' }}>Доставка {delivery} ₴</span> : null}
          </p>
          <p style={{ margin: 0 }}>
            <span className="mono" style={{ color: 'var(--ink-3)', fontSize: 10 }}>СТАТУС</span>
            <br />
            {stLabel}
          </p>
          {order.source ? (
            <p style={{ margin: 0 }}>
              <span className="mono" style={{ color: 'var(--ink-3)', fontSize: 10 }}>ДЖЕРЕЛО</span>
              <br />
              {order.source === 'manual' ? 'Вручну' : String(order.source)}
            </p>
          ) : null}
          <div style={{ borderTop: '1px solid var(--line)', paddingTop: 12 }}>
            <AdminOrderSklad o={order} />
          </div>
        </div>
      </div>
    </div>
  );
}

const inputMono = {
  width: '100%',
  padding: 12,
  background: 'var(--surface)',
  border: '1px solid var(--line)',
  color: 'var(--ink)',
  boxSizing: 'border-box',
};

function AdminManualOrderForm({ products, addOrder, onClose }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('Точка продажу');
  const [delivery, setDelivery] = useState('0');
  const [status, setStatus] = useState('done');
  const [lines, setLines] = useState([]);
  const [pickId, setPickId] = useState('');
  const [pickQty, setPickQty] = useState('1');
  const [err, setErr] = useState('');

  const sortedProducts = useMemo(
    () => [...products].sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), 'uk')),
    [products],
  );

  const subtotal = useMemo(
    () => lines.reduce((s, it) => s + Number(it.price) * Number(it.qty), 0),
    [lines],
  );
  const deliveryNum = Math.max(0, Number(delivery) || 0);
  const total = subtotal + deliveryNum;

  const addLine = () => {
    setErr('');
    const p = sortedProducts.find((x) => x.id === pickId);
    if (!p) {
      setErr('Оберіть товар');
      return;
    }
    const q = Math.max(1, Math.floor(Number(pickQty) || 1));
    const price = Number(p.price) || 0;
    setLines((prev) => {
      const i = prev.findIndex((x) => x.id === p.id);
      if (i === -1) return [...prev, { id: p.id, name: p.name, price, qty: q, line: price * q }];
      const next = [...prev];
      const nq = next[i].qty + q;
      next[i] = { ...next[i], qty: nq, line: price * nq };
      return next;
    });
    setPickQty('1');
  };

  const setQty = (id, qty) => {
    const q = Math.max(1, Math.floor(Number(qty) || 1));
    setLines((prev) => prev.map((it) => (it.id === id ? { ...it, qty: q, line: it.price * q } : it)));
  };

  const removeLine = (id) => setLines((prev) => prev.filter((it) => it.id !== id));

  const submit = (e) => {
    e.preventDefault();
    setErr('');
    if (!name.trim()) {
      setErr('Вкажіть ім’я');
      return;
    }
    if (!phone.trim()) {
      setErr('Вкажіть телефон');
      return;
    }
    if (!lines.length) {
      setErr('Додайте хоча б один товар');
      return;
    }
    addOrder({
      name: name.trim(),
      phone: phone.trim(),
      address: address.trim() || 'Точка продажу',
      total,
      delivery: deliveryNum,
      items: lines.map((i) => ({
        id: i.id,
        name: i.name,
        qty: i.qty,
        price: i.price,
        line: i.line ?? i.price * i.qty,
      })),
      status,
      source: 'manual',
    });
    onClose();
  };

  return (
    <form onSubmit={submit} style={{ marginBottom: 24, padding: 20, border: '1px solid var(--line)', background: 'var(--bg-2)' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <h3 style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', margin: 0, fontSize: 22 }}>Замовлення вручну</h3>
        <button type="button" className="mono" onClick={onClose} style={{ padding: '8px 14px', border: '1px solid var(--line)', background: 'transparent', color: 'var(--ink-3)', fontSize: 10 }}>
          Закрити
        </button>
      </div>
      <p className="mono" style={{ color: 'var(--ink-3)', fontSize: 10, marginTop: 0, marginBottom: 20 }}>
        Для клієнта в точці продажу — зберігається в загальній історії замовлень і клієнтів
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 16 }}>
        <div>
          <label className="mono" style={{ display: 'block', color: 'var(--ink-3)', marginBottom: 8, fontSize: 10 }}>ІМ’Я</label>
          <input value={name} onChange={(e) => setName(e.target.value)} style={inputMono} />
        </div>
        <div>
          <label className="mono" style={{ display: 'block', color: 'var(--ink-3)', marginBottom: 8, fontSize: 10 }}>ТЕЛЕФОН</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+380…" style={inputMono} />
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label className="mono" style={{ display: 'block', color: 'var(--ink-3)', marginBottom: 8, fontSize: 10 }}>АДРЕСА / ПРИМІТКА</label>
          <input value={address} onChange={(e) => setAddress(e.target.value)} style={inputMono} />
        </div>
        <div>
          <label className="mono" style={{ display: 'block', color: 'var(--ink-3)', marginBottom: 8, fontSize: 10 }}>ДОСТАВКА (₴)</label>
          <input type="number" min={0} step={1} value={delivery} onChange={(e) => setDelivery(e.target.value)} style={inputMono} />
        </div>
        <div>
          <label className="mono" style={{ display: 'block', color: 'var(--ink-3)', marginBottom: 8, fontSize: 10 }}>СТАТУС</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="mono" style={{ ...inputMono, fontSize: 11 }}>
            {ORDER_STATUSES.map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'end', marginBottom: 16 }}>
        <div style={{ flex: '1 1 220px' }}>
          <label className="mono" style={{ display: 'block', color: 'var(--ink-3)', marginBottom: 8, fontSize: 10 }}>ТОВАР</label>
          <select value={pickId} onChange={(e) => setPickId(e.target.value)} className="mono" style={{ ...inputMono, fontSize: 11 }}>
            <option value="">— оберіть —</option>
            {sortedProducts.map((p) => (
              <option key={p.id} value={p.id}>{p.name} — {p.price} ₴</option>
            ))}
          </select>
        </div>
        <div style={{ width: 100 }}>
          <label className="mono" style={{ display: 'block', color: 'var(--ink-3)', marginBottom: 8, fontSize: 10 }}>К-ТЬ</label>
          <input type="number" min={1} step={1} value={pickQty} onChange={(e) => setPickQty(e.target.value)} style={inputMono} />
        </div>
        <button type="button" className="mono" onClick={addLine} style={{ padding: '12px 18px', background: 'color-mix(in srgb, var(--accent) 22%, transparent)', border: '1px solid var(--line)', color: 'var(--accent)', fontSize: 10 }}>
          Додати
        </button>
      </div>
      {lines.length ? (
        <ul style={{ margin: '0 0 16px', padding: 0, listStyle: 'none', border: '1px solid var(--line)', background: 'var(--surface)' }}>
          {lines.map((it) => (
            <li key={it.id} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12, padding: '10px 12px', borderBottom: '1px solid var(--line)' }}>
              <span style={{ flex: '1 1 160px' }}>{it.name}</span>
              <span className="mono" style={{ color: 'var(--ink-3)', fontSize: 10 }}>{it.price} ₴</span>
              <input type="number" min={1} step={1} value={it.qty} onChange={(e) => setQty(it.id, e.target.value)} style={{ width: 72, padding: 8, background: 'var(--bg-2)', border: '1px solid var(--line)', color: 'var(--ink)' }} />
              <span style={{ minWidth: 72 }}>{it.line ?? it.price * it.qty} ₴</span>
              <button type="button" className="mono" onClick={() => removeLine(it.id)} style={{ color: 'var(--danger)', background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer', fontSize: 10 }}>
                Прибрати
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mono" style={{ color: 'var(--ink-3)', fontSize: 10, marginBottom: 16 }}>Список порожній — додайте товари з каталогу</p>
      )}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
        <div>
          <span className="mono" style={{ color: 'var(--ink-3)', fontSize: 10 }}>Разом</span>
          <div style={{ fontFamily: 'Fraunces, serif', fontSize: 26, marginTop: 4 }}>{total} ₴</div>
          <span className="mono" style={{ color: 'var(--ink-3)', fontSize: 10 }}>товари {subtotal} ₴ + доставка {deliveryNum} ₴</span>
        </div>
        <button type="submit" className="mono" style={{ padding: '14px 28px', background: 'var(--accent)', color: '#1a1200', border: 'none', letterSpacing: '0.08em', fontSize: 11 }}>
          Зберегти замовлення
        </button>
      </div>
      {err ? <p style={{ color: 'var(--danger)', marginTop: 16, marginBottom: 0 }}>{err}</p> : null}
    </form>
  );
}

function AdminOrders() {
  const { orders, setOrderStatus, getClients, setCustomerFlag, products, addOrder } = useNpData();
  const [q, setQ] = useState('');
  const [st, setSt] = useState('all');
  const [detailOrder, setDetailOrder] = useState(null);
  const [tab, setTab] = useState('orders');
  const [manualOpen, setManualOpen] = useState(false);

  const closeDetailModal = useCallback(() => setDetailOrder(null), []);

  const filtered = useMemo(() => {
    let list = orders;
    if (st !== 'all') list = list.filter((o) => o.status === st);
    if (q.trim()) {
      const n = q.trim().toLowerCase();
      list = list.filter((o) =>
        [o.name, o.phone, o.address, o.id].some((f) => String(f || '').toLowerCase().includes(n))
      );
    }
    return list;
  }, [orders, q, st]);

  const clients = useMemo(() => getClients(), [getClients, orders]);

  return (
    <div>
      <h2 style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontSize: 36, margin: '0 0 8px' }}>Замовлення</h2>
      <p className="mono" style={{ color: 'var(--ink-3)', marginBottom: 28, fontSize: 10 }}>КЛІЄНТИ ТА ІСТОРІЯ</p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {[
          ['orders', 'Замовлення'],
          ['clients', 'Клієнти'],
        ].map(([k, v]) => (
          <button key={k} type="button" className="mono" onClick={() => setTab(k)}
            style={{ padding: '10px 16px', border: '1px solid var(--line)', background: tab === k ? 'color-mix(in srgb, var(--accent) 18%, transparent)' : 'transparent', color: tab === k ? 'var(--accent)' : 'var(--ink-2)', fontSize: 10 }}>
            {v}
          </button>
        ))}
      </div>

      {tab === 'orders' ? (
        <>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 20, alignItems: 'end' }}>
            <div style={{ flex: '1 1 200px' }}>
              <label className="mono" style={{ display: 'block', color: 'var(--ink-3)', marginBottom: 8, fontSize: 10 }}>ПОШУК</label>
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ім’я, телефон, адреса, №"
                style={{ width: '100%', padding: 12, background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--ink)' }} />
            </div>
            <div>
              <label className="mono" style={{ display: 'block', color: 'var(--ink-3)', marginBottom: 8, fontSize: 10 }}>СТАТУС</label>
              <select value={st} onChange={(e) => setSt(e.target.value)} className="mono" style={{ padding: 12, background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--ink)', fontSize: 11 }}>
                <option value="all">Усі</option>
                {ORDER_STATUSES.map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div style={{ flex: '1 1 100%', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="mono"
                onClick={() => setManualOpen((v) => !v)}
                style={{
                  padding: '12px 18px',
                  border: '1px solid var(--line)',
                  background: manualOpen ? 'color-mix(in srgb, var(--accent) 18%, transparent)' : 'transparent',
                  color: manualOpen ? 'var(--accent)' : 'var(--ink-2)',
                  fontSize: 10,
                  letterSpacing: '0.06em',
                }}
              >
                {manualOpen ? 'Сховати форму' : '+ Замовлення вручну'}
              </button>
            </div>
          </div>

          {manualOpen ? (
            <AdminManualOrderForm
              products={products}
              addOrder={addOrder}
              onClose={() => setManualOpen(false)}
            />
          ) : null}

          <div className="admin-table-wrap" style={{ border: '1px solid var(--line)', overflow: 'auto' }}>
            <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ background: 'var(--bg-2)' }}>
                  {['Дата', 'Ім’я', 'Телефон', 'Сума', 'Статус', ''].map((h) => (
                    <th key={h} className="mono" style={{ textAlign: 'left', padding: 12, color: 'var(--ink-3)', fontSize: 10, borderBottom: '1px solid var(--line)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((o) => (
                  <tr key={o.id} className="admin-table-row" style={{ borderBottom: '1px solid var(--line)' }}>
                    <td data-label="Дата" style={{ padding: 12, color: 'var(--ink-2)' }}>{new Date(o.createdAt).toLocaleString('uk-UA')}</td>
                    <td data-label="Ім’я" style={{ padding: 12 }}>{o.name}</td>
                    <td data-label="Телефон" style={{ padding: 12 }}>{o.phone}</td>
                    <td data-label="Сума" style={{ padding: 12 }}>{o.total} ₴</td>
                    <td data-label="Статус" style={{ padding: 12 }}>
                      <select value={o.status} onChange={(e) => setOrderStatus(o.id, e.target.value)} className="mono" style={{ padding: 8, maxWidth: '100%', background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--ink)', fontSize: 10 }}>
                        {ORDER_STATUSES.map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                      </select>
                    </td>
                    <td data-label="Дії" style={{ padding: 12 }}>
                      <button type="button" className="mono" onClick={() => setDetailOrder(o)} style={{ color: 'var(--accent)', background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer', fontSize: 10 }}>
                        Деталі
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 ? <div className="mono" style={{ padding: 40, textAlign: 'center', color: 'var(--ink-3)' }}>Немає замовлень</div> : null}
          </div>
        </>
      ) : (
        <div style={{ display: 'grid', gap: 16 }}>
          {clients.map((c) => (
            <div key={c.phoneKey} style={{ border: '1px solid var(--line)', padding: 20, background: 'var(--bg-2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <div style={{ fontFamily: 'Fraunces, serif', fontSize: 22 }}>{c.name || '—'}</div>
                  <div className="mono" style={{ color: 'var(--ink-3)', marginTop: 6 }}>{c.phone}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="mono" style={{ color: 'var(--ink-3)', fontSize: 10 }}>УСЬОГО</div>
                  <div style={{ fontFamily: 'Fraunces, serif', fontSize: 26 }}>{c.totalSpent} ₴</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 16, marginTop: 16, flexWrap: 'wrap' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input type="checkbox" checked={!!c.meta.vip} onChange={(e) => setCustomerFlag(c.phone, 'vip', e.target.checked)} />
                  <span className="mono" style={{ fontSize: 10 }}>Постійний клієнт</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input type="checkbox" checked={!!c.meta.debtor} onChange={(e) => setCustomerFlag(c.phone, 'debtor', e.target.checked)} />
                  <span className="mono" style={{ fontSize: 10 }}>Боржник</span>
                </label>
              </div>
              <p className="mono" style={{ color: 'var(--ink-3)', marginTop: 16, fontSize: 10 }}>ІСТОРІЯ ({c.orders.length})</p>
              <ul style={{ margin: 0, paddingLeft: 18, color: 'var(--ink-2)', listStyle: 'disc' }}>
                {c.orders.map((o) => (
                  <li key={o.id} style={{ marginBottom: 10 }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10 }}>
                      <span>
                        {new Date(o.createdAt).toLocaleDateString('uk-UA')} — {o.total} ₴ — {ORDER_STATUSES.find(([k]) => k === o.status)?.[1]}
                      </span>
                      <button
                        type="button"
                        className="mono"
                        onClick={() => setDetailOrder(o)}
                        style={{
                          color: 'var(--accent)',
                          background: 'none',
                          border: 'none',
                          textDecoration: 'underline',
                          cursor: 'pointer',
                          fontSize: 10,
                          padding: 0,
                        }}
                      >
                        Деталі
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {clients.length === 0 ? <div className="mono" style={{ color: 'var(--ink-3)' }}>Ще немає клієнтів (замовлення з’являться тут)</div> : null}
        </div>
      )}

      {detailOrder ? (
        <AdminOrderDetailModal
          order={orders.find((x) => x.id === detailOrder.id) || detailOrder}
          onClose={closeDetailModal}
        />
      ) : null}
    </div>
  );
}

function compressImageFileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      reject(new Error('type'));
      return;
    }
    const fr = new FileReader();
    fr.onload = () => {
      const img = new Image();
      img.onload = () => {
        try {
          let w = img.naturalWidth || img.width;
          let h = img.naturalHeight || img.height;
          const maxW = 1000;
          const maxH = 1000;
          if (w > maxW || h > maxH) {
            const r = Math.min(maxW / w, maxH / h);
            w = Math.round(w * r);
            h = Math.round(h * r);
          }
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('ctx'));
            return;
          }
          ctx.drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL('image/jpeg', 0.86));
        } catch (e) {
          reject(e);
        }
      };
      img.onerror = () => reject(new Error('img'));
      img.src = fr.result;
    };
    fr.onerror = () => reject(fr.error || new Error('read'));
    fr.readAsDataURL(file);
  });
}

function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  const l = (max + min) / 2;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      default: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return [h, s, l];
}

/** Домінантний теплий акцент з фото (усереднення насичених пікселів). */
function accentHexFromImageDataUrl(dataUrl) {
  return new Promise((resolve) => {
    const fallback = '#D89B3C';
    const img = new Image();
    img.onload = () => {
      try {
        const w = 56;
        const h = 56;
        const c = document.createElement('canvas');
        c.width = w;
        c.height = h;
        const ctx = c.getContext('2d');
        if (!ctx) {
          resolve(fallback);
          return;
        }
        ctx.drawImage(img, 0, 0, w, h);
        const { data } = ctx.getImageData(0, 0, w, h);
        let sr = 0;
        let sg = 0;
        let sb = 0;
        let n = 0;
        for (let i = 0; i < data.length; i += 4) {
          if (data[i + 3] < 40) continue;
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const [, s, l] = rgbToHsl(r, g, b);
          if (l < 0.1 || l > 0.92 || s < 0.12) continue;
          sr += r;
          sg += g;
          sb += b;
          n += 1;
        }
        if (n < 6) {
          resolve(fallback);
          return;
        }
        const rr = Math.round(sr / n);
        const gg = Math.round(sg / n);
        const bb = Math.round(sb / n);
        resolve(`#${[rr, gg, bb].map((x) => x.toString(16).padStart(2, '0')).join('')}`);
      } catch (e) {
        resolve(fallback);
      }
    };
    img.onerror = () => resolve(fallback);
    img.src = dataUrl;
  });
}

const UKR_SLUG_MAP = {
  а: 'a', б: 'b', в: 'v', г: 'h', ґ: 'g', д: 'd', е: 'e', є: 'ye', ж: 'zh', з: 'z', и: 'y', і: 'i', ї: 'yi', й: 'j', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'kh', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'shch', ь: '', ю: 'yu', я: 'ya', ' ': '-', '’': '', "'": '', 'ʼ': '',
};

function slugifyCategoryName(raw) {
  const s = String(raw || '').trim().toLowerCase();
  let out = '';
  for (const ch of s) {
    if (UKR_SLUG_MAP[ch] !== undefined) out += UKR_SLUG_MAP[ch];
    else if (/[a-z0-9]/.test(ch)) out += ch;
    else if (ch === '-' || ch === '_') out += '-';
  }
  return out.replace(/-+/g, '-').replace(/^-|-$/g, '');
}

function buildPreviewProduct(draft, categories) {
  const catSlug = draft.cat || 'beer';
  const catRow = categories.find((c) => c.slug === catSlug);
  return {
    id: draft.id || 'preview',
    cat: catSlug,
    style: draft.style || 'IPA',
    name: draft.name || 'Назва товару',
    abv: draft.abv != null && draft.abv !== '' ? Number(draft.abv) : null,
    ibu: draft.ibu != null && draft.ibu !== '' ? Number(draft.ibu) : 35,
    price: Number(draft.price) || 0,
    vol: draft.vol || '0.5 л',
    color: draft.color || '#D89B3C',
    tagline: draft.tagline || 'Короткий опис…',
    notes: draft.notes || 'Смакові ноти',
    pair: draft.pair || 'З чим подати',
    origin: draft.origin || 'Нікополь · Наше Пиво',
    image: draft.image || undefined,
  };
}

function AdminProductEditor({ draft, setDraft, categories, products, preview, cardStyle, onSave, onDelete }) {
  if (!draft) return null;
  return (
    <>
      <div style={{ border: '1px solid var(--line)', padding: 20, marginBottom: 20, background: 'var(--bg-2)' }}>
        <div className="mono" style={{ color: 'var(--ink-3)', marginBottom: 12, fontSize: 10 }}>РЕДАГУВАННЯ</div>
        {[
          ['name', 'Назва'],
          ['price', 'Ціна (₴)', 'number'],
          ['style', 'Стиль / тип'],
          ['tagline', 'Короткий опис'],
          ['notes', 'Смак / опис'],
          ['pair', 'Поєднання'],
          ['origin', 'Походження'],
          ['vol', "Об'єм"],
          ['color', 'Колір (hex) · авто з фото'],
        ].map(([key, label, type]) => (
          <div key={key} style={{ marginBottom: 12 }}>
            <label className="mono" style={{ display: 'block', color: 'var(--ink-3)', marginBottom: 6, fontSize: 9 }}>{label}</label>
            {key === 'notes' ? (
              <textarea value={draft[key] || ''} onChange={(e) => setDraft({ ...draft, [key]: e.target.value })} rows={3}
                style={{ width: '100%', padding: 10, background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--ink)', fontFamily: 'inherit' }} />
            ) : (
              <input type={type || 'text'} value={draft[key] ?? ''} onChange={(e) => setDraft({ ...draft, [key]: key === 'price' || key === 'abv' || key === 'ibu' ? (e.target.value === '' ? '' : e.target.value) : e.target.value })}
                style={{ width: '100%', padding: 10, background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--ink)' }} />
            )}
          </div>
        ))}
        <div style={{ marginBottom: 12 }}>
          <label className="mono" style={{ display: 'block', color: 'var(--ink-3)', marginBottom: 6, fontSize: 9 }}>ФОТО</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
            <label className="mono" style={{
              display: 'inline-block', padding: '12px 16px', background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--accent)', cursor: 'pointer', fontSize: 10, letterSpacing: '0.06em',
            }}>
              Загрузить фото
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => {
                const f = e.target.files && e.target.files[0];
                e.target.value = '';
                if (!f) return;
                compressImageFileToDataUrl(f).then((url) => accentHexFromImageDataUrl(url).then((hex) => ({ url, hex }))).then(({ url, hex }) => {
                  setDraft((d) => (d ? { ...d, image: url, color: hex } : d));
                }).catch(() => {
                  window.alert('Не вдалося обробити файл. Спробуйте JPG або PNG.');
                });
              }} />
            </label>
            {draft.image ? (
              <>
                <button type="button" className="mono" onClick={() => setDraft({ ...draft, image: '' })}
                  style={{ padding: '10px 14px', border: '1px solid var(--line)', background: 'transparent', color: 'var(--ink-2)', fontSize: 10 }}>
                  Прибрати фото
                </button>
                <img src={draft.image} alt="" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 10, border: '1px solid var(--line)' }} />
              </>
            ) : null}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label className="mono" style={{ display: 'block', color: 'var(--ink-3)', marginBottom: 6, fontSize: 9 }}>ABV</label>
            <input type="number" step="0.1" value={draft.abv ?? ''} onChange={(e) => setDraft({ ...draft, abv: e.target.value === '' ? null : Number(e.target.value) })}
              style={{ width: '100%', padding: 10, background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--ink)' }} />
          </div>
          <div>
            <label className="mono" style={{ display: 'block', color: 'var(--ink-3)', marginBottom: 6, fontSize: 9 }}>IBU</label>
            <input type="number" value={draft.ibu ?? ''} onChange={(e) => setDraft({ ...draft, ibu: e.target.value === '' ? '' : Number(e.target.value) })}
              style={{ width: '100%', padding: 10, background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--ink)' }} />
          </div>
        </div>
        <div style={{ marginTop: 12 }}>
          <label className="mono" style={{ display: 'block', color: 'var(--ink-3)', marginBottom: 6, fontSize: 9 }}>КАТЕГОРІЯ (slug)</label>
          <select value={draft.cat} onChange={(e) => setDraft({ ...draft, cat: e.target.value })} style={{ width: '100%', padding: 10, background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--ink)' }}>
            {categories.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
          </select>
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
          <button type="button" className="mono" onClick={onSave} style={{ flex: 1, padding: 14, background: 'var(--accent)', color: '#1a1200', border: 'none', fontSize: 10 }}>Зберегти</button>
          <button type="button" className="mono" disabled={!products.some((p) => p.id === draft.id)}
            onClick={onDelete}
            style={{ padding: 14, border: '1px solid var(--danger)', color: 'var(--danger)', background: 'transparent', fontSize: 10, opacity: products.some((p) => p.id === draft.id) ? 1 : 0.4 }}>Видалити</button>
        </div>
      </div>

      <div className="mono" style={{ color: 'var(--ink-3)', marginBottom: 10, fontSize: 10 }}>LIVE PREVIEW (ProductCard)</div>
      <div style={{ maxWidth: 340, margin: '0 auto' }}>
        <ProductCard
          product={preview}
          onOpen={() => {}}
          onAdd={() => {}}
          style={cardStyle}
          density="comfortable"
          mobileCardMode="solo"
        />
      </div>
    </>
  );
}

function AdminContent() {
  const {
    products,
    setProducts,
    upsertProduct,
    deleteProductId,
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    assignProductCategory,
  } = useNpData();
  const [selId, setSelId] = useState(null);
  const [draft, setDraft] = useState(null);
  const [newCatName, setNewCatName] = useState('');
  const [catEdit, setCatEdit] = useState(null);
  const catalogScrollRef = useRef(null);

  const submitNewCategory = (e) => {
    e.preventDefault();
    const name = newCatName.trim();
    if (!name) return;
    let base = slugifyCategoryName(name).toLowerCase().replace(/[^a-z0-9-]/g, '') || `cat-${Date.now()}`;
    let slug = base;
    let n = 0;
    while (categories.some((c) => c.slug === slug)) {
      n += 1;
      slug = `${base}-${n}`;
    }
    addCategory({ name, slug, parentId: null });
    setNewCatName('');
  };

  const saveCategoryEdit = () => {
    if (!catEdit) return;
    const name = catEdit.name.trim();
    let slug = catEdit.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
    if (!name) return;
    if (!slug) slug = slugifyCategoryName(name);
    const row = categories.find((x) => x.id === catEdit.id);
    if (!row) return;
    const oldSlug = row.slug;
    if (slug !== oldSlug && categories.some((x) => x.slug === slug && x.id !== row.id)) {
      window.alert('Такий slug уже використовується. Оберіть інший.');
      return;
    }
    updateCategory(row.id, { name, slug });
    if (slug !== oldSlug) {
      setProducts((prev) => prev.map((p) => (p.cat === oldSlug ? { ...p, cat: slug } : p)));
    }
    setCatEdit(null);
  };

  useEffect(() => {
    if (!selId) {
      setDraft(null);
      return;
    }
    const p = products.find((x) => x.id === selId);
    if (p) setDraft({ ...p, image: p.image || '' });
  }, [selId, products]);

  useEffect(() => {
    if (!selId || !catalogScrollRef.current) return;
    const row = catalogScrollRef.current.querySelector(`[data-admin-product-id="${selId}"]`);
    row?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [selId]);

  useEffect(() => {
    if (!draft) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [draft]);

  useEffect(() => {
    if (!draft) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setSelId(null);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [draft]);

  const preview = useMemo(() => (draft ? buildPreviewProduct(draft, categories) : null), [draft, categories]);

  const startNew = () => {
    const id = `p${Date.now()}`;
    setSelId(id);
    setDraft({
      id,
      cat: 'beer',
      style: 'IPA',
      name: '',
      abv: 5,
      ibu: 35,
      price: 120,
      vol: '0.5 л',
      color: '#D89B3C',
      tagline: '',
      notes: '',
      pair: '',
      origin: 'Нікополь · Наше Пиво',
      image: '',
    });
  };

  const save = () => {
    if (!draft || !draft.name.trim()) return;
    upsertProduct({ ...draft, image: draft.image || undefined });
    setSelId(draft.id);
  };

  const cardStyle = 'flip';

  return (
    <div>
      <h2 style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontSize: 36, margin: '0 0 8px' }}>Товари</h2>
      <p className="mono" style={{ color: 'var(--ink-3)', marginBottom: 24, fontSize: 10 }}>Категорії та каталог — на всю ширину. Редагування товару відкривається у вікні після кліку по рядку або «Новий товар».</p>

      <div className="admin-products-page">
        <div className="admin-products-categories">
          <h3 style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontSize: 22, margin: '0 0 6px' }}>Категорії</h3>
          <p className="mono" style={{ color: 'var(--ink-3)', marginBottom: 14, fontSize: 10 }}>Достатньо назви: технічний slug згенерується з неї (латиницею). Завжди коренева категорія.</p>

          <form onSubmit={submitNewCategory} style={{ border: '1px solid var(--line)', padding: 16, marginBottom: 16, background: 'var(--bg-2)' }}>
            <div className="mono" style={{ color: 'var(--ink-3)', marginBottom: 10, fontSize: 10 }}>НОВА КАТЕГОРІЯ</div>
            <div style={{ display: 'grid', gap: 10, gridTemplateColumns: '1fr auto', alignItems: 'stretch' }}>
              <input value={newCatName} onChange={(e) => setNewCatName(e.target.value)} placeholder="Назва категорії" style={{ padding: 12, background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--ink)' }} />
              <button type="submit" className="mono" style={{ padding: '12px 18px', background: 'var(--accent)', color: '#1a1200', border: 'none', fontSize: 10, whiteSpace: 'nowrap' }}>Додати</button>
            </div>
          </form>

          <div style={{ display: 'grid', gap: 10, marginBottom: 0 }}>
            {categories.map((c) => (
              <div key={c.id} style={{ border: '1px solid var(--line)', padding: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                {catEdit && catEdit.id === c.id ? (
                  <>
                    <div style={{ flex: '1 1 220px', minWidth: 0, display: 'grid', gap: 10 }}>
                      <div>
                        <label className="mono" style={{ display: 'block', color: 'var(--ink-3)', marginBottom: 6, fontSize: 9 }}>НАЗВА</label>
                        <input value={catEdit.name} onChange={(e) => setCatEdit({ ...catEdit, name: e.target.value })} style={{ width: '100%', padding: 10, background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--ink)' }} />
                      </div>
                      <div>
                        <label className="mono" style={{ display: 'block', color: 'var(--ink-3)', marginBottom: 6, fontSize: 9 }}>SLUG (латиницею)</label>
                        <input value={catEdit.slug} onChange={(e) => setCatEdit({ ...catEdit, slug: e.target.value })} className="mono" style={{ width: '100%', padding: 10, background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--ink)', fontSize: 12 }} />
                      </div>
                      <p className="mono" style={{ margin: 0, color: 'var(--ink-3)', fontSize: 9 }}>Якщо зміните slug — усі товари з цією категорією оновляться автоматично.</p>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
                      <button type="button" className="mono" onClick={saveCategoryEdit} style={{ padding: '10px 16px', background: 'var(--accent)', color: '#1a1200', border: 'none', fontSize: 10 }}>Зберегти</button>
                      <button type="button" className="mono" onClick={() => setCatEdit(null)} style={{ padding: '10px 16px', border: '1px solid var(--line)', background: 'transparent', color: 'var(--ink-2)', fontSize: 10 }}>Скасувати</button>
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ flex: '1 1 200px', minWidth: 0 }}>
                      <span className="mono" style={{ color: 'var(--ink-3)', fontSize: 9 }}>{c.slug}</span>
                      <div style={{ fontFamily: 'Fraunces, serif', fontSize: 18 }}>{c.name}</div>
                      {c.parentId ? <div className="mono" style={{ fontSize: 9, color: 'var(--ink-3)' }}>батько: {categories.find((x) => x.id === c.parentId)?.name || c.parentId}</div> : null}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      <button type="button" className="mono" onClick={() => setCatEdit({ id: c.id, name: c.name, slug: c.slug })} style={{ border: '1px solid var(--line)', background: 'transparent', color: 'var(--accent)', padding: '8px 12px', fontSize: 10 }}>Редагувати</button>
                      <button type="button" className="mono" onClick={() => { setCatEdit(null); deleteCategory(c.id); }} style={{ border: '1px solid var(--line)', background: 'transparent', color: 'var(--danger)', padding: '8px 12px', fontSize: 10 }}>Видалити</button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="admin-content-grid admin-products-layout" style={{ display: 'block', width: '100%' }}>
        <div ref={catalogScrollRef} className="admin-content-main-col" style={{ width: '100%', maxWidth: '100%' }}>
          <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            <button type="button" className="mono" onClick={startNew} style={{ padding: '12px 16px', background: 'var(--accent)', color: '#1a1200', border: 'none', fontSize: 10 }}>+ Новий товар</button>
          </div>
          <h3 style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontSize: 22, margin: '0 0 10px' }}>Каталог</h3>
          <p className="mono admin-catalog-hint" style={{ color: 'var(--ink-3)', marginBottom: 12, fontSize: 10 }}>Клік по рядку відкриває вікно редагування та перегляду картки.</p>
          <div style={{ border: '1px solid var(--line)' }}>
            {products.map((p, i) => {
              const catName = categories.find((c) => c.slug === p.cat)?.name || p.cat || '—';
              const catSelectCh = Math.min(Math.max(catName.length + 5, 10), 32);
              return (
              <div
                key={p.id}
                data-admin-product-id={p.id}
                className="admin-catalog-row"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '48px minmax(0, 1fr) auto',
                  gap: 12,
                  alignItems: 'center',
                  padding: '14px 14px 14px 12px',
                  borderBottom: '1px solid var(--line)',
                  background: selId === p.id ? 'color-mix(in srgb, var(--accent) 12%, transparent)' : 'var(--bg)',
                }}
              >
                <button
                  type="button"
                  className="admin-catalog-hit"
                  onClick={() => setSelId(p.id)}
                  aria-label={`Редагувати: ${p.name}`}
                  style={{
                    gridColumn: '1 / 3',
                    display: 'grid',
                    gridTemplateColumns: '48px minmax(0, 1fr)',
                    gap: 12,
                    alignItems: 'center',
                    width: '100%',
                    minWidth: 0,
                    padding: 0,
                    margin: 0,
                    border: 'none',
                    background: 'transparent',
                    color: 'inherit',
                    cursor: 'pointer',
                    textAlign: 'left',
                    font: 'inherit',
                  }}
                >
                  <span aria-hidden style={{
                    fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontSize: 26, lineHeight: 1,
                    color: 'color-mix(in srgb, var(--accent) 55%, var(--ink-3))', textAlign: 'right', userSelect: 'none',
                  }}>{i + 1}</span>
                  <div style={{ minWidth: 0 }}>
                    <span className="mono" style={{ color: 'var(--ink-3)', fontSize: 9 }}>{p.style}</span>
                    <div style={{ fontFamily: 'Fraunces, serif', fontSize: 18 }}>{p.name}</div>
                    <div className="mono" style={{ color: 'var(--accent)', marginTop: 4, fontSize: 10 }}>{p.price} ₴</div>
                  </div>
                </button>
                <div
                  className="admin-catalog-cat"
                  style={{ gridColumn: 3, justifySelf: 'start', maxWidth: '100%' }}
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <label className="mono" style={{ display: 'block', color: 'var(--ink-3)', marginBottom: 4, fontSize: 8 }}>КАТЕГОРІЯ</label>
                  <select
                    value={p.cat}
                    onChange={(e) => assignProductCategory(p.id, e.target.value)}
                    className="admin-catalog-cat-select"
                    style={{
                      width: `${catSelectCh}ch`,
                      maxWidth: '100%',
                      boxSizing: 'border-box',
                      padding: '8px 10px',
                      background: 'var(--surface)',
                      border: '1px solid var(--line)',
                      color: 'var(--ink)',
                      fontSize: 12,
                    }}
                  >
                    {categories.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </div>

      {draft ? (
        <div className="admin-product-edit-modal-root" role="dialog" aria-modal="true" aria-labelledby="admin-product-edit-modal-title">
          <button
            type="button"
            className="admin-product-edit-modal-backdrop"
            aria-label="Закрити"
            onClick={() => setSelId(null)}
          />
          <div className="admin-product-edit-modal-panel">
            <div className="admin-product-edit-modal-header">
              <div id="admin-product-edit-modal-title" style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontSize: 20, minWidth: 0 }}>
                {draft.name?.trim() ? draft.name : 'Новий товар'}
              </div>
              <button type="button" className="mono" onClick={() => setSelId(null)} style={{ padding: '10px 16px', border: '1px solid var(--line)', background: 'var(--surface)', color: 'var(--ink)', fontSize: 10, flexShrink: 0 }}>
                Закрити
              </button>
            </div>
            <AdminProductEditor
              draft={draft}
              setDraft={setDraft}
              categories={categories}
              products={products}
              preview={preview}
              cardStyle={cardStyle}
              onSave={save}
              onDelete={() => {
                if (draft && products.some((p) => p.id === draft.id)) {
                  deleteProductId(draft.id);
                  setSelId(null);
                  setDraft(null);
                }
              }}
            />
          </div>
        </div>
      ) : null}
      </div>
    </div>
  );
}

function reorderSocials(list, fromIndex, toIndex) {
  if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0 || fromIndex >= list.length || toIndex >= list.length) return list;
  const next = [...list];
  const [it] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, it);
  return next;
}

const HERO_TILE_HINTS = [
  'Висока плитка зліва',
  'Верх, центр',
  'Верх, справа',
  'Низ, центр',
  'Низ, справа',
];

function AdminSettings() {
  const { settings, setSettings, products } = useNpData();
  const patch = (k, v) => setSettings((s) => ({ ...s, [k]: v }));

  const heroSlots = useMemo(() => {
    const a = Array.isArray(settings.heroFeaturedProductIds) ? [...settings.heroFeaturedProductIds] : [];
    while (a.length < 5) a.push('');
    return a.slice(0, 5);
  }, [settings.heroFeaturedProductIds]);

  const setHeroSlot = (index, productId) => {
    const next = [...heroSlots];
    next[index] = productId || '';
    patch('heroFeaturedProductIds', next);
  };

  const swapHeroSlots = (i, j) => {
    if (i < 0 || j < 0 || i > 4 || j > 4) return;
    const next = [...heroSlots];
    const t = next[i];
    next[i] = next[j];
    next[j] = t;
    patch('heroFeaturedProductIds', next);
  };

  const patchHeroStat = (idx, field, value) => {
    const raw = Array.isArray(settings.heroStats) ? [...settings.heroStats] : [];
    while (raw.length < 3) raw.push({ value: '', label: '' });
    const prev = raw[idx] && typeof raw[idx] === 'object' ? raw[idx] : {};
    raw[idx] = { ...prev, [field]: value };
    patch('heroStats', raw);
  };

  const statVal = (idx, field, fallback) => {
    const raw = settings.heroStats;
    if (!Array.isArray(raw) || !raw[idx]) return fallback;
    const v = raw[idx][field];
    return typeof v === 'string' ? v : fallback;
  };

  return (
    <div>
      <h2 style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontSize: 36, margin: '0 0 8px' }}>Головна сторінка</h2>
      <p className="mono" style={{ color: 'var(--ink-3)', marginBottom: 24, fontSize: 10 }}>Текст банера, цифри внизу та п’ять товарів для колажу (порядок = позиції на сітці).</p>

      <div className="admin-settings-card" style={{ maxWidth: 720, border: '1px solid var(--line)', padding: 24, background: 'var(--bg-2)', display: 'grid', gap: 16 }}>
        {[
          ['heroKicker', 'Рядок над заголовком (mono)'],
          ['heroTitleLine1', 'Заголовок — рядок 1 (до акценту)'],
          ['heroTitleAccent', 'Заголовок — акцентне слово (курсив, колір акценту)'],
          ['heroTitleLine3', 'Заголовок — рядок після акценту'],
        ].map(([k, lab]) => (
          <div key={k}>
            <label className="mono" style={{ display: 'block', color: 'var(--ink-3)', marginBottom: 6, fontSize: 9 }}>{lab}</label>
            <input value={settings[k] || ''} onChange={(e) => patch(k, e.target.value)} style={{ width: '100%', padding: 12, background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--ink)' }} />
          </div>
        ))}
        <div>
          <label className="mono" style={{ display: 'block', color: 'var(--ink-3)', marginBottom: 6, fontSize: 9 }}>Абзац під заголовком</label>
          <textarea value={settings.heroLead || ''} onChange={(e) => patch('heroLead', e.target.value)} rows={3}
            style={{ width: '100%', padding: 12, background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--ink)', fontFamily: 'inherit' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label className="mono" style={{ display: 'block', color: 'var(--ink-3)', marginBottom: 6, fontSize: 9 }}>Кнопка (основна)</label>
            <input value={settings.heroCtaPrimary || ''} onChange={(e) => patch('heroCtaPrimary', e.target.value)} style={{ width: '100%', padding: 12, background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--ink)' }} />
          </div>
          <div>
            <label className="mono" style={{ display: 'block', color: 'var(--ink-3)', marginBottom: 6, fontSize: 9 }}>Посилання «про нас»</label>
            <input value={settings.heroCtaSecondary || ''} onChange={(e) => patch('heroCtaSecondary', e.target.value)} style={{ width: '100%', padding: 12, background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--ink)' }} />
          </div>
        </div>

        <div className="mono" style={{ color: 'var(--ink-3)', marginTop: 8, fontSize: 10 }}>ТРИ ЦИФРИ ВНИЗУ БАНЕРА</div>
        {[0, 1, 2].map((i) => (
          <div key={`hstat-${i}`} style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: 10, alignItems: 'end' }}>
            <div>
              <label className="mono" style={{ display: 'block', color: 'var(--ink-3)', marginBottom: 6, fontSize: 9 }}>Число</label>
              <input
                value={statVal(i, 'value', ['50', '11', '7'][i])}
                onChange={(e) => patchHeroStat(i, 'value', e.target.value)}
                style={{ width: '100%', padding: 12, background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--ink)' }}
              />
            </div>
            <div>
              <label className="mono" style={{ display: 'block', color: 'var(--ink-3)', marginBottom: 6, fontSize: 9 }}>Підпис</label>
              <input
                value={statVal(i, 'label', ['позицій у каталозі', 'років у справі', 'днів на тиждень'][i])}
                onChange={(e) => patchHeroStat(i, 'label', e.target.value)}
                style={{ width: '100%', padding: 12, background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--ink)' }}
              />
            </div>
          </div>
        ))}

        <div className="mono" style={{ color: 'var(--ink-3)', marginTop: 12, fontSize: 10 }}>КОЛАЖ ЗПРАВА (5 ПЛИТОК)</div>
        <p className="mono" style={{ color: 'var(--ink-3)', fontSize: 9, margin: '-8px 0 0' }}>Порожній варіант у списку — автоматично підставить наступний товар з каталогу. Кнопки «вгору/вниз» міняють плитки місцями.</p>
        {heroSlots.map((slotId, idx) => (
          <div key={`hero-tile-${idx}`} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 10, alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <button type="button" className="mono" disabled={idx === 0} onClick={() => swapHeroSlots(idx, idx - 1)} title="Вище"
                style={{ padding: '6px 10px', border: '1px solid var(--line)', background: 'var(--surface)', color: 'var(--ink)', fontSize: 10, cursor: idx === 0 ? 'default' : 'pointer', opacity: idx === 0 ? 0.35 : 1 }}>↑</button>
              <button type="button" className="mono" disabled={idx === 4} onClick={() => swapHeroSlots(idx, idx + 1)} title="Нижче"
                style={{ padding: '6px 10px', border: '1px solid var(--line)', background: 'var(--surface)', color: 'var(--ink)', fontSize: 10, cursor: idx === 4 ? 'default' : 'pointer', opacity: idx === 4 ? 0.35 : 1 }}>↓</button>
            </div>
            <div>
              <label className="mono" style={{ display: 'block', color: 'var(--ink-3)', marginBottom: 6, fontSize: 9 }}>{HERO_TILE_HINTS[idx]}</label>
              <select
                value={slotId || ''}
                onChange={(e) => setHeroSlot(idx, e.target.value)}
                style={{ width: '100%', padding: 12, background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--ink)' }}
              >
                <option value="">Авто з каталогу</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>{p.name || p.id} · {p.style || p.cat || '—'}</option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>

      <h2 style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontSize: 36, margin: '48px 0 8px' }}>Контакти</h2>
      <p className="mono" style={{ color: 'var(--ink-3)', marginBottom: 24, fontSize: 10 }}>ТЕЛЕФОН · EMAIL · АДРЕСА · СОЦМЕРЕЖІ</p>

      <div className="admin-settings-card" style={{ maxWidth: 560, border: '1px solid var(--line)', padding: 24, background: 'var(--bg-2)', display: 'grid', gap: 16 }}>
        {[
          ['addressLine', 'Адреса (рядок 1)'],
          ['cityLine', 'Місто / область (рядок 2)'],
          ['phoneDisplay', 'Телефон (як показувати)'],
          ['phoneTel', 'Телефон (tel: без пробілів)'],
          ['email', 'Email'],
        ].map(([k, lab]) => (
          <div key={k}>
            <label className="mono" style={{ display: 'block', color: 'var(--ink-3)', marginBottom: 6, fontSize: 9 }}>{lab}</label>
            <input value={settings[k] || ''} onChange={(e) => patch(k, e.target.value)} style={{ width: '100%', padding: 12, background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--ink)' }} />
          </div>
        ))}

        <div className="mono" style={{ color: 'var(--ink-3)', marginTop: 8, fontSize: 10 }}>СОЦМЕРЕЖІ</div>
        <p className="mono" style={{ color: 'var(--ink-3)', fontSize: 9, margin: '-8px 0 4px' }}>Тягніть ⋮⋮ за рядком, щоб змінити порядок</p>
        {(settings.socials || []).map((s, i) => (
          <div
            key={s.id || `soc_row_${i}`}
            onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; }}
            onDrop={(e) => {
              e.preventDefault();
              const raw = e.dataTransfer.getData('application/x-np-social') || e.dataTransfer.getData('text/plain');
              const from = parseInt(raw, 10);
              if (Number.isNaN(from)) return;
              const list = settings.socials || [];
              patch('socials', reorderSocials(list, from, i));
            }}
            className="admin-social-row"
            style={{
              display: 'grid',
              gridTemplateColumns: '28px 1fr 2fr 44px',
              gap: 8,
              alignItems: 'stretch',
              padding: '4px 0',
              borderBottom: '1px solid color-mix(in srgb, var(--line) 50%, transparent)',
            }}
          >
            <span
              role="button"
              tabIndex={0}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('application/x-np-social', String(i));
                e.dataTransfer.setData('text/plain', String(i));
                e.dataTransfer.effectAllowed = 'move';
              }}
              title="Перетягнути"
              className="mono"
              style={{
                cursor: 'grab',
                userSelect: 'none',
                color: 'var(--ink-3)',
                fontSize: 14,
                lineHeight: 1,
                textAlign: 'center',
                padding: '6px 0',
                alignSelf: 'center',
              }}
            >⋮⋮</span>
            <input value={s.label} onChange={(e) => {
              const socials = [...(settings.socials || [])];
              socials[i] = { ...socials[i], label: e.target.value };
              patch('socials', socials);
            }} placeholder="Назва" style={{
              padding: '12px 10px', minHeight: 44, boxSizing: 'border-box', width: '100%',
              background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--ink)',
            }} />
            <input value={s.url} onChange={(e) => {
              const socials = [...(settings.socials || [])];
              socials[i] = { ...socials[i], url: e.target.value };
              patch('socials', socials);
            }} placeholder="https://…" style={{
              padding: '12px 10px', minHeight: 44, boxSizing: 'border-box', width: '100%',
              background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--ink)',
            }} />
            <button
              type="button"
              className="mono"
              title="Видалити"
              onClick={() => patch('socials', (settings.socials || []).filter((_, j) => j !== i))}
              style={{
                minHeight: 44,
                boxSizing: 'border-box',
                padding: 0,
                border: '1px solid var(--line)',
                background: 'var(--surface)',
                color: 'var(--danger)',
                fontSize: 20,
                lineHeight: 1,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
              }}
            >×</button>
          </div>
        ))}
        <button type="button" className="mono" onClick={() => patch('socials', [...(settings.socials || []), { id: `soc_${Date.now()}`, label: '', url: '' }])}
          style={{ padding: 12, border: '1px solid var(--line)', background: 'transparent', color: 'var(--accent)', fontSize: 10 }}>+ Додати соцмережу</button>
      </div>
    </div>
  );
}

function AdminIndexJump() {
  return <Navigate to={isAdminSession() ? 'orders' : 'login'} replace />;
}

function AdminRoutes() {
  return (
    <Routes>
      <Route index element={<AdminIndexJump />} />
      <Route path="login" element={<AdminLogin />} />
      <Route element={<RequireAuth />}>
        <Route element={<AdminShell />}>
          <Route path="orders" element={<AdminOrders />} />
          <Route path="products" element={<AdminContent />} />
          <Route path="content" element={<Navigate to="/admin/products" replace />} />
          <Route path="categories" element={<Navigate to="/admin/products" replace />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Route>
      <Route path="*" element={isAdminSession() ? <Navigate to="/admin/orders" replace /> : <Navigate to="/admin/login" replace />} />
    </Routes>
  );
}

Object.assign(window, { AdminRoutes });
