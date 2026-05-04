import React from 'react';
import EventBus from 'shared/eventBus';
import products from 'shared/products';

const S = {
  container: { padding: '0.25rem' },
  heading: {
    fontFamily: "'Press Start 2P', 'Courier New', monospace",
    color: '#00ff9d',
    fontSize: '0.85rem',
    marginBottom: '1.25rem',
    textShadow: '0 0 8px #00ff9d44',
    letterSpacing: '0.05em',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(175px, 1fr))',
    gap: '1rem',
  },
  card: {
    background: '#16213e',
    border: '1px solid #2d2d3f',
    borderRadius: '4px',
    overflow: 'hidden',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  cardImg: {
    width: '100%',
    height: '110px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '3rem',
  },
  cardBody: { padding: '0.75rem' },
  cardTitle: {
    fontSize: '0.68rem',
    fontWeight: 'bold',
    color: '#e2e8f0',
    marginBottom: '0.25rem',
    lineHeight: '1.4',
    minHeight: '2.8em',
  },
  genre: {
    fontSize: '0.58rem',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: '0.5rem',
  },
  price: {
    color: '#ffd700',
    fontSize: '0.88rem',
    fontWeight: 'bold',
    marginBottom: '0.7rem',
  },
  button: {
    width: '100%',
    padding: '0.4rem 0',
    background: '#00ff9d',
    color: '#0d0d1a',
    border: 'none',
    borderRadius: '2px',
    fontSize: '0.65rem',
    fontWeight: 'bold',
    fontFamily: "'Courier New', monospace",
    cursor: 'pointer',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    transition: 'background 0.15s, box-shadow 0.15s',
  },
};

export default function ProductApp() {
  const handleAdd = (product) => {
    EventBus.emit('PRODUCT_ADDED', {
      id:    product.id,
      name:  product.name,
      price: product.price,
      emoji: product.emoji,
      genre: product.genre,
    });
  };

  return (
    <div style={S.container}>
      <h2 style={S.heading}>Catalogue</h2>
      <div style={S.grid}>
        {products.map(product => (
          <div
            key={product.id}
            style={S.card}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#00ff9d44';
              e.currentTarget.style.boxShadow = '0 0 14px #00ff9d1a';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#2d2d3f';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ ...S.cardImg, background: product.color + '28' }}>
              {product.emoji}
            </div>
            <div style={S.cardBody}>
              <div style={S.cardTitle}>{product.name}</div>
              <div style={S.genre}>{product.genre}</div>
              <div style={S.price}>{product.price.toFixed(2)} €</div>
              <button
                style={S.button}
                onClick={() => handleAdd(product)}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#00e68a';
                  e.currentTarget.style.boxShadow = '0 0 10px #00ff9d55';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = '#00ff9d';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                + Ajouter
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
