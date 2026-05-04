import React, { useState, useEffect, Suspense } from 'react';
import ErrorBoundary from './ErrorBoundary';
import EventBus from 'shared/eventBus';

// .catch() : si le MFE est hors-ligne, on affiche un fallback au lieu de crasher.
const ProductApp = React.lazy(() =>
  import('mfe_product/ProductApp').catch(() => ({
    default: () => (
      <p style={S.unavailable}>Catalogue non disponible (port 3001 hors-ligne)</p>
    ),
  }))
);

const CartApp = React.lazy(() =>
  import('mfe_cart/CartApp').catch(() => ({
    default: () => (
      <p style={S.unavailable}>Panier non disponible (port 3002 hors-ligne)</p>
    ),
  }))
);

const RecoApp = React.lazy(() =>
  import('mfe_reco/RecoApp').catch(() => ({
    default: () => null, // mfe-reco optionnel : silence total si hors-ligne
  }))
);

const S = {
  app: {
    minHeight: '100vh',
    background: '#0d0d1a',
    color: '#e2e8f0',
    fontFamily: "'Courier New', Courier, monospace",
  },
  header: {
    background: '#1a1a2e',
    borderBottom: '3px solid #00ff9d',
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 2px 20px #00ff9d22',
  },
  logo: {
    fontFamily: "'Press Start 2P', 'Courier New', monospace",
    color: '#00ff9d',
    fontSize: '1.1rem',
    textShadow: '0 0 12px #00ff9d66',
    letterSpacing: '0.05em',
  },
  cartInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    fontSize: '0.85rem',
    color: '#94a3b8',
  },
  badge: {
    background: '#ff2e63',
    color: '#fff',
    borderRadius: '50%',
    width: '26px',
    height: '26px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    fontWeight: 'bold',
    boxShadow: '0 0 10px #ff2e6388',
    transition: 'transform 0.15s',
    flexShrink: 0,
  },
  main: {
    display: 'flex',
    gap: '1.5rem',
    padding: '1.5rem',
    alignItems: 'flex-start',
  },
  productSection: { flex: '1 1 0', minWidth: 0 },
  cartAside: { width: '280px', flexShrink: 0 },
  recoSection: {
    padding: '0 1.5rem 2.5rem',
    borderTop: '1px solid #2d2d3f',
    paddingTop: '1.5rem',
    marginTop: '0.5rem',
  },
  loading: {
    color: '#94a3b8',
    padding: '2rem',
    textAlign: 'center',
    fontSize: '0.8rem',
    letterSpacing: '0.1em',
  },
  unavailable: {
    color: '#94a3b8',
    fontSize: '0.75rem',
    padding: '1rem',
    fontStyle: 'italic',
  },
};

export default function App() {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const wrapper = EventBus.on('CART_UPDATED', ({ count }) => setCartCount(count));
    return () => EventBus.off('CART_UPDATED', wrapper);
  }, []);

  return (
    <div style={S.app}>
      <header style={S.header}>
        <h1 style={S.logo}>🕹️ RETRO SHOP</h1>
        <div style={S.cartInfo}>
          <span>Panier</span>
          <span style={{ ...S.badge, transform: cartCount > 0 ? 'scale(1.2)' : 'scale(1)' }}>
            {cartCount}
          </span>
        </div>
      </header>

      <main style={S.main}>
        <section style={S.productSection}>
          <ErrorBoundary>
            <Suspense fallback={<div style={S.loading}>Chargement du catalogue...</div>}>
              <ProductApp />
            </Suspense>
          </ErrorBoundary>
        </section>

        <aside style={S.cartAside}>
          <ErrorBoundary>
            <Suspense fallback={<div style={S.loading}>Chargement panier...</div>}>
              <CartApp />
            </Suspense>
          </ErrorBoundary>
        </aside>
      </main>

      <section style={S.recoSection}>
        {/* fallback={null} : tuer mfe-reco ne doit pas casser la page */}
        <ErrorBoundary fallback={null}>
          <Suspense fallback={<div style={S.loading}>Chargement recommandations...</div>}>
            <RecoApp />
          </Suspense>
        </ErrorBoundary>
      </section>
    </div>
  );
}
