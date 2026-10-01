# 依赖决策 / Dependency Decisions

**记录日期 / Recorded:** 2026-10-01  
**锁定方式 / Locking:** root `package.json`, `packages/infisson_ui/package.json`, and `pnpm-lock.yaml` are the install contract. The workspace uses pnpm 10.33.0.

## 实际依赖 / Actual dependencies

| 用途 / Purpose | Declared choice | Decision / Notes |
|---|---|---|
| UI/runtime | React `^19.1.1`, React DOM `^19.1.1` | Package peers support React `>=18.2.0 <20`. |
| Language | TypeScript `^5.9.2` | `tsc --noEmit` is the type gate. |
| Build | Vite `^7.1.7` | Library and preview use separate Vite configs. |
| Component docs | Storybook `^8.6.18`, React/Vite integration | Stories import the same package source used by the preview. |
| Unit tests | Vitest `^3.2.4` plus Testing Library/jsdom | Interaction tests are local and deterministic. |
| Browser checks | Playwright `1.58.2` | Used by the standalone preview verifier. |
| Package declarations | `vite-plugin-dts ^4.5.4` | Declaration files are copied into the tarball. |
| Build plugin | `@vitejs/plugin-react ^5.0.4` | React transform for Vite. |

## 与原规范的差异 / Difference from the implementation proposal

The specification lists Tailwind CSS v4, a Base UI/shadcn route, Motion, Lucide, MSW, and TanStack Table as possible technology routes. The current repository does **not** install those packages. It uses native HTML semantics in React, hand-authored CSS variables, SVG affordances, and CSS transitions/animations. This is an explicit current-state decision, not evidence that those libraries are present. Adding one later requires a separate dependency review and lockfile update; equivalent controls must not silently use a second UI system.

规范中的按需依赖（MSW、TanStack Table）目前没有异步真实接口或复杂表格需求，因此保持未安装。演示使用本地 fixture，不伪装成真实网络结果。

## 发布与边界 / Distribution boundary

- Package name is `infisson_ui`, license Apache-2.0, and package files are limited to `dist`, README, LICENSE, and NOTICE.
- React and React DOM stay peer dependencies so a host app owns the runtime.
- No external service, payment provider, portal, notification provider, or upload storage is included.
- The lockfile is authoritative for resolved versions. `pnpm test:consumer` installs the packed tarball outside workspace aliases; run it again before any release decision.
