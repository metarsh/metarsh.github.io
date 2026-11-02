# Contributing

Use the Node.js version in `.nvmrc` and install dependencies with `npm ci`.

Keep personal content in `src/config/portfolio.ts`, section presentation in
`src/components/sections`, and shared behavior in a hook or helper only when
multiple components need it. Prefer plain typed data and native HTML controls.

Comments should explain constraints or decisions that the code doesn't make
clear. Remove unused code instead of preserving speculative extension points.

Before submitting a change:

```sh
npm run format
npm run lint
npm run build
```

Check the affected behavior in a browser, including keyboard navigation and a
mobile viewport.
