// Page sections: Nav, Hero, About, Popular, Catalog, Contacts, Footer
const { useState: useS, useEffect: useE, useMemo: useM, useRef: useR } = React;
const useNpData = window.useNpData;
const RR = window.ReactRouterDOM;

// ============== NAV ==============
const Nav = ({ cartCount, onCartOpen, active }) => {
  const [scrolled, setScrolled] = useS(false);
  const [menuOpen, setMenuOpen] = useS(false);
  const [isNarrow, setIsNarrow] = useS(() => typeof window !== 'undefined' && window.innerWidth < 900);
  useE(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);
  useE(() => {
    const mq = window.matchMedia('(max-width: 899px)');
    const fn = () => setIsNarrow(mq.matches);
    fn();
    mq.addEventListener('change', fn);
    return () => mq.removeEventListener('change', fn);
  }, []);
  useE(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [menuOpen]);
  const links = [
    ['home', 'Головна'],
    ['catalog', 'Каталог'],
    ['about', 'Про нас'],
    ['contacts', 'Контакти'],
  ];
  const pathFor = (id) => (id === 'home' ? '/' : `/${id}`);
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setMenuOpen(false);
  };
  const navBtnStyle = (id) => ({
    position: 'relative', paddingBottom: 4,
    color: active === id ? 'var(--ink)' : 'var(--ink-2)',
    background: 'none', border: 'none', cursor: 'pointer', font: 'inherit',
    textAlign: 'inherit', textDecoration: 'none', display: 'inline-block',
  });
  return (
    <>
    <nav className="site-nav" style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      padding: scrolled ? '14px 40px' : '24px 40px',
      display: 'grid',
      gridTemplateColumns: isNarrow ? '1fr auto' : '1fr auto 1fr',
      alignItems: 'center',
      gap: isNarrow ? 12 : 0,
      background: scrolled ? 'color-mix(in srgb, var(--bg) 85%, transparent)' : 'transparent',
      backdropFilter: scrolled ? 'blur(16px) saturate(140%)' : 'none',
      borderBottom: scrolled ? '1px solid var(--line)' : '1px solid transparent',
      transition: 'all .35s ease',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {RR?.Link ? (
          <RR.Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: 'inherit' }}>
            <div style={{ width: 28, height: 28, border: '1px solid var(--accent)', display: 'grid', placeItems: 'center', color: 'var(--accent)' }}>
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.3">
                <path d="M6 4h8l-1 12H7L6 4z" />
                <path d="M7 7h6" />
              </svg>
            </div>
            <span className="mono nav-brand-text" style={{ fontSize: 12, letterSpacing: '0.18em' }}>НАШЕ · ПИВО</span>
          </RR.Link>
        ) : (
          <>
            <div style={{ width: 28, height: 28, border: '1px solid var(--accent)', display: 'grid', placeItems: 'center', color: 'var(--accent)' }}>
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.3">
                <path d="M6 4h8l-1 12H7L6 4z" />
                <path d="M7 7h6" />
              </svg>
            </div>
            <span className="mono nav-brand-text" style={{ fontSize: 12, letterSpacing: '0.18em' }}>НАШЕ · ПИВО</span>
          </>
        )}
      </div>
      {isNarrow ? (
        <div className="nav-mobile-actions" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            type="button"
            aria-label="Кошик"
            onClick={onCartOpen}
            className="nav-icon-btn"
            style={{
              position: 'relative', boxSizing: 'border-box',
              width: 44, height: 44, minWidth: 44, minHeight: 44, padding: 0, margin: 0,
              display: 'grid', placeItems: 'center',
              border: '1px solid var(--line)', color: 'var(--ink)', background: 'transparent',
            }}
          >
            <Icon.Cart size={18} />
            {cartCount > 0 && (
              <span style={{
                position: 'absolute', top: -4, right: -4,
                background: 'var(--accent)', color: '#1a1200',
                width: 18, height: 18, borderRadius: '50%',
                display: 'grid', placeItems: 'center',
                fontSize: 10, fontFamily: 'JetBrains Mono, monospace', fontWeight: 600,
              }}>{cartCount}</span>
            )}
          </button>
          <button
            type="button"
            aria-label="Меню"
            onClick={() => setMenuOpen(o => !o)}
            className="nav-icon-btn"
            style={{
              boxSizing: 'border-box',
              width: 44, height: 44, minWidth: 44, minHeight: 44, padding: 0, margin: 0,
              display: 'grid', placeItems: 'center',
              border: '1px solid var(--line)', color: 'var(--ink)', background: 'transparent',
            }}
          >
            {menuOpen ? <Icon.Close size={18} /> : <Icon.Menu size={18} />}
          </button>
        </div>
      ) : (
      <div className="nav-links-desktop" style={{ display: 'flex', gap: 32 }}>
        {links.map(([id, label]) => (
          RR?.Link ? (
            <RR.Link key={id} to={pathFor(id)} className="mono" style={navBtnStyle(id)}>
              {label}
              {active === id && <span style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, background: 'var(--accent)' }} />}
            </RR.Link>
          ) : (
            <button key={id} type="button" onClick={() => scrollTo(id)} className="mono" style={navBtnStyle(id)}>
              {label}
              {active === id && <span style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, background: 'var(--accent)' }} />}
            </button>
          )
        ))}
      </div>
      )}
      {!isNarrow && (
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 20 }}>
        <span className="mono" style={{ color: 'var(--ink-3)' }}>UA · UAH</span>
        <button onClick={onCartOpen} style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', border: '1px solid var(--line)' }}>
          <Icon.Cart size={16} />
          <span className="mono">Кошик</span>
          {cartCount > 0 && (
            <span style={{
              position: 'absolute', top: -6, right: -6,
              background: 'var(--accent)', color: '#1a1200',
              width: 18, height: 18, borderRadius: '50%',
              display: 'grid', placeItems: 'center',
              fontSize: 10, fontFamily: 'JetBrains Mono, monospace', fontWeight: 600,
            }}>{cartCount}</span>
          )}
        </button>
      </div>
      )}
    </nav>
    {isNarrow && menuOpen && (
      <div
        className="nav-mobile-panel"
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 55,
          paddingTop: 88, paddingLeft: 24, paddingRight: 24,
          background: 'color-mix(in srgb, var(--bg) 96%, transparent)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {links.map(([id, label]) => (
            RR?.Link ? (
              <RR.Link
                key={id}
                to={pathFor(id)}
                onClick={() => setMenuOpen(false)}
                className="mono"
                style={{
                  textAlign: 'left', padding: '16px 0', borderBottom: '1px solid var(--line)',
                  color: active === id ? 'var(--ink)' : 'var(--ink-2)', fontSize: 13, textDecoration: 'none', display: 'block',
                }}
              >
                {label}
              </RR.Link>
            ) : (
              <button
                key={id}
                type="button"
                onClick={() => scrollTo(id)}
                className="mono"
                style={{
                  textAlign: 'left', padding: '16px 0', borderBottom: '1px solid var(--line)',
                  color: active === id ? 'var(--ink)' : 'var(--ink-2)', fontSize: 13,
                }}
              >
                {label}
              </button>
            )
          ))}
        </div>
        <p className="mono" style={{ marginTop: 32, color: 'var(--ink-3)', fontSize: 11 }}>UA · UAH</p>
      </div>
    )}
    </>
  );
};

