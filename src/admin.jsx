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
  const missingFile = typeof window !== 'undefined' && window.__NP_ADMIN_CONFIG_MISSING__;
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
        <span className="mono" style={{ color: 'var(--ink-3)' }}>АДМІН</span>
        <h1 style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontSize: 32, margin: '12px 0 24px' }}>Вхід</h1>
        {(missingFile || !configured) ? (
          <p style={{ color: 'var(--danger)', fontSize: 13, lineHeight: 1.5, marginBottom: 16 }}>
            Пароль не налаштовано: відсутній <span className="mono" style={{ color: 'var(--ink)' }}>config.secrets.js</span> або він порожній.
            Скопіюйте <span className="mono" style={{ color: 'var(--ink)' }}>config.secrets.example.js</span> → <span className="mono" style={{ color: 'var(--ink)' }}>config.secrets.js</span> і задайте пароль.
            На GitHub Pages: repository secret <span className="mono" style={{ color: 'var(--ink)' }}>NP_ADMIN_PASSWORD</span> і деплой через Actions (файл <span className="mono" style={{ color: 'var(--ink)' }}>.github/workflows/deploy-pages.yml</span>).
          </p>
        ) : null}
        <label className="mono" style={{ display: 'block', color: 'var(--ink-3)', marginBottom: 8, fontSize: 10 }}>ПАРОЛЬ</label>
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

function AdminSidebar() {
  const loc = useLocation();
  const link = (segment, label) => {
    const full = `/admin/${segment}`;
    const on = loc.pathname === full || loc.pathname.startsWith(`${full}/`);
    return (
      <Link to={full} className="mono admin-side-link" style={{
        display: 'block', padding: '12px 16px', fontSize: 11, letterSpacing: '0.08em',
        color: on ? 'var(--accent)' : 'var(--ink-2)', borderLeft: on ? '2px solid var(--accent)' : '2px solid transparent', marginLeft: -1,
      }}>{label}</Link>
    );
  };
  return (
    <aside className="admin-sidebar" style={{ width: 260, flexShrink: 0, borderRight: '1px solid var(--line)', background: 'var(--bg-2)', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div style={{ padding: '24px 20px', borderBottom: '1px solid var(--line)' }}>
        <span className="mono" style={{ color: 'var(--accent)' }}>НАШЕ ПИВО</span>
        <div style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontSize: 22, marginTop: 6 }}>Адмін</div>
      </div>
      <nav style={{ padding: '16px 0', flex: 1 }}>
        {link('orders', 'Замовлення · клієнти')}
        {link('content', 'Товари · контент')}
        {link('categories', 'Категорії')}
        {link('settings', 'Контакти · соцмережі')}
      </nav>
      <div style={{ padding: 16, borderTop: '1px solid var(--line)' }}>
        <AdminLogoutBtn />
        <Link to="/" className="mono" style={{ display: 'block', textAlign: 'center', marginTop: 12, fontSize: 10, color: 'var(--ink-3)' }}>На сайт</Link>
      </div>
    </aside>
  );
}

