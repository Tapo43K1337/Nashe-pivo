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

const { useState, useMemo, useCallback, useEffect } = React;
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

function AdminLogoutBtn() {
  const nav = useNavigate();
  return (
    <button type="button" className="mono" onClick={() => { adminLogout(); nav('/admin/login', { replace: true }); }}
      style={{ width: '100%', padding: 12, border: '1px solid var(--line)', background: 'transparent', color: 'var(--ink-3)', fontSize: 10 }}>
      Вийти
    </button>
  );
}

function AdminSidebar({ menuExpanded, onToggleMenu }) {
  const loc = useLocation();
  const link = (segment, label) => {
    const full = `/admin/${segment}`;
    const on = loc.pathname === full || loc.pathname.startsWith(`${full}/`);
    return (
      <Link to={full} className={`mono admin-side-link${on ? ' is-active' : ''}`} style={{
        display: 'block', padding: '12px 16px', fontSize: 11, letterSpacing: '0.08em',
        color: on ? 'var(--accent)' : 'var(--ink-2)',
      }}>{label}</Link>
    );
  };
  return (
    <aside className={`admin-sidebar${menuExpanded ? '' : ' admin-sidebar--collapsed'}`} style={{ width: 260, flexShrink: 0, borderRight: '1px solid var(--line)', background: 'var(--bg-2)', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div style={{
        padding: '24px 20px', borderBottom: '1px solid var(--line)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10,
      }}>
        <div style={{ minWidth: 0 }}>
          <span className="mono" style={{ color: 'var(--accent)' }}>НАШЕ ПИВО</span>
          <div style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontSize: 17, lineHeight: 1.2, marginTop: 6 }}>Панель Администратора</div>
        </div>
        <button
          type="button"
          className="mono"
          aria-expanded={menuExpanded}
          aria-controls="admin-sidebar-nav"
          title={menuExpanded ? 'Згорнути меню' : 'Розгорнути меню'}
          onClick={onToggleMenu}
          style={{
            flexShrink: 0, padding: '8px 10px', border: '1px solid var(--line)', background: 'var(--surface)', color: 'var(--accent)',
            fontSize: 10, letterSpacing: '0.06em', cursor: 'pointer', lineHeight: 1.2, whiteSpace: 'nowrap',
          }}
        >{menuExpanded ? 'Згорнути' : 'Меню'}</button>
      </div>
      <nav id="admin-sidebar-nav" style={{ padding: '16px 0', flex: 1 }}>
        {link('orders', 'Замовлення · клієнти')}
        {link('products', 'Товари')}
        {link('settings', 'Контакти · соцмережі')}
      </nav>
      <div className="admin-sidebar-footer" style={{ padding: 16, borderTop: '1px solid var(--line)' }}>
        <AdminLogoutBtn />
        <Link to="/" className="mono" style={{ display: 'block', textAlign: 'center', marginTop: 12, fontSize: 10, color: 'var(--ink-3)' }}>На сайт</Link>
      </div>
    </aside>
  );
}

