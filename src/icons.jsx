// Thin-line icons — 1.25px stroke, 20px viewBox
const I = ({ d, size = 18, fill = 'none' }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill={fill} stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const Icon = {
  Cart: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h2l1.5 10.5a1.5 1.5 0 0 0 1.5 1.3h8.3" />
      <path d="M5.5 6h12l-1.2 7H6.7" />
      <circle cx="8" cy="17" r="1" />
      <circle cx="15" cy="17" r="1" />
    </svg>
  ),
  Close: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4l12 12M16 4L4 16" />
    </svg>
  ),
  Arrow: ({ size = 18, dir = 'right' }) => {
    const rot = { right: 0, left: 180, up: -90, down: 90 }[dir] ?? 0;
    return (
      <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" style={{ transform: `rotate(${rot}deg)` }}>
        <path d="M4 10h12M12 6l4 4-4 4" />
      </svg>
    );
  },
  Plus: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M10 4v12M4 10h12" />
    </svg>
  ),
  Minus: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M4 10h12" />
    </svg>
  ),
  Menu: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round">
      <path d="M4 6h12M4 10h12M4 14h12" />
    </svg>
  ),
  Filter: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round">
      <path d="M3 5h14M6 10h8M9 15h2" />
    </svg>
  ),
  Pin: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 18s6-5.5 6-10a6 6 0 1 0-12 0c0 4.5 6 10 6 10z" />
      <circle cx="10" cy="8" r="2" />
    </svg>
  ),
  Phone: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4.5c0 7 4.5 11.5 11.5 11.5l.5-3-4-1-1.5 1.5c-1.5-.7-2.8-2-3.5-3.5L8.5 8l-1-4-3 .5z" />
    </svg>
  ),
  Clock: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="10" r="7" />
      <path d="M10 6v4l3 2" />
    </svg>
  ),
  Route: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="5" cy="5" r="2" />
      <circle cx="15" cy="15" r="2" />
      <path d="M5 7v3a3 3 0 0 0 3 3h4a3 3 0 0 1 3 3" />
    </svg>
  ),
  Star: ({ size = 14, filled = false }) => (
    <svg width={size} height={size} viewBox="0 0 20 20" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round">
      <path d="M10 2l2.5 5 5.5.8-4 3.9 1 5.5L10 14.5 5 17.2l1-5.5-4-3.9 5.5-.8L10 2z" />
    </svg>
  ),
  Hops: ({ size = 22 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3c2 2 2 4 0 6-2-2-2-4 0-6zM7 7c3 0 4 2 4 5-3 0-4-2-4-5zm10 0c-3 0-4 2-4 5 3 0 4-2 4-5zM5 13c3 0 4 2 4 5-3 0-4-2-4-5zm14 0c-3 0-4 2-4 5 3 0 4-2 4-5zm-7 2c2 2 2 4 0 6-2-2-2-4 0-6z" />
    </svg>
  ),
  Wheat: ({ size = 22 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22V6" />
      <path d="M12 8c-2-2-4-2-6 0 2 2 4 2 6 0zM12 8c2-2 4-2 6 0-2 2-4 2-6 0z" />
      <path d="M12 12c-2-2-4-2-6 0 2 2 4 2 6 0zM12 12c2-2 4-2 6 0-2 2-4 2-6 0z" />
      <path d="M12 16c-2-2-4-2-6 0 2 2 4 2 6 0zM12 16c2-2 4-2 6 0-2 2-4 2-6 0z" />
      <path d="M12 6c-1.5-2-1.5-3 0-4 1.5 1 1.5 2 0 4z" />
    </svg>
  ),
  Drop: ({ size = 22 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3c3 4 6 7.5 6 11a6 6 0 0 1-12 0c0-3.5 3-7 6-11z" />
    </svg>
  ),
};

window.Icon = Icon;
