import React, { useState, useEffect, useMemo } from 'react';
import EventBus from 'shared/eventBus';
import products from 'shared/products';

const S = {
  container: { padding: '0.25rem 0' },
  heading: {
    fontFamily: "'Press Start 2P', 'Courier New', monospace",
    color: '#ff2e63',
    fontSize: '0.65rem',
    marginBottom: '1rem',
    textShadow: '0 0 8px #ff2e6344',
    letterSpacing: '0.04em',
  },
  grid: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  card: {
    background: '#16213e',
    border: '1px solid #2d2d3f',
    borderRadius: '4px',
    padding: '0.75rem',
    width: '150px',
    textAlign: 'center',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  emoji: { fontSize: '2.2rem', marginBottom: '0.4rem', display: 'block' },
  name: {
    fontSize: '0.6rem',
    color: '#cbd5e1',
    marginBottom: '0.35rem',
    lineHeight: '1.4',
    minHeight: '2.8em',
  },
  genre: {
    fontSize: '0.52rem',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: '0.3rem',
  },
  price: { color: '#ffd700', fontSize: '0.72rem', fontWeight: 'bold' },
  button: {
    width: '100%',
    marginTop: '0.6rem',
    padding: '0.35rem 0',
    background: '#ff2e63',
    color: '#fff',
    border: 'none',
    borderRadius: '2px',
    fontSize: '0.58rem',
    fontWeight: 'bold',
    fontFamily: "'Courier New', monospace",
    cursor: 'pointer',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    transition: 'background 0.15s, box-shadow 0.15s',
  },
};

export default function RecoApp() {
  const [cartItems, setCartItems] = useState([]);

  // Écouter CART_UPDATED pour adapter les recommandations au contenu du panier
  useEffect(() => {
    const wrapper = EventBus.on('CART_UPDATED', ({ items }) => setCartItems(items));
    return () => EventBus.off('CART_UPDATED', wrapper);
  }, []);

  const recommendations = useMemo(() => {
    const cartIds    = new Set(cartItems.map(i => i.id));
    const cartGenres = new Set(cartItems.map(i => i.genre));

    return products
      .filter(p => !cartIds.has(p.id))            // exclure déjà dans le panier
      .sort((a, b) => {
        // favoriser le même genre que les articles du panier
        const aScore = cartGenres.has(a.genre) ? 1 : 0;
        const bScore = cartGenres.has(b.genre) ? 1 : 0;
        return bScore - aScore;
      })
      .slice(0, 4);
  }, [cartItems]);

  return (
    <div style={S.container}>
      <h2 style={S.heading}>⭐ Les joueurs achètent aussi</h2>
      <div style={S.grid}>
        {recommendations.map(p => (
          <div
            key={p.id}
            style={S.card}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#ff2e6344';
              e.currentTarget.style.boxShadow = '0 0 10px #ff2e6318';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#2d2d3f';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <span style={S.emoji}>{p.emoji}</span>
            <div style={S.name}>{p.name}</div>
            <div style={S.genre}>{p.genre}</div>
            <div style={S.price}>{p.price.toFixed(2)} €</div>
            <button
              style={S.button}
              onClick={() => EventBus.emit('PRODUCT_ADDED', {
                id:    p.id,
                name:  p.name,
                price: p.price,
                emoji: p.emoji,
                genre: p.genre,
              })}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#e0284f';
                e.currentTarget.style.boxShadow = '0 0 10px #ff2e6355';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = '#ff2e63';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              + Ajouter
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
