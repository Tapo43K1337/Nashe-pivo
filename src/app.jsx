// App root — публічний сайт + маршрутизація /admin/*
const { useState: uS, useEffect: uE, useMemo: uM } = React;
const { BrowserRouter, Routes, Route, useParams, useNavigate } = window.ReactRouterDOM || {};
const { NpDataProvider } = window;

const DEFAULTS = JSON.parse(
  document.getElementById('__tweak_defaults').textContent
    .replace('/*EDITMODE-BEGIN*/', '').replace('/*EDITMODE-END*/', '')
);

const PUBLIC_SECTIONS = new Set(['home', 'about', 'catalog', 'contacts']);

function npRouterBasename() {
  if (typeof window.__NP_BASENAME__ === 'string' && window.__NP_BASENAME__.trim() !== '') {
    let b = window.__NP_BASENAME__.trim();
    if (!b.startsWith('/')) b = '/' + b;
    b = b.replace(/\/$/, '');
    return b || undefined;
  }
  return undefined;
}

function PublicSite() {
  const params = useParams();
  const navigate = useNavigate();
  const section = params.section;

  const [tweaks, setTweaks] = uS(DEFAULTS);
  const [tweakOpen, setTweakOpen] = uS(false);

  const [cart, setCart] = uS([]);
  const [cartOpen, setCartOpen] = uS(false);
  const [checkoutOpen, setCheckoutOpen] = uS(false);
  const [selected, setSelected] = uS(null);
  const [active, setActive] = uS('home');

  uE(() => {
    document.documentElement.dataset.theme = tweaks.theme;
  }, [tweaks.theme]);

  uE(() => {
    const raw = section || '';
    if (raw && !PUBLIC_SECTIONS.has(raw)) {
      navigate('/', { replace: true });
      return;
    }
    const id = !raw || raw === 'home' ? 'home' : raw;
    requestAnimationFrame(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    setActive(id);
  }, [section, navigate]);

  uE(() => {
    const ids = ['home', 'about', 'catalog', 'contacts'];
    const onScroll = () => {
      const scrollY = window.scrollY + window.innerHeight / 3;
      let cur = 'home';
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollY) cur = id;
      }
      setActive(cur);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  uE(() => {
    const onMsg = (e) => {
      const d = e.data;
      if (d?.type === '__activate_edit_mode') setTweakOpen(true);
      if (d?.type === '__deactivate_edit_mode') setTweakOpen(false);
    };
    window.addEventListener('message', onMsg);
    try { window.parent.postMessage({ type: '__edit_mode_available' }, '*'); } catch (e) {}
    return () => window.removeEventListener('message', onMsg);
  }, []);

  const addToCart = (product, qty = 1) => {
    setCart((c) => {
      const ex = c.find((i) => i.id === product.id);
      if (ex) return c.map((i) => (i.id === product.id ? { ...i, qty: i.qty + qty } : i));
      return [...c, { ...product, qty }];
    });
    setCartOpen(true);
  };
  const updateQty = (id, q) => setCart((c) => c.map((i) => (i.id === id ? { ...i, qty: q } : i)));
  const removeItem = (id) => setCart((c) => c.filter((i) => i.id !== id));

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <>
      {tweaks.showGrain && (
        <div aria-hidden style={{
          position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none', opacity: 0.4, mixBlendMode: 'overlay',
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.45 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }} />
      )}

      <Nav cartCount={cartCount} onCartOpen={() => setCartOpen(true)} active={active} />
      <main>
        <Hero />
        <About />
        <Catalog
          onOpen={setSelected}
          onAdd={addToCart}
          cardStyle={tweaks.cardStyle}
          density={tweaks.density}
        />
        <Contacts />
      </main>
      <Footer />

      <ProductModal product={selected} onClose={() => setSelected(null)} onAdd={addToCart} />
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cart}
        update={updateQty}
        remove={removeItem}
        onRequestCheckout={() => { setCartOpen(false); setCheckoutOpen(true); }}
      />
      <CheckoutModal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        onComplete={() => { setCart([]); setCheckoutOpen(false); }}
        onReturnToCart={() => setCartOpen(true)}
        items={cart}
      />

      {tweakOpen && <TweakPanel state={tweaks} setState={setTweaks} onClose={() => setTweakOpen(false)} />}
    </>
  );
}

function Root() {
  if (!BrowserRouter || !window.AdminRoutes) {
    return (
      <NpDataProvider>
        <p style={{ padding: 24, color: '#C8BFAE', fontFamily: 'system-ui' }}>Не вдалося завантажити маршрутизатор. Оновіть сторінку або перевірте підключення скриптів.</p>
      </NpDataProvider>
    );
  }
  return (
    <NpDataProvider>
      <BrowserRouter basename={npRouterBasename()}>
        <Routes>
          <Route path="/admin/*" element={<AdminRoutes />} />
          <Route path="/:section?" element={<PublicSite />} />
        </Routes>
      </BrowserRouter>
    </NpDataProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Root />);