function AdminShell() {
  return (
    <div className="admin-root" style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
      <AdminSidebar />
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

function AdminOrders() {
  const { orders, setOrderStatus, getClients, setCustomerFlag } = useNpData();
  const [q, setQ] = useState('');
  const [st, setSt] = useState('all');
  const [sel, setSel] = useState(null);
  const [tab, setTab] = useState('orders');

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
          </div>

          <div style={{ border: '1px solid var(--line)', overflow: 'auto' }}>
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
                  <tr key={o.id} style={{ borderBottom: '1px solid var(--line)' }}>
                    <td style={{ padding: 12, color: 'var(--ink-2)' }}>{new Date(o.createdAt).toLocaleString('uk-UA')}</td>
                    <td style={{ padding: 12 }}>{o.name}</td>
                    <td style={{ padding: 12 }}>{o.phone}</td>
                    <td style={{ padding: 12 }}>{o.total} ₴</td>
                    <td style={{ padding: 12 }}>
                      <select value={o.status} onChange={(e) => setOrderStatus(o.id, e.target.value)} className="mono" style={{ padding: 8, background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--ink)', fontSize: 10 }}>
                        {ORDER_STATUSES.map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                      </select>
                    </td>
                    <td style={{ padding: 12 }}>
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
                    <p><span className="mono" style={{ color: 'var(--ink-3)' }}>АДРЕСА</span><br />{o.address}</p>
                    <p><span className="mono" style={{ color: 'var(--ink-3)' }}>СКЛАД</span></p>
                    <ul style={{ margin: 0, paddingLeft: 18 }}>
                      {(o.items || []).map((it, i) => (
                        <li key={i}>{it.name} × {it.qty} — {it.line ?? it.price * it.qty} ₴</li>
                      ))}
                    </ul>
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
              <ul style={{ margin: 0, paddingLeft: 18, color: 'var(--ink-2)' }}>
                {c.orders.map((o) => (
                  <li key={o.id}>{new Date(o.createdAt).toLocaleDateString('uk-UA')} — {o.total} ₴ — {ORDER_STATUSES.find(([k]) => k === o.status)?.[1]}</li>
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
  const { products, upsertProduct, deleteProductId, categories } = useNpData();
  const [selId, setSelId] = useState(null);
  const [draft, setDraft] = useState(null);

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
      <p className="mono" style={{ color: 'var(--ink-3)', marginBottom: 24, fontSize: 10 }}>CRUD · LIVE PREVIEW = ProductCard</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(280px,380px)', gap: 32, alignItems: 'start' }} className="admin-content-grid">
        <div>
          <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            <button type="button" className="mono" onClick={startNew} style={{ padding: '12px 16px', background: 'var(--accent)', color: '#1a1200', border: 'none', fontSize: 10 }}>+ Новий товар</button>
          </div>
          <div style={{ border: '1px solid var(--line)', maxHeight: 480, overflow: 'auto' }}>
            {products.map((p) => (
              <button key={p.id} type="button" onClick={() => setSelId(p.id)}
                style={{ display: 'block', width: '100%', textAlign: 'left', padding: 14, border: 'none', borderBottom: '1px solid var(--line)', background: selId === p.id ? 'color-mix(in srgb, var(--accent) 12%, transparent)' : 'var(--bg)', color: 'var(--ink)', cursor: 'pointer' }}>
                <span className="mono" style={{ color: 'var(--ink-3)', fontSize: 9 }}>{p.style}</span>
                <div style={{ fontFamily: 'Fraunces, serif', fontSize: 18 }}>{p.name}</div>
                <div className="mono" style={{ color: 'var(--accent)', marginTop: 4, fontSize: 10 }}>{p.price} ₴</div>
              </button>
            ))}
          </div>
        </div>

        <div style={{ position: 'sticky', top: 24 }}>
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
                  ['color', 'Колір (hex)'],
                  ['image', 'URL фото'],
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

function AdminCategories() {
  const { categories, addCategory, updateCategory, deleteCategory, products, assignProductCategory } = useNpData();
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [parentId, setParentId] = useState('');

  const roots = categories.filter((c) => !c.parentId);

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    addCategory({ name: name.trim(), slug: slug.trim() || name.trim().toLowerCase().replace(/\s+/g, '-'), parentId: parentId || null });
    setName('');
    setSlug('');
    setParentId('');
  };

  return (
    <div>
      <h2 style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontSize: 36, margin: '0 0 8px' }}>Категорії</h2>
      <p className="mono" style={{ color: 'var(--ink-3)', marginBottom: 24, fontSize: 10 }}>ІЄРАРХІЯ · ПРИВ’ЯЗКА ТОВАРІВ (поле cat = slug)</p>

      <form onSubmit={submit} style={{ border: '1px solid var(--line)', padding: 20, marginBottom: 28, background: 'var(--bg-2)', maxWidth: 520 }}>
        <div className="mono" style={{ color: 'var(--ink-3)', marginBottom: 12, fontSize: 10 }}>НОВА КАТЕГОРІЯ</div>
        <div style={{ display: 'grid', gap: 12 }}>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Назва" style={{ padding: 12, background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--ink)' }} />
          <input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="slug (латиницею)" style={{ padding: 12, background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--ink)' }} />
          <select value={parentId} onChange={(e) => setParentId(e.target.value)} style={{ padding: 12, background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--ink)' }}>
            <option value="">Без батька (корінь)</option>
            {roots.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <button type="submit" className="mono" style={{ padding: 14, background: 'var(--accent)', color: '#1a1200', border: 'none', fontSize: 10 }}>Додати</button>
        </div>
      </form>

      <div style={{ display: 'grid', gap: 12, marginBottom: 32 }}>
        {categories.map((c) => (
          <div key={c.id} style={{ border: '1px solid var(--line)', padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <span className="mono" style={{ color: 'var(--ink-3)', fontSize: 9 }}>{c.slug}</span>
              <div style={{ fontFamily: 'Fraunces, serif', fontSize: 20 }}>{c.name}</div>
              {c.parentId ? <div className="mono" style={{ fontSize: 9, color: 'var(--ink-3)' }}>батько: {categories.find((x) => x.id === c.parentId)?.name || c.parentId}</div> : null}
            </div>
            <button type="button" className="mono" onClick={() => deleteCategory(c.id)} style={{ border: '1px solid var(--line)', background: 'transparent', color: 'var(--danger)', padding: '8px 12px', fontSize: 10 }}>Видалити</button>
          </div>
        ))}
      </div>

      <h3 style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontSize: 24 }}>Прив’язка товарів</h3>
      <div style={{ border: '1px solid var(--line)', maxHeight: 400, overflow: 'auto' }}>
        {products.map((p) => (
          <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 12, borderBottom: '1px solid var(--line)', gap: 12, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'Fraunces, serif' }}>{p.name}</span>
            <select value={p.cat} onChange={(e) => assignProductCategory(p.id, e.target.value)} style={{ padding: 8, background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--ink)' }}>
              {categories.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminSettings() {
  const { settings, setSettings } = useNpData();
  const patch = (k, v) => setSettings((s) => ({ ...s, [k]: v }));

  return (
    <div>
      <h2 style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontSize: 36, margin: '0 0 8px' }}>Контакти</h2>
      <p className="mono" style={{ color: 'var(--ink-3)', marginBottom: 24, fontSize: 10 }}>ТЕЛЕФОН · EMAIL · АДРЕСА · СОЦМЕРЕЖІ</p>

      <div style={{ maxWidth: 560, border: '1px solid var(--line)', padding: 24, background: 'var(--bg-2)', display: 'grid', gap: 16 }}>
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
        {(settings.socials || []).map((s, i) => (
          <div key={s.id || i} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 8 }}>
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
          <Route path="content" element={<AdminContent />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Route>
      <Route path="*" element={isAdminSession() ? <Navigate to="/admin/orders" replace /> : <Navigate to="/admin/login" replace />} />
    </Routes>
  );
}

Object.assign(window, { AdminRoutes });
