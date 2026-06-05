# Hit The Component 🤖

Jogo estilo *Whack-a-Mole* com componentes técnicos. A cada ronda:

- 3 componentes aleatórios (de um catálogo de hardware, web, redes, etc.) aparecem em 3 dos 9 buracos.
- Surge uma **palavra/expressão alvo** no topo (ex.: "Resistência", "GPU", "Tailwind", "TCP").
- Tens ~1.1–1.9s para clicar **no componente que corresponde** à palavra.
  - ✅ Certo → +10 pontos (combo dá bónus)
  - ❌ Errado → −5 pontos e perdes 1 vida
  - ⏱️ Se não clicares a tempo → perdes 1 vida
- Começas com **3 vidas**. Quando acabam, game over.

## Como correr

```bash
cd projects/hit-the-component
npm install
npm run dev
```

Abre `http://localhost:5173`.

## Build de produção

```bash
npm run build
npm run preview
```

## Estrutura

- `src/main.js` — motor do jogo, estado, eventos, UI
- `src/components.js` — catálogo de componentes (ícone, label, aliases)
- `src/style.css` — estilo dark com gradientes e animações
- `index.html`, `vite.config.js` — boilerplate Vite

## Adicionar componentes

Edita `src/components.js` e adiciona um objeto ao array `COMPONENTS`:

```js
{ id: 'xyz', icon: '🧊', label: 'X', aliases: ['X', 'Y', 'Z'] }
```

`aliases` é a lista de palavras/expressões que podem surgir como alvo para esse componente.
