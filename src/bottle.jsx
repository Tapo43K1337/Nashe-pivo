// Stylized bottle/can illustration — monochrome with accent fill
// Deterministic per product id — silhouette varies by cat/style
function hashN(id) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return Math.abs(h);
}

const Bottle = ({ product, size = 220, tilt = 0 }) => {
  const h = hashN(product.id);
  const shape = product.cat === 'snacks'
    ? 'jar'
    : (['bottle', 'can', 'bottle-tall', 'bottle-stubby'][h % 4]);
  const fill = product.color;

  const Label = ({ w, x, y, h: lh }) => (
    <g>
      <rect x={x} y={y} width={w} height={lh} fill="var(--bg-2)" stroke="var(--ink)" strokeWidth="0.8" opacity="0.95" />
      <rect x={x + 3} y={y + 3} width={w - 6} height="1" fill="var(--accent)" />
      <text x={x + w/2} y={y + lh/2 + 2} textAnchor="middle" fontSize="4.5" fontFamily="Fraunces, serif" fill="var(--ink)" style={{fontStyle: 'italic'}}>
        {product.name.split(' ')[0]}
      </text>
      <text x={x + w/2} y={y + lh/2 + 8} textAnchor="middle" fontSize="3" fontFamily="JetBrains Mono, monospace" fill="var(--ink-3)" letterSpacing="0.5">
        {product.style?.toUpperCase()}
      </text>
      <rect x={x + 3} y={y + lh - 4} width={w - 6} height="1" fill="var(--accent)" />
    </g>
  );

  let body = null;
  if (shape === 'bottle') {
    body = (
      <g>
        {/* Cap */}
        <rect x="42" y="8" width="16" height="10" fill="var(--ink)" rx="1" />
        <rect x="42" y="10" width="16" height="1" fill={fill} opacity="0.6" />
        <rect x="42" y="12" width="16" height="1" fill={fill} opacity="0.6" />
        <rect x="42" y="14" width="16" height="1" fill={fill} opacity="0.6" />
        {/* Neck */}
        <path d="M44,18 L44,32 L40,38 L40,90 Q40,96 46,96 L54,96 Q60,96 60,90 L60,38 L56,32 L56,18 Z" fill={fill} />
        <path d="M44,18 L44,32 L40,38 L40,90 Q40,96 46,96 L54,96 Q60,96 60,90 L60,38 L56,32 L56,18 Z" fill="none" stroke="var(--ink)" strokeWidth="0.6" opacity="0.4" />
        {/* Shine */}
        <rect x="43" y="40" width="1.5" height="48" fill="#fff" opacity="0.25" />
        {/* Label */}
        <Label x="38" y="50" w="24" h="30" />
      </g>
    );
  } else if (shape === 'bottle-tall') {
    body = (
      <g>
        <rect x="44" y="6" width="12" height="8" fill="var(--ink)" rx="1" />
        <path d="M45,14 L45,28 L42,34 L42,94 Q42,98 46,98 L54,98 Q58,98 58,94 L58,34 L55,28 L55,14 Z" fill={fill} />
        <path d="M45,14 L45,28 L42,34 L42,94 Q42,98 46,98 L54,98 Q58,98 58,94 L58,34 L55,28 L55,14 Z" fill="none" stroke="var(--ink)" strokeWidth="0.6" opacity="0.4" />
        <rect x="44" y="36" width="1" height="52" fill="#fff" opacity="0.2" />
        <Label x="40" y="44" w="20" h="36" />
      </g>
    );
  } else if (shape === 'bottle-stubby') {
    body = (
      <g>
        <rect x="40" y="10" width="20" height="10" fill="var(--ink)" rx="1" />
        <path d="M42,20 L42,32 L36,40 L36,92 Q36,98 44,98 L56,98 Q64,98 64,92 L64,40 L58,32 L58,20 Z" fill={fill} />
        <path d="M42,20 L42,32 L36,40 L36,92 Q36,98 44,98 L56,98 Q64,98 64,92 L64,40 L58,32 L58,20 Z" fill="none" stroke="var(--ink)" strokeWidth="0.6" opacity="0.4" />
        <rect x="38" y="44" width="1.5" height="46" fill="#fff" opacity="0.2" />
        <Label x="32" y="50" w="36" h="34" />
      </g>
    );
  } else if (shape === 'can') {
    body = (
      <g>
        {/* Top rim */}
        <ellipse cx="50" cy="14" rx="18" ry="3" fill="var(--ink-3)" opacity="0.4" />
        <ellipse cx="50" cy="13" rx="18" ry="3" fill="var(--ink)" opacity="0.6" />
        {/* Body */}
        <rect x="32" y="13" width="36" height="82" fill={fill} />
        <path d="M32,13 L32,95 Q32,98 35,98 L65,98 Q68,98 68,95 L68,13" fill="none" stroke="var(--ink)" strokeWidth="0.6" opacity="0.4" />
        {/* Bottom rim */}
        <ellipse cx="50" cy="95" rx="18" ry="2.5" fill="var(--ink)" opacity="0.3" />
        {/* Shine */}
        <rect x="35" y="18" width="1.5" height="72" fill="#fff" opacity="0.18" />
        <rect x="64" y="18" width="1" height="72" fill="#000" opacity="0.15" />
        {/* Label as text on body */}
        <rect x="34" y="35" width="32" height="0.5" fill="var(--ink)" opacity="0.5" />
        <text x="50" y="50" textAnchor="middle" fontSize="6" fontFamily="Fraunces, serif" fill="var(--ink)" style={{fontStyle:'italic'}}>
          {product.name.split(' ')[0]}
        </text>
        <text x="50" y="60" textAnchor="middle" fontSize="5" fontFamily="Fraunces, serif" fill="var(--ink)" style={{fontStyle:'italic'}}>
          {product.name.split(' ').slice(1).join(' ')}
        </text>
        <rect x="34" y="66" width="32" height="0.5" fill="var(--ink)" opacity="0.5" />
        <text x="50" y="75" textAnchor="middle" fontSize="3" fontFamily="JetBrains Mono, monospace" fill="var(--ink-2)" letterSpacing="1">
          {product.style?.toUpperCase()} · {product.abv}%
        </text>
        <text x="50" y="88" textAnchor="middle" fontSize="2.5" fontFamily="JetBrains Mono, monospace" fill="var(--accent)" letterSpacing="1">
          {product.vol}
        </text>
      </g>
    );
  } else {
    // jar (snacks)
    body = (
      <g>
        <rect x="34" y="10" width="32" height="6" fill="var(--ink)" rx="1" />
        <rect x="32" y="16" width="36" height="4" fill="var(--ink-3)" opacity="0.5" />
        <rect x="30" y="20" width="40" height="78" fill={fill} rx="2" />
        <rect x="30" y="20" width="40" height="78" fill="none" stroke="var(--ink)" strokeWidth="0.6" opacity="0.4" rx="2" />
        <rect x="33" y="26" width="1.5" height="66" fill="#fff" opacity="0.2" />
        <Label x="34" y="46" w="32" h="30" />
      </g>
    );
  }

  return (
    <svg width={size} height={size * 1.1} viewBox="0 0 100 110" style={{ transform: `rotate(${tilt}deg)`, filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.4))' }}>
      {body}
    </svg>
  );
};

window.Bottle = Bottle;
