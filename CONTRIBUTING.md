# Contributing to infisson_ui

All component changes must include the implementation, tests, inventory update, and a bilingual help file under `docs/components/`. The help file must include import and usage examples, a complete Props table, states and edge cases, accessibility behavior, theme tokens, and a reference image or diagram.

Before opening a pull request:

```bash
pnpm install
pnpm typecheck
pnpm test
pnpm build
pnpm test:consumer
```

Do not add reference assets to the npm package. Do not connect real payment, filing, messaging, AI, or external storage services in component code.