// ============== HERO ==============
const Hero = () => (
    <section id="home" data-screen-label="01 Home" className="hero-section" style={{
      minHeight: '100vh',
      padding: '120px 40px 60px',
      position: 'relative',
      display: 'grid',
      gridTemplateColumns: '1.1fr 1fr',
      gap: 40,
      alignItems: 'center',
      borderBottom: '1px solid var(--line)',
      overflow: 'hidden',
    }}>
      {/* Background */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 80% 30%, color-mix(in srgb, var(--accent) 18%, transparent), transparent 60%)',
        pointerEvents: 'none',
      }} />
      {/* Left — copy */}
      <div style={{ position: 'relative' }}>
        <div className="fadeUp" style={{ animationDelay: '.1s' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 32 }}>
            <span style={{ width: 40, height: 1, background: 'var(--accent)' }} />
            <span className="mono" style={{ color: 'var(--accent)' }}>НІКОПОЛЬ · З 2014 РОКУ</span>
          </div>
          <h1 style={{ fontSize: 'clamp(56px, 8vw, 120px)', lineHeight: 0.95, marginBottom: 28, letterSpacing: '-0.03em' }}>
            Пиво,<br/>
            <span style={{ fontStyle: 'italic', color: 'var(--accent)' }}>обране</span><br/>
            з душею.
          </h1>
          <p style={{ fontSize: 18, lineHeight: 1.55, color: 'var(--ink-2)', maxWidth: 460, marginBottom: 40 }}>
            Магазин пива у Нікополі. У каталозі 50 позицій — крафт, класика, імпорт. Допоможемо обрати саме те, що підійде до вашого настрою.
          </p>
          <div className="hero-cta" style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
            {RR?.Link ? (
              <RR.Link
                to="/catalog"
                style={{
                  padding: '18px 28px', background: 'var(--accent)', color: '#1a1200',
                  fontFamily: 'JetBrains Mono, monospace', fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase',
                  display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none',
                }}
              >
                Обрати пиво <Icon.Arrow />
              </RR.Link>
            ) : (
              <button
                type="button"
                onClick={() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })}
                style={{
                  padding: '18px 28px', background: 'var(--accent)', color: '#1a1200',
                  fontFamily: 'JetBrains Mono, monospace', fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase',
                  display: 'flex', alignItems: 'center', gap: 10,
                }}
              >
                Обрати пиво <Icon.Arrow />
              </button>
            )}
            {RR?.Link ? (
              <RR.Link to="/about" className="mono" style={{ padding: '18px 4px', color: 'var(--ink-2)', borderBottom: '1px solid var(--line)', textDecoration: 'none' }}>
                Про магазин
              </RR.Link>
            ) : (
              <button
                type="button"
                onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                className="mono"
                style={{ padding: '18px 4px', color: 'var(--ink-2)', borderBottom: '1px solid var(--line)' }}>
                Про магазин
              </button>
            )}
          </div>
        </div>
        <div className="hero-stats" style={{ display: 'flex', gap: 48, marginTop: 72, flexWrap: 'wrap' }}>
          {[['50', 'позицій у каталозі'], ['11', 'років у справі'], ['7', 'днів на тиждень']].map(([k, v]) => (
            <div key={k}>
              <div style={{ fontFamily: 'Fraunces, serif', fontSize: 42, fontStyle: 'italic', color: 'var(--accent)' }}>{k}</div>
              <div className="mono" style={{ color: 'var(--ink-3)', marginTop: 4 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right — photo collage: 1 tall + 2×2 = 5 tiles */}
      <div className="hero-photos" style={{ position: 'relative', height: '72vh', minHeight: 500 }}>
        <div className="hero-photo-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1.12fr 1fr 1fr',
          gridTemplateRows: '1fr 1fr',
          gap: 8,
          width: '100%',
          height: '100%',
          padding: '20px 0',
        }}>
          {[
            { i: 0, gridColumn: '1', gridRow: '1 / 3' },
            { i: 1, gridColumn: '2', gridRow: '1' },
            { i: 2, gridColumn: '3', gridRow: '1' },
            { i: 3, gridColumn: '2', gridRow: '2' },
            { i: 4, gridColumn: '3', gridRow: '2' },
          ].map(({ i, gridColumn, gridRow }) => {
            const p = PRODUCTS[i];
            return (
              <div
                key={p.id}
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  minHeight: 0,
                  gridColumn,
                  gridRow,
                }}
              >
                <img src={p.image} alt={p.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.52) 0%, transparent 52%)' }} />
                <div style={{ position: 'absolute', bottom: 10, left: 12, right: 10 }}>
                  <div className="mono" style={{ color: 'rgba(255,255,255,0.65)', fontSize: 9 }}>{p.style}</div>
                  <div style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontSize: i === 0 ? 14 : 12, color: '#fff', lineHeight: 1.2 }}>{p.name}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Marquee footer */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, borderTop: '1px solid var(--line)', overflow: 'hidden', padding: '14px 0' }}>
        <div style={{ display: 'flex', gap: 48, whiteSpace: 'nowrap', animation: 'marquee 40s linear infinite', width: 'fit-content' }}>
          {Array(3).fill(0).map((_, i) => (
            <React.Fragment key={i}>
              {['Крафт і класика', 'Великий вибір', 'Свіже постачання', 'Пиво з усієї України', 'Допоможемо обрати', 'Нікополь, вул. Патріотів України, 173'].map(t => (
                <span key={t + i} className="mono" style={{ color: 'var(--ink-3)' }}>— {t}</span>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
);

// ============== ABOUT ==============
const About = () => {
  const pillars = [
    { icon: <Icon.Hops />, title: 'Великий вибір', text: 'Великий вибір — крафтові, класичні, імпортні. Постійно оновлюємо асортимент.' },
    { icon: <Icon.Wheat />, title: 'Свіже постачання', text: 'Пиво надходить регулярно. Слідкуємо за термінами і зберігаємо продукт правильно.' },
    { icon: <Icon.Drop />, title: 'Порадимо особисто', text: 'Наші продавці знають кожен сорт. Розкажемо про смак, допоможемо підібрати до події.' },
  ];
  return (
    <section id="about" data-screen-label="02 About" className="about-section" style={{ padding: '140px 40px', borderBottom: '1px solid var(--line)', position: 'relative' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div className="about-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 80, alignItems: 'start', marginBottom: 100 }}>
          <div>
            <span className="mono" style={{ color: 'var(--accent)' }}>— 01 / МАНІФЕСТ</span>
            <h2 className="about-heading" style={{ fontSize: 64, lineHeight: 1, marginTop: 24 }}>
              Ми <span style={{ fontStyle: 'italic' }}>любимо</span> пиво.
            </h2>
          </div>
          <div style={{ paddingTop: 20 }}>
            <p style={{ fontSize: 22, lineHeight: 1.5, color: 'var(--ink)', margin: 0, marginBottom: 24, fontFamily: 'Fraunces, serif' }}>
              «Наше Пиво» — це магазин для тих, хто цінує смак. Ми зібрали під одним дахом добірне пиво з України та світу.
            </p>
            <p style={{ color: 'var(--ink-2)', fontSize: 15, lineHeight: 1.7, margin: 0 }}>
              Починали з невеликого відділу у 2014 році. Сьогодні в каталозі — 50 позицій: 44 сорти пива та закуски до нього. Від лагерів і пшеничних до IPA й стаутів; допоможемо обрати під настрій і стіл.
            </p>
          </div>
        </div>

        <div className="pillars-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
          {pillars.map((p, i) => (
            <div key={i} style={{ padding: '40px 32px', borderLeft: i > 0 ? '1px solid var(--line)' : 'none' }}>
              <div style={{ color: 'var(--accent)', marginBottom: 28 }}>{p.icon}</div>
              <h3 style={{ fontSize: 26, fontStyle: 'italic', marginBottom: 14 }}>{p.title}</h3>
              <p style={{ fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.6, margin: 0 }}>{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============== POPULAR & CATALOG ==============
const Catalog = ({ onOpen, onAdd, cardStyle, density }) => {
  const { products } = useNpData();
  const [cat, setCat] = useS('all'); // all / beer / snacks
  const [style, setStyle] = useS('all');
  const [strength, setStrength] = useS('all'); // all / light / medium / strong
  const [sort, setSort] = useS('pop'); // pop / price-asc / price-desc / abv
  const [sortOpen, setSortOpen] = useS(false);
  const sortWrapRef = useR(null);
  const [maxPrice, setMaxPrice] = useS(500);
  const [vw, setVw] = useS(typeof window !== 'undefined' ? window.innerWidth : 1200);

  const SORT_OPTIONS = useM(() => [
    ['pop', 'Популярні'],
    ['price-asc', 'Ціна ↑'],
    ['price-desc', 'Ціна ↓'],
    ['abv', 'Міцність'],
  ], []);
  useE(() => {
    if (!sortOpen) return;
    const close = (e) => {
      if (sortWrapRef.current && !sortWrapRef.current.contains(e.target)) setSortOpen(false);
    };
    const onKey = (e) => { if (e.key === 'Escape') setSortOpen(false); };
    document.addEventListener('mousedown', close);
    document.addEventListener('touchstart', close, { passive: true });
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('touchstart', close);
      document.removeEventListener('keydown', onKey);
    };
  }, [sortOpen]);
  useE(() => {
    const r = () => setVw(window.innerWidth);
    window.addEventListener('resize', r, { passive: true });
    return () => window.removeEventListener('resize', r);
  }, []);

  const catSlugSet = useM(() => [...new Set(products.map((p) => p.cat).filter(Boolean))].sort(), [products]);
  const catTabs = useM(() => [
    ['all', 'Все'],
    ...catSlugSet.map((slug) => [slug, slug === 'beer' ? 'Пиво' : slug === 'snacks' ? 'Закуски' : slug]),
  ], [catSlugSet]);

  const stylePills = useM(() => {
    const set = new Set(products.filter((p) => cat === 'all' || p.cat === cat).map((p) => p.style).filter(Boolean));
    return [...set].sort();
  }, [cat, products]);

  useE(() => {
    if (cat !== 'all' && !catSlugSet.includes(cat)) setCat('all');
  }, [cat, catSlugSet]);

  useE(() => {
    if (style !== 'all' && !products.some((p) => (cat === 'all' || p.cat === cat) && p.style === style)) setStyle('all');
  }, [cat, products, style]);

  const filtered = useM(() => {
    let list = products.filter(p => {
      if (cat !== 'all' && p.cat !== cat) return false;
      if (style !== 'all' && p.style !== style) return false;
      if (p.price > maxPrice) return false;
      if (strength !== 'all' && p.abv != null) {
        if (strength === 'light' && p.abv >= 5) return false;
        if (strength === 'medium' && (p.abv < 5 || p.abv >= 7)) return false;
        if (strength === 'strong' && p.abv < 7) return false;
      }
      if (strength !== 'all' && p.abv == null) return false;
      return true;
    });
    if (sort === 'price-asc') list = [...list].sort((a,b) => a.price - b.price);
    if (sort === 'price-desc') list = [...list].sort((a,b) => b.price - a.price);
    if (sort === 'abv') list = [...list].sort((a,b) => (b.abv||0) - (a.abv||0));
    return list;
  }, [cat, style, strength, sort, maxPrice, products]);

  const wantCols = density === 'compact' ? 4 : 3;
  const mobileCatalog = vw < 900;
  const cols = !mobileCatalog
    ? (vw < 1100 ? Math.min(wantCols, 2) : wantCols)
    : vw < 560
      ? 1
      : 2;
  const mobileCardMode = mobileCatalog ? (cols === 1 ? 'solo' : 'duo') : 'desktop';
  const catalogGridGap = mobileCatalog ? (cols === 1 ? 22 : 16) : density === 'compact' ? 16 : 24;

  return (
    <section id="catalog" data-screen-label="03 Catalog" className="catalog-section" style={{ padding: '140px 40px', borderBottom: '1px solid var(--line)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div className="catalog-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48, gap: 20, flexWrap: 'wrap' }}>
          <div>
            <span className="mono" style={{ color: 'var(--accent)' }}>— 02 / КАТАЛОГ</span>
            <h2 className="catalog-heading" style={{ fontSize: 72, lineHeight: 1, marginTop: 20 }}>
              Що <span style={{ fontStyle: 'italic' }}>наливаємо</span>
            </h2>
          </div>
          <div className="mono catalog-meta" style={{ color: 'var(--ink-3)', textAlign: 'right' }}>
            <div>{filtered.length} / {products.length} позицій</div>
            <div style={{ marginTop: 4 }}>
              {mobileCardMode === 'solo' ? 'Торкніть картку — деталі' : mobileCardMode === 'duo' ? 'Дві колонки — торкніть для деталей' : 'Наведіть — щоб перевернути'}
            </div>
          </div>
        </div>

        {/* Category tabs */}
        <div className="catalog-tabs-row" style={{ display: 'flex', gap: 0, marginBottom: 28, borderBottom: '1px solid var(--line)' }}>
          {catTabs.map(([k, v]) => (
            <button key={k} onClick={() => { setCat(k); setStyle('all'); }}
              className="mono"
              style={{
                padding: '14px 20px',
                borderBottom: cat === k ? '2px solid var(--accent)' : '2px solid transparent',
                marginBottom: -1,
                color: cat === k ? 'var(--ink)' : 'var(--ink-3)',
              }}>
              {v} <span style={{ color: 'var(--ink-3)', marginLeft: 6 }}>
                {k === 'all' ? products.length : products.filter(p => p.cat === k).length}
              </span>
            </button>
          ))}
        </div>

        {/* Filters row */}
        <div className="catalog-filters" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 28, padding: '20px 0 32px', borderBottom: '1px solid var(--line)', marginBottom: 40, alignItems: 'end' }}>
          <div>
            <div className="mono" style={{ color: 'var(--ink-3)', marginBottom: 10 }}>СТИЛЬ</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <Pill active={style === 'all'} onClick={() => setStyle('all')}>Будь-який</Pill>
              {stylePills.map(s => (
                <Pill key={s} active={style === s} onClick={() => setStyle(s)}>{s}</Pill>
              ))}
            </div>
          </div>
          <div>
            <div className="mono" style={{ color: 'var(--ink-3)', marginBottom: 10 }}>МІЦНІСТЬ</div>
            <div style={{ display: 'flex', gap: 6 }}>
              {[['all', 'Всі'], ['light', '< 5%'], ['medium', '5–7%'], ['strong', '7%+']].map(([k, v]) => (
                <Pill key={k} active={strength === k} onClick={() => setStrength(k)}>{v}</Pill>
              ))}
            </div>
          </div>
          <div>
            <div className="mono" style={{ color: 'var(--ink-3)', marginBottom: 10 }}>ЦІНА · ДО {maxPrice} ₴</div>
            <input
              type="range" min="75" max="500" step="5" value={maxPrice}
              onChange={(e) => setMaxPrice(+e.target.value)}
              style={{ width: '100%', accentColor: 'var(--accent)' }}
            />
          </div>
          <div ref={sortWrapRef} className="catalog-sort-wrap" style={{ position: 'relative', minWidth: 0, width: '100%' }}>
            <div className="mono" style={{ color: 'var(--ink-3)', marginBottom: 10 }}>СОРТУВАННЯ</div>
            <div style={{ display: 'inline-block', maxWidth: '100%', position: 'relative', verticalAlign: 'top' }}>
              <button
                type="button"
                className="mono catalog-sort-trigger"
                aria-expanded={sortOpen}
                aria-haspopup="listbox"
                onClick={() => setSortOpen(o => !o)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
                  minWidth: 0, maxWidth: '100%', whiteSpace: 'nowrap',
                  background: 'var(--bg-2)', border: '1px solid var(--line)', color: 'var(--ink)',
                  padding: '10px 14px', cursor: 'pointer', textAlign: 'left', fontSize: 11,
                }}
              >
                <span>{(SORT_OPTIONS.find(([k]) => k === sort) || SORT_OPTIONS[0])[1]}</span>
                <Icon.Arrow dir={sortOpen ? 'up' : 'down'} size={14} />
              </button>
              {sortOpen && (
                <ul
                  role="listbox"
                  className="catalog-sort-list"
                  style={{
                    position: 'absolute', left: 0, top: '100%', marginTop: 6, zIndex: 50,
                    padding: 0, listStyle: 'none', margin: 0,
                    width: '100%', boxSizing: 'border-box',
                    background: 'var(--surface)', border: '1px solid var(--line)',
                    boxShadow: '0 20px 48px rgba(0,0,0,0.55)', borderRadius: 2, overflow: 'hidden',
                  }}
                >
                  {SORT_OPTIONS.map(([k, label], i) => (
                    <li key={k} style={{ borderBottom: i < SORT_OPTIONS.length - 1 ? '1px solid var(--line)' : 'none' }}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={sort === k}
                        className="mono"
                        onClick={() => { setSort(k); setSortOpen(false); }}
                        style={{
                          display: 'block', width: '100%', textAlign: 'left',
                          padding: '12px 14px', border: 'none', cursor: 'pointer', fontSize: 11,
                          background: sort === k ? 'color-mix(in srgb, var(--accent) 16%, transparent)' : 'var(--surface)',
                          color: sort === k ? 'var(--accent)' : 'var(--ink)',
                        }}
                      >{label}</button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div style={{ padding: '100px 0', textAlign: 'center' }}>
            <div style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontSize: 32, color: 'var(--ink-2)' }}>Нічого не знайшлось</div>
            <p className="mono" style={{ color: 'var(--ink-3)', marginTop: 12 }}>Спробуйте послабити фільтри</p>
          </div>
        ) : (
          <div
            className="catalog-prod-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${cols}, 1fr)`,
              gap: catalogGridGap,
            }}
          >
            {filtered.map(p => (
              <ProductCard key={p.id} product={p} onOpen={onOpen} onAdd={onAdd} style={cardStyle} density={density} mobileCardMode={mobileCardMode} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

// ============== CONTACTS ==============
const Contacts = () => {
  const { settings } = useNpData();
  const rawTel = String(settings.phoneTel || '+380999060056').replace(/\s/g, '').replace(/^tel:/i, '');
  const telHref = `tel:${rawTel}`;
  return (
    <section id="contacts" data-screen-label="04 Contacts" className="contacts-section" style={{ padding: '140px 40px 80px', position: 'relative' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48 }}>
          <div>
            <span className="mono" style={{ color: 'var(--accent)' }}>— 03 / ЗАВІТАЙТЕ</span>
            <h2 className="contacts-heading" style={{ fontSize: 72, lineHeight: 1, marginTop: 20 }}>
              Магазин <span style={{ fontStyle: 'italic' }}>пива</span>
            </h2>
          </div>
        </div>

        <div className="contacts-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 0, border: '1px solid var(--line)' }}>
          {/* Info */}
          <div style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: 32 }}>
            <div>
              <div className="mono" style={{ color: 'var(--ink-3)', marginBottom: 10 }}>АДРЕСА</div>
              <div style={{ fontFamily: 'Fraunces, serif', fontSize: 24, lineHeight: 1.3 }}>
                {settings.addressLine || '—'}<br />{settings.cityLine || ''}
              </div>
            </div>

            <div style={{ height: 1, background: 'var(--line)' }} />

            <div>
              <div className="mono" style={{ color: 'var(--ink-3)', marginBottom: 10 }}>ГОДИНИ</div>
              <div style={{ display: 'grid', gap: 6, fontFamily: 'Fraunces, serif', fontSize: 17 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Пн — Нд</span><span>10:00 — 20:00</span></div>
              </div>
            </div>

            <div style={{ height: 1, background: 'var(--line)' }} />

            <div>
              <div className="mono" style={{ color: 'var(--ink-3)', marginBottom: 10 }}>ЗВ’ЯЗОК</div>
              <div style={{ display: 'grid', gap: 10, fontFamily: 'Fraunces, serif', fontSize: 17 }}>
                <a href={telHref} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Icon.Phone size={16} /> {settings.phoneDisplay || '+380 99 906 00 56'}
                </a>
                <a href={`mailto:${settings.email || 'hello@nashepivo.ua'}`} style={{ color: 'var(--ink-2)' }}>{settings.email || 'hello@nashepivo.ua'}</a>
                {(settings.socials || []).filter((s) => s.url).map((s) => (
                  <a key={s.id || s.url} href={s.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--ink-2)' }}>{s.label || s.url}</a>
                ))}
              </div>
            </div>

            <button style={{
              marginTop: 'auto',
              padding: '18px', border: '1px solid var(--accent)', color: 'var(--accent)',
              fontFamily: 'JetBrains Mono, monospace', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              background: 'transparent',
            }}>
              <Icon.Route /> Прокласти маршрут
            </button>
          </div>

          {/* Map */}
          <FakeMap />
        </div>
      </div>
    </section>
  );
};

const FakeMap = () => (
  <div className="fake-map-wrap" style={{
    position: 'relative',
    background: 'var(--bg-2)',
    borderLeft: '1px solid var(--line)',
    minHeight: 520,
    overflow: 'hidden',
  }}>
    <svg width="100%" height="100%" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0 }}>
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--line)" strokeWidth="0.5"/>
        </pattern>
      </defs>
      <rect width="800" height="600" fill="url(#grid)" />
      {/* Rivers */}
      <path d="M0 180 Q 200 220 400 200 T 800 260" stroke="var(--accent)" strokeWidth="1" opacity="0.35" fill="none" />
      {/* Roads */}
      <path d="M80 0 L 80 600" stroke="var(--ink-3)" strokeWidth="0.8" opacity="0.4" />
      <path d="M0 150 L 800 120" stroke="var(--ink-3)" strokeWidth="0.8" opacity="0.4" />
      <path d="M0 380 L 800 420" stroke="var(--ink-3)" strokeWidth="1.2" opacity="0.6" />
      <path d="M480 0 L 520 600" stroke="var(--ink-3)" strokeWidth="1.2" opacity="0.6" />
      <path d="M200 0 L 240 600" stroke="var(--ink-3)" strokeWidth="0.6" opacity="0.3" />
      <path d="M640 0 L 680 600" stroke="var(--ink-3)" strokeWidth="0.6" opacity="0.3" />
      <path d="M0 260 L 800 280" stroke="var(--ink-3)" strokeWidth="0.6" opacity="0.3" />
      <path d="M0 500 L 800 540" stroke="var(--ink-3)" strokeWidth="0.6" opacity="0.3" />
      {/* Buildings */}
      {Array.from({length: 40}).map((_, i) => {
        const x = (i * 91) % 800;
        const y = (i * 173) % 600;
        const w = 20 + (i * 7) % 30;
        const h = 14 + (i * 11) % 24;
        return <rect key={i} x={x} y={y} width={w} height={h} fill="var(--line)" opacity="0.5" />;
      })}
      {/* Pin location */}
      <g transform="translate(500, 300)">
        <circle r="60" fill="var(--accent)" opacity="0.1" />
        <circle r="30" fill="var(--accent)" opacity="0.2" />
        <circle r="6" fill="var(--accent)" />
        <circle r="3" fill="var(--bg)" />
      </g>
    </svg>
    {/* Card overlay */}
    <div style={{
      position: 'absolute', top: 24, left: 24,
      background: 'var(--bg)', border: '1px solid var(--line)',
      padding: '16px 18px',
      display: 'flex', alignItems: 'center', gap: 14,
      backdropFilter: 'blur(4px)',
    }}>
      <div style={{ color: 'var(--accent)' }}><Icon.Pin /></div>
      <div>
        <div className="mono" style={{ color: 'var(--ink-3)', fontSize: 10 }}>МАГАЗИН «НАШЕ ПИВО»</div>
        <div style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontSize: 16 }}>вул. Патріотів України, 173</div>
      </div>
    </div>
    <div style={{
      position: 'absolute', bottom: 24, right: 24,
      display: 'flex', gap: 8,
    }}>
      {['+', '−'].map(s => (
        <button key={s} style={{ width: 36, height: 36, background: 'var(--bg)', border: '1px solid var(--line)', color: 'var(--ink)' }}>{s}</button>
      ))}
    </div>
  </div>
);

// ============== FOOTER ==============
const Footer = () => (
  <footer className="site-footer" style={{ borderTop: '1px solid var(--line)', padding: '60px 40px 32px', background: 'var(--bg-2)' }}>
    <div style={{ maxWidth: 1280, margin: '0 auto' }}>
      <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 48, marginBottom: 56 }}>
        <div>
          <h3 style={{ fontSize: 32, fontStyle: 'italic', marginBottom: 12 }}>Наше Пиво</h3>
          <p style={{ color: 'var(--ink-2)', fontSize: 13, lineHeight: 1.6, maxWidth: 340 }}>
            Магазин пива у Нікополі. 50 позицій у каталозі — крафт, класика, імпорт. Працюємо з 2014 року.
          </p>
        </div>
        {[
          ['Магазин', ['Пиво', 'Закуски', 'Оптом']],
          ['Контакт', ['Нікополь', 'Доставка', 'hello@nashepivo.ua', '+380 99 906 00 56', 'Вакансії']],
        ].map(([title, items]) => (
          <div key={title}>
            <div className="mono" style={{ color: 'var(--ink-3)', marginBottom: 16 }}>{title}</div>
            <div style={{ display: 'grid', gap: 10 }}>
              {items.map(it => <a key={it} style={{ color: 'var(--ink-2)', fontSize: 14 }}>{it}</a>)}
            </div>
          </div>
        ))}
      </div>
      <div className="footer-meta mono" style={{ borderTop: '1px solid var(--line)', paddingTop: 24, display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ color: 'var(--ink-3)' }}>© 2014 — 2026 Наше Пиво</span>
        <span style={{ color: 'var(--ink-3)' }}>18+ · Надмірне вживання шкодить</span>
      </div>
    </div>
  </footer>
);

Object.assign(window, { Nav, Hero, About, Catalog, Contacts, Footer });