function AdminShell() {
  const [menuExpanded, setMenuExpanded] = useState(() => {
    try {
      return sessionStorage.getItem('np-admin-menu-expanded') !== '0';
    } catch (e) {
      return true;
    }
  });
  const toggleMenu = () => {
    setMenuExpanded((v) => {
      const n = !v;
      try { sessionStorage.setItem('np-admin-menu-expanded', n ? '1' : '0'); } catch (e) {}
      return n;
    });
  };
  return (
    <div className="admin-root" style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
      <AdminSidebar menuExpanded={menuExpanded} onToggleMenu={toggleMenu} />
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
  const [sel, setSel] = useState(null);
  const [tab, setTab] = useState('orders');
  const [clientOrderOpenId, setClientOrderOpenId] = useState(null);
  const [manualOpen, setManualOpen] = useState(false);

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
                      <button type="button" className="mono" onClick={() => setSel(sel === o.id ? null : o.id)} style={{ color: 'var(--accent)', background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer', fontSize: 10 }}>
                        {sel === o.id ? 'Сховати' : 'Деталі'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 ? <div className="mono" style={{ padding: 40, textAlign: 'center', color: 'var(--ink-3)' }}>Немає замовлень</div> : null}
          </div>

          {sel ? (
            <div style={{ marginTop: 24, padding: 24, border: '1px solid var(--line)', background: 'var(--bg-2)' }}>
              {(() => {
                const o = orders.find((x) => x.id === sel);
                if (!o) return null;
                return (
                  <>
                    <h3 style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', marginTop: 0 }}>Замовлення {o.id}</h3>
                    <AdminOrderSklad o={o} />
                  </>
                );
              })()}
            </div>
          ) : null}
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
                        onClick={() => setClientOrderOpenId(clientOrderOpenId === o.id ? null : o.id)}
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
                        {clientOrderOpenId === o.id ? 'Сховати склад' : 'Що замовив'}
                      </button>
                    </div>
                    {clientOrderOpenId === o.id ? (
                      <div
                        style={{
                          marginTop: 10,
                          marginLeft: 0,
                          padding: 14,
                          border: '1px solid var(--line)',
                          background: 'var(--surface)',
                          maxWidth: 520,
                        }}
                      >
                        <p className="mono" style={{ color: 'var(--ink-3)', fontSize: 10, marginTop: 0, marginBottom: 10 }}>
                          № {o.id}
                        </p>
                        <AdminOrderSklad o={o} />
                      </div>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {clients.length === 0 ? <div className="mono" style={{ color: 'var(--ink-3)' }}>Ще немає клієнтів (замовлення з’являться тут)</div> : null}
        </div>
      )}
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

function AdminContent() {
  const {
    products, upsertProduct, deleteProductId, categories, addCategory, deleteCategory, assignProductCategory,
  } = useNpData();
  const [selId, setSelId] = useState(null);
  const [draft, setDraft] = useState(null);
  const [newCatName, setNewCatName] = useState('');
  const [newCatSlug, setNewCatSlug] = useState('');
  const [newCatParent, setNewCatParent] = useState('');
  const [slugManual, setSlugManual] = useState(false);

  const catRoots = useMemo(() => categories.filter((c) => !c.parentId), [categories]);

  const submitNewCategory = (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const slug = (newCatSlug.trim() || slugifyCategoryName(newCatName) || `cat-${Date.now()}`).toLowerCase().replace(/[^a-z0-9-]/g, '') || `cat-${Date.now()}`;
    addCategory({ name: newCatName.trim(), slug, parentId: newCatParent || null });
    setNewCatName('');
    setNewCatSlug('');
    setNewCatParent('');
    setSlugManual(false);
  };

  useEffect(() => {
    if (!selId) {
      setDraft(null);
      return;
    }
    const p = products.find((x) => x.id === selId);
    if (p) setDraft({ ...p, image: p.image || '' });
  }, [selId, products]);

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
      <p className="mono" style={{ color: 'var(--ink-3)', marginBottom: 24, fontSize: 10 }}>Товари · категорії · прив’язка · прев’ю картки</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(280px,380px)', gap: 32, alignItems: 'start' }} className="admin-content-grid">
        <div>
          <h3 style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontSize: 22, margin: '0 0 6px' }}>Категорії</h3>
          <p className="mono" style={{ color: 'var(--ink-3)', marginBottom: 14, fontSize: 10 }}>Поле товару «Категорія» = slug нижче</p>

          <form onSubmit={submitNewCategory} style={{ border: '1px solid var(--line)', padding: 16, marginBottom: 16, background: 'var(--bg-2)' }}>
            <div className="mono" style={{ color: 'var(--ink-3)', marginBottom: 10, fontSize: 10 }}>НОВА КАТЕГОРІЯ</div>
            <div style={{ display: 'grid', gap: 10 }}>
              <input value={newCatName} onChange={(e) => {
                const v = e.target.value;
                setNewCatName(v);
                if (!slugManual) setNewCatSlug(slugifyCategoryName(v));
              }} placeholder="Назва" style={{ padding: 12, background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--ink)' }} />
              <input value={newCatSlug} onChange={(e) => { setSlugManual(true); setNewCatSlug(e.target.value); }} placeholder="slug (латиницею, інакше з назви)" style={{ padding: 12, background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--ink)' }} />
              <select value={newCatParent} onChange={(e) => setNewCatParent(e.target.value)} style={{ padding: 12, background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--ink)' }}>
                <option value="">Без батька (корінь)</option>
                {catRoots.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <button type="submit" className="mono" style={{ padding: 12, background: 'var(--accent)', color: '#1a1200', border: 'none', fontSize: 10 }}>Додати категорію</button>
            </div>
          </form>

          <div style={{ display: 'grid', gap: 10, marginBottom: 24 }}>
            {categories.map((c) => (
              <div key={c.id} style={{ border: '1px solid var(--line)', padding: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                <div>
                  <span className="mono" style={{ color: 'var(--ink-3)', fontSize: 9 }}>{c.slug}</span>
                  <div style={{ fontFamily: 'Fraunces, serif', fontSize: 18 }}>{c.name}</div>
                  {c.parentId ? <div className="mono" style={{ fontSize: 9, color: 'var(--ink-3)' }}>батько: {categories.find((x) => x.id === c.parentId)?.name || c.parentId}</div> : null}
                </div>
                <button type="button" className="mono" onClick={() => deleteCategory(c.id)} style={{ border: '1px solid var(--line)', background: 'transparent', color: 'var(--danger)', padding: '8px 12px', fontSize: 10 }}>Видалити</button>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            <button type="button" className="mono" onClick={startNew} style={{ padding: '12px 16px', background: 'var(--accent)', color: '#1a1200', border: 'none', fontSize: 10 }}>+ Новий товар</button>
          </div>
          <div style={{ border: '1px solid var(--line)' }}>
            {products.map((p, i) => (
              <button key={p.id} type="button" onClick={() => setSelId(p.id)}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '48px minmax(0, 1fr)',
                  gap: 14,
                  alignItems: 'center',
                  width: '100%',
                  textAlign: 'left',
                  padding: '14px 16px 14px 12px',
                  border: 'none',
                  borderBottom: '1px solid var(--line)',
                  background: selId === p.id ? 'color-mix(in srgb, var(--accent) 12%, transparent)' : 'var(--bg)',
                  color: 'var(--ink)',
                  cursor: 'pointer',
                }}>
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
            ))}
          </div>

          <h3 style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontSize: 22, margin: '28px 0 10px' }}>Прив’язка товарів</h3>
          <p className="mono" style={{ color: 'var(--ink-3)', marginBottom: 12, fontSize: 10 }}>Швидка зміна категорії для будь-якого товару</p>
          <div style={{ border: '1px solid var(--line)' }}>
            {products.map((p, i) => (
              <div key={p.id} style={{ display: 'grid', gridTemplateColumns: '40px minmax(0,1fr) auto', alignItems: 'center', padding: '12px 14px', borderBottom: '1px solid var(--line)', gap: 12 }}>
                <span aria-hidden style={{
                  fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontSize: 22, lineHeight: 1,
                  color: 'color-mix(in srgb, var(--accent) 50%, var(--ink-3))', textAlign: 'right', userSelect: 'none',
                }}>{i + 1}</span>
                <span style={{ fontFamily: 'Fraunces, serif', minWidth: 0 }}>{p.name}</span>
                <select value={p.cat} onChange={(e) => assignProductCategory(p.id, e.target.value)} style={{ padding: 8, background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--ink)' }}>
                  {categories.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
                </select>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-content-aside" style={{ position: 'sticky', top: 24 }}>
          {draft ? (
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
                  <button type="button" className="mono" onClick={save} style={{ flex: 1, padding: 14, background: 'var(--accent)', color: '#1a1200', border: 'none', fontSize: 10 }}>Зберегти</button>
                  <button type="button" className="mono" disabled={!products.some((p) => p.id === draft.id)}
                    onClick={() => { if (draft && products.some((p) => p.id === draft.id)) { deleteProductId(draft.id); setSelId(null); setDraft(null); } }}
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
          ) : (
            <div className="mono" style={{ color: 'var(--ink-3)', padding: 40, textAlign: 'center', border: '1px dashed var(--line)' }}>Оберіть товар або створіть новий</div>
          )}
        </div>
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

function AdminSettings() {
  const { settings, setSettings } = useNpData();
  const patch = (k, v) => setSettings((s) => ({ ...s, [k]: v }));

  return (
    <div>
      <h2 style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontSize: 36, margin: '0 0 8px' }}>Контакти</h2>
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
              gridTemplateColumns: '28px 1fr 2fr 40px',
              gap: 8,
              alignItems: 'center',
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
              }}
            >⋮⋮</span>
            <input value={s.label} onChange={(e) => {
              const socials = [...(settings.socials || [])];
              socials[i] = { ...socials[i], label: e.target.value };
              patch('socials', socials);
            }} placeholder="Назва" style={{ padding: 10, background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--ink)' }} />
            <input value={s.url} onChange={(e) => {
              const socials = [...(settings.socials || [])];
              socials[i] = { ...socials[i], url: e.target.value };
              patch('socials', socials);
            }} placeholder="https://…" style={{ padding: 10, background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--ink)' }} />
            <button
              type="button"
              className="mono"
              title="Видалити"
              onClick={() => patch('socials', (settings.socials || []).filter((_, j) => j !== i))}
              style={{
                padding: 8,
                border: '1px solid var(--line)',
                background: 'transparent',
                color: 'var(--danger)',
                fontSize: 14,
                lineHeight: 1,
                cursor: 'pointer',
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
