import React, { useState, useEffect } from 'react';
import EventBus from 'shared/eventBus';

const S = {
  container: {
    background: '#1a1a2e',
    border: '1px solid #2d2d3f',
    borderRadius: '4px',
    padding: '1rem',
    position: 'sticky',
    top: '80px',
  },
  heading: {
    fontFamily: "'Press Start 2P', 'Courier New', monospace",
    color: '#00ff9d',
    fontSize: '0.65rem',
    marginBottom: '1rem',
    paddingBottom: '0.6rem',
    borderBottom: '1px solid #2d2d3f',
    textShadow: '0 0 6px #00ff9d44',
  },
  empty: {
    color: '#475569',
    fontSize: '0.72rem',
    textAlign: 'center',
    padding: '2rem 0',
    lineHeight: '2',
  },
  list: { listStyle: 'none', marginBottom: '0.75rem' },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.35rem 0',
    borderBottom: '1px solid #1e293b',
    fontSize: '0.68rem',
  },
  itemEmoji: { fontSize: '1rem', flexShrink: 0 },
  itemName: {
    flex: 1,
    color: '#cbd5e1',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    lineHeight: '1.4',
  },
  itemQty: {
    background: '#0f172a',
    color: '#00ff9d',
    border: '1px solid #00ff9d33',
    borderRadius: '3px',
    padding: '1px 5px',
    fontSize: '0.6rem',
    flexShrink: 0,
  },
  itemPrice: { color: '#ffd700', fontSize: '0.65rem', flexShrink: 0 },
  divider: {
    border: 'none',
    borderTop: '1px solid #2d2d3f',
    margin: '0.6rem 0',
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.75rem',
    fontSize: '0.78rem',
    fontWeight: 'bold',
  },
  totalLabel: { color: '#94a3b8' },
  totalValue: { color: '#ffd700' },
  clearBtn: {
    width: '100%',
    padding: '0.45rem',
    background: 'transparent',
    color: '#ff2e63',
    border: '1px solid #ff2e6355',
    borderRadius: '2px',
    fontSize: '0.6rem',
    fontFamily: "'Courier New', monospace",
    cursor: 'pointer',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    transition: 'background 0.15s, border-color 0.15s',
  },
};

export default function CartApp() {
  const [items, setItems] = useState([]);

  // Écouter PRODUCT_ADDED → mettre à jour le panier (ajout ou incrément de quantité)
  useEffect(() => {
    const wrapper = EventBus.on('PRODUCT_ADDED', (product) => {
      setItems(prev => {
        const existing = prev.find(i => i.id === product.id);
        if (existing) {
          return prev.map(i =>
            i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
          );
        }
        return [...prev, { ...product, quantity: 1 }];
      });
    });
    return () => EventBus.off('PRODUCT_ADDED', wrapper);
  }, []);

  // Émettre CART_UPDATED à chaque changement du panier (y compris au montage : count = 0)
  useEffect(() => {
    const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const count = items.reduce((sum, i) => sum + i.quantity, 0);
    EventBus.emit('CART_UPDATED', { items, total, count });
  }, [items]);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div style={S.container}>
      <h2 style={S.heading}>🛒 Panier ({count})</h2>

      {items.length === 0 ? (
        <p style={S.empty}>Votre panier<br />est vide 🎮</p>
      ) : (
        <>
          <ul style={S.list}>
            {items.map(item => (
              <li key={item.id} style={S.item}>
                <span style={S.itemEmoji}>{item.emoji}</span>
                <span style={S.itemName}>{item.name}</span>
                <span style={S.itemQty}>×{item.quantity}</span>
                <span style={S.itemPrice}>{(item.price * item.quantity).toFixed(2)}€</span>
              </li>
            ))}
          </ul>
          <hr style={S.divider} />
          <div style={S.totalRow}>
            <span style={S.totalLabel}>Total</span>
            <span style={S.totalValue}>{total.toFixed(2)} €</span>
          </div>
          <button
            style={S.clearBtn}
            onClick={() => setItems([])}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#ff2e6318';
              e.currentTarget.style.borderColor = '#ff2e63';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = '#ff2e6355';
            }}
          >
            Vider le panier
          </button>
        </>
      )}
    </div>
  );
}
