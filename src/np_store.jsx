// Глобальний стан каталогу, замовлень, категорій, контактів — localStorage + React Context
const { createContext, useContext, useMemo, useState, useCallback, useEffect } = React;

const LS = {
  products: 'np_products',
  orders: 'np_orders',
  categories: 'np_categories',
  settings: 'np_site_settings',
  customers: 'np_customers_meta',
};

const ADMIN_SESSION_KEY = 'np_admin_session';

function safeParse(raw, fallback) {
  if (raw == null || raw === '') return fallback;
  try {
    return JSON.parse(raw);
  } catch (e) {
    return fallback;
  }
}

function defaultCategories() {
  return [
    { id: 'c-beer', parentId: null, name: 'Пиво', slug: 'beer' },
    { id: 'c-snacks', parentId: null, name: 'Закуски', slug: 'snacks' },
  ];
}

function defaultSettings() {
  return {
    addressLine: 'вул. Патріотів України, 173',
    cityLine: 'Нікополь, Дніпропетровська обл., 53207',
    phoneDisplay: '+380 99 906 00 56',
    phoneTel: '+380999060056',
    email: 'hello@nashepivo.ua',
    socials: [
      { id: 'soc-1', label: 'Instagram', url: 'https://instagram.com/' },
      { id: 'soc-2', label: 'Facebook', url: 'https://facebook.com/' },
    ],
  };
}

function cloneCatalog() {
  const src = typeof window !== 'undefined' && Array.isArray(window.PRODUCTS) ? window.PRODUCTS : [];
  return src.map((p) => ({ ...p }));
}

const NpDataContext = createContext(null);

function useNpData() {
  const ctx = useContext(NpDataContext);
  if (!ctx) throw new Error('NpDataProvider відсутній');
  return ctx;
}

function NpDataProvider({ children }) {
  const [products, setProducts] = useState(() => {
    const saved = safeParse(localStorage.getItem(LS.products), null);
    return Array.isArray(saved) && saved.length ? saved : cloneCatalog();
  });
  const [orders, setOrders] = useState(() => safeParse(localStorage.getItem(LS.orders), []));
  const [categories, setCategories] = useState(() => {
    const saved = safeParse(localStorage.getItem(LS.categories), null);
    return Array.isArray(saved) && saved.length ? saved : defaultCategories();
  });
  const [settings, setSettings] = useState(() => {
    const saved = safeParse(localStorage.getItem(LS.settings), null);
    return saved && typeof saved === 'object' ? { ...defaultSettings(), ...saved } : defaultSettings();
  });
  const [customerMeta, setCustomerMeta] = useState(() => safeParse(localStorage.getItem(LS.customers), {}));

  useEffect(() => {
    localStorage.setItem(LS.products, JSON.stringify(products));
  }, [products]);
  useEffect(() => {
    localStorage.setItem(LS.orders, JSON.stringify(orders));
  }, [orders]);
  useEffect(() => {
    localStorage.setItem(LS.categories, JSON.stringify(categories));
  }, [categories]);
  useEffect(() => {
    localStorage.setItem(LS.settings, JSON.stringify(settings));
  }, [settings]);
  useEffect(() => {
    localStorage.setItem(LS.customers, JSON.stringify(customerMeta));
  }, [customerMeta]);

  const upsertProduct = useCallback((product) => {
    setProducts((prev) => {
      const i = prev.findIndex((p) => p.id === product.id);
      if (i === -1) return [...prev, product];
      const next = [...prev];
      next[i] = { ...next[i], ...product };
      return next;
    });
  }, []);

  const deleteProductId = useCallback((id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const addOrder = useCallback((payload) => {
    const id = `ord_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const row = {
      id,
      createdAt: new Date().toISOString(),
      status: 'new',
      ...payload,
    };
    setOrders((prev) => [row, ...prev]);
    return id;
  }, []);

  const setOrderStatus = useCallback((id, status) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  }, []);

  const addCategory = useCallback((row) => {
    const id = `cat_${Date.now()}`;
    const slug = row.slug || String(row.name || id).toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || id;
    setCategories((prev) => [...prev, {
      id,
      name: row.name || slug,
      slug,
      parentId: row.parentId || null,
    }]);
  }, []);

  const updateCategory = useCallback((id, patch) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }, []);

  const deleteCategory = useCallback((id) => {
    setCategories((prev) => prev.filter((c) => c.id !== id && c.parentId !== id));
  }, []);

  const assignProductCategory = useCallback((productId, catSlug) => {
    setProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, cat: catSlug } : p)));
  }, []);

  const setCustomerFlag = useCallback((phone, key, value) => {
    const k = String(phone || '').replace(/\s/g, '');
    if (!k) return;
    setCustomerMeta((prev) => ({
      ...prev,
      [k]: { ...(prev[k] || {}), [key]: !!value },
    }));
  }, []);

  const getClients = useCallback(() => {
    const by = {};
    orders.forEach((o) => {
      const k = String(o.phone || '').replace(/\s/g, '');
      if (!k) return;
      if (!by[k]) {
        by[k] = {
          phoneKey: k,
          name: o.name,
          phone: o.phone,
          orders: [],
          totalSpent: 0,
          meta: customerMeta[k] || {},
        };
      }
      by[k].orders.push(o);
      by[k].totalSpent += Number(o.total) || 0;
    });
    return Object.values(by).sort((a, b) => b.totalSpent - a.totalSpent);
  }, [orders, customerMeta]);

  const value = useMemo(
    () => ({
      products,
      setProducts,
      upsertProduct,
      deleteProductId,
      orders,
      setOrders,
      addOrder,
      setOrderStatus,
      categories,
      setCategories,
      addCategory,
      updateCategory,
      deleteCategory,
      assignProductCategory,
      settings,
      setSettings,
      customerMeta,
      setCustomerMeta,
      setCustomerFlag,
      getClients,
    }),
    [
      products,
      orders,
      categories,
      settings,
      customerMeta,
      upsertProduct,
      deleteProductId,
      addOrder,
      setOrderStatus,
      addCategory,
      updateCategory,
      deleteCategory,
      assignProductCategory,
      setCustomerFlag,
      getClients,
    ]
  );

  return <NpDataContext.Provider value={value}>{children}</NpDataContext.Provider>;
}

function isAdminSession() {
  try {
    return sessionStorage.getItem(ADMIN_SESSION_KEY) === '1';
  } catch (e) {
    return false;
  }
}

function adminLogin(password) {
  const expected = (typeof window !== 'undefined' && window.__NP_ADMIN_PASSWORD__) || 'nashepivo';
  if (password === expected) {
    sessionStorage.setItem(ADMIN_SESSION_KEY, '1');
    return true;
  }
  return false;
}

function adminLogout() {
  try {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
  } catch (e) {}
}

Object.assign(window, {
  NpDataProvider,
  NpDataContext,
  useNpData,
  isAdminSession,
  adminLogin,
  adminLogout,
  NP_LS_KEYS: LS,
});
