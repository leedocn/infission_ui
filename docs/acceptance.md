# 验收记录 / Acceptance Record

**审计日期 / Audit date:** 2026-10-01  
**范围 / Scope:** `infisson_ui`、Storybook、根目录 `index.html` 预览、文档与消费者构建。  
**证据原则 / Evidence rule:** 源码存在不等于视觉签核；自动化检查通过不等于人工视觉或屏幕阅读器验收通过。

## 交付边界 / Delivery boundary

清单登记 A01–A37、B01–B28、C01–C36，共 **101 个 ID**。A/B 条目已进入统一预览，C 条目由 workflow 组件和流程预览覆盖。演示数据均为虚构 fixture；不会连接真实上传、支付、政务门户、AI 或通知服务。

The inventory contains 101 IDs: A01–A37, B01–B28, and C01–C36. A/B entries are in the unified preview and C entries are covered by workflow components and flow previews. Demo data is fictional fixture data; no real upload, payment, portal, AI, or notification service is connected.

## 自动检查 / Automated checks

| 检查 / Check | 当前证据 / Current evidence | 状态 / Status |
|---|---|---|
| `pnpm typecheck` | TypeScript no-emit completed | passed |
| `pnpm test -- --run` | Vitest: 23 files, 97 tests (current audit run) | passed |
| `pnpm docs:verify` | 101 bilingual component help files validated | passed |
| `pnpm coverage:verify` | 101 inventory IDs, 235 source exports, 101 indexed docs | passed |
| `pnpm copy:verify` | 71 implementation files scanned; blocked source/demo names absent | passed |
| Manifest asset check | Node byte/SHA assertion for `avatar-avery-chen.svg` matches `references/manifest.json` | passed |
| `pnpm build` | Library build and declaration generation completed | passed |
| `pnpm build:storybook` | Storybook static build completed with `/references` assets | passed |
| `pnpm preview:verify` | Current browser run: 37/28/36 preview tiles, 0 broken images, 0 page errors, 3 theme controls, and mobile table/row fit | passed |
| Theme palette smoke | 9 preview options (default plus eight named themes); selected navigation, action buttons, and inverse cards follow each brand/inverse token | passed |
| Portfolio stat auxiliary text | Dark and brand stat cards use local high-contrast auxiliary text tokens across the preview themes | passed |
| `pnpm test:consumer` | Tarball consumer TypeScript + Vite build | passed |
| `pnpm pack:library` | 27-file tarball; LICENSE/NOTICE included; test/config/reference assets excluded | passed |

The command results above are the current audit run. Re-run the applicable checks after any component or build change.

## 视觉与交互签核 / Visual and interaction sign-off

- `docs/component-inventory.md` is the source of truth for evidence. A01–A37 and B01–B28 remain `visual-pending`; a root preview and group tests do not replace tile-by-tile visual review.
- C01–C06, C08–C22, and C25–C36 carry observed video evidence in the inventory. C07 is `image-confirmed` for its motion column, while C23–C24 remain `implementation-proposal`; their timing and exact motion are not claimed to match the source video.
- Manual contrast, screen-reader, keyboard-only, responsive breakpoint, and performance checks remain open. Browser smoke checks cover loading, controls, dialogs, tabs, sidebar state, selection, and the 101 preview IDs, but do not close those manual gates.

清单中的 `image-confirmed` 只证明静态参考中可见；`video-confirmed` 只证明已记录的视频观察点。未核对的细节必须继续标为 `not-verified`。

## Acceptance decision / 验收结论

当前仓库可作为可复现的组件与演示审计基线，不能标记为“所有视觉差异已关闭”或“可发布”。下一步是逐个记录 A/B 的人工视觉结果、补齐开放的无障碍/对比度检查，并在发布前重新执行消费者构建和打包检查。

The repository is a reproducible component and demo audit baseline. It is not yet an assertion that all visual differences are closed or that the package is ready to publish. The next gate is per-tile A/B visual review and open accessibility/contrast checks; the current consumer and packaging checks have passed.
