# 🕹️ RetroShop — Micro-Frontend Project

Boutique en ligne retro gaming construite avec **React** et **Webpack Module Federation**.

**Équipe :**
- David W.
- Antoine H.
- Thomas L.

---

## Architecture

Une page, 3 zones, 3 MFEs indépendants orchestrés par un Shell.

```
┌─────────────────────────────────────────────────┐
│  shell (port 3000) — orchestrateur              │
│  header + badge panier + lazy imports           │
├───────────────────────────┬─────────────────────┤
│  mfe-product (port 3001)  │  mfe-cart (3002)    │
│  grille de produits       │  panier latéral      │
│  bouton "Ajouter"         │  liste, total, vider │
└───────────────────────────┴─────────────────────┘
```

---

## Répartition des rôles

| Membre | MFE | Responsabilité |
|--------|-----|----------------|
| David W. | `shell`, `mfe-reco` | Webpack remotes, lazy imports, Suspense, ErrorBoundary, badge panier |
| Antoine H. | `mfe-product` | Webpack Module Federation, grille produits, emit `PRODUCT_ADDED` |
| Thomas L. | `mfe-cart` | Webpack Module Federation, écoute ajouts, emit `CART_UPDATED` |

---

## Contrat d'événements

> Phase 1 — négocié avant tout développement.

| Événement | Payload | Émetteur | Écouteurs |
|-----------|---------|----------|-----------|
| `PRODUCT_ADDED` | `{ id, name, price, emoji, genre }` | mfe-product | mfe-cart |
| `CART_UPDATED` | `{ items, total, count }` | mfe-cart | shell (badge), mfe-reco |

Communication via `window.CustomEvent` — tous les MFEs partagent le même `window`.

---

## Installation et lancement

```bash
# Terminal 1
cd .\mfe-product && npm install && npm start

# Terminal 2
cd .\mfe-cart && npm install && npm start

# Terminal 3
cd .\mfe-reco && npm install && npm start

# Terminal 3
cd .\shell && npm install && npm start
```

Ouvrir **http://localhost:3000**

---

## Structure du projet

```
microfrontend/
├── shared/
│   ├── eventBus.js       # pub/sub via window CustomEvent
│   └── products.js       # catalogue de 8 jeux retro
├── shell/                # port 3000
│   ├── webpack.config.js
│   └── src/
│       ├── App.js        # lazy imports + Suspense + badge
│       └── ErrorBoundary.js
├── mfe-product/          # port 3001
│   ├── webpack.config.js
│   └── src/ProductApp.js
└── mfe-cart/             # port 3002
    ├── webpack.config.js
    └── src/CartApp.js
```

---

## Checklist de validation

- [ ] Les 3 services démarrent sans erreur
- [ ] Cliquer "Ajouter" dans le catalogue ajoute l'article au panier
- [ ] Le badge du header affiche le bon nombre
- [ ] Vider le panier remet tout à zéro
- [ ] Un MFE hors-ligne ne casse pas le reste de la page

---

## Points techniques clés

- **`import('./bootstrap')`** dans chaque `index.js` : frontière de chunk obligatoire pour que webpack résolve les shared singletons avant d'exécuter du code React.
- **`singleton: true`** dans tous les `webpack.config.js` : une seule instance de React — sans ça, *Invalid hook call*.
- **`.catch()` sur chaque `React.lazy()`** dans le shell : fallback silencieux si un MFE est indisponible.
- **Cleanup dans chaque `useEffect`** : `return () => EventBus.off(event, wrapper)` pour éviter les memory leaks.

---

## Debug

| Symptôme | Cause probable |
|----------|---------------|
| Rien ne se passe au clic | Nom d'événement différent des deux côtés |
| "Loading..." infini | Mauvais port dans `remotes` du shell |
| "Invalid hook call" | `singleton: true` manquant dans `shared` |
| "Module does not exist" | Mauvaise clé dans `exposes` |
