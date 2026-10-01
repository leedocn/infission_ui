# infission 实施规范深度评估

**评估日期：** 2026-09-30  
**评估对象：** `INFISSION_CODEX_IMPLEMENTATION_SPEC.md` v1.3  
**修订结果：** v1.3（infission 品牌迁移版）

## 结论

原规范的总体方向可执行：它明确区分通用组件和 infission 业务组件，并明确将原始 Permitly 参考图迁移为 infission 产品品牌，要求使用同一份源码供 Storybook 与演示应用复用，并把静态参考、交互状态、流程状态和动效证据分开。主要问题是“方案完整”与“交付可核验”之间还缺少几道硬门槛。本轮已把这些门槛写入规范，并补齐素材与追踪文件。

本轮已经进入实现阶段：当前目录包含 React/TypeScript 组件包、统一独立预览、Storybook、双语帮助文件、测试和消费者构建验证。仍需把逐组件人工视觉验收和更多视频动效证据继续记录到清单中，因此不能把“源码存在”写成视觉验收通过。

## 发现与处理

| 优先级 | 发现 | 风险 | 已处理位置 |
|---|---|---|---|
| P0 | 最终交付形态与首次只做 P0–P1 容易被误读为同一范围 | 过早铺开页面，无法判断首轮是否完成 | 规范 0.5、12 节 P0/P1 |
| P0 | 规范引用 `manifest`、`component-inventory`、`reference-map`，但文件可能缺失 | 参考无法追溯，路径和哈希容易漂移 | 本目录已补齐三个文件；规范 0.5、4.6、14.3、18 |
| P0 | 101 条参考映射、实现状态和动效证据没有独立初始状态 | “代码存在”被误报为视觉 / 动效通过 | `docs/component-inventory.md`，规范 4.4–4.5、11.6 |
| P1 | 参考素材来源、传播边界、替换检测不明确 | 将开发素材误打进生产包或公开传播 | `references/manifest.json`、`reference-map.md`，规范 0.5、4.6 |
| P1 | 无障碍只写原则，缺少对比度、焦点、减动效的可执行门槛 | 绿色强调和深色卡片可能在实际组合中不可读 | 规范 5.7、11.3 |
| P1 | 错误、重试和结果未知虽有流程图，但没有统一错误分类与幂等要求 | 失败时丢输入或重复提交 | 规范 9.2、10.5 |
| P1 | 构建 / 测试 / 浏览器检查没有统一 `not-run` 与阻塞规则 | 缺环境时被误报为通过 | 规范 11.8、14.3 |
| P2 | 视频只在原则上要求补充动效，没有时间点证据结构 | 后续容易把猜测写成视频精准还原 | `references/reference-map.md`，规范 4.6、8.2、14.2 |
| P0 | 组件包可安装要求虽已列出，但缺少独立消费项目和 SSR / CSS 隔离的硬性验收 | 在 playground 可用、安装后却污染宿主或无法构建 | 规范 13.1–13.3 |
| P0 | 目标是开源下载 / 调用，但仓库治理、许可证、贡献规范和发布流水线未写成交付物 | 能在本地使用，却无法安全、可追踪地被其他项目安装升级 | 规范 13.4 |

## 保留的技术决策

- React + TypeScript + Vite、Tailwind CSS v4、CSS 语义变量、Storybook、Vitest、Playwright 的组合保持不变；依赖版本仍须在实现时锁定。
- Base UI 作为 shadcn/ui 底层路线继续保留，但实现时必须记录具体版本、初始化配置和导入方式，不能依赖 CLI 默认值。Base UI 官方定位为无样式、可组合、面向可访问性的 React 组件库，适合本项目的变量和样式隔离要求。
- `ProjectCard` 继续留在演示应用业务层；`Button`、`Badge`、`Tabs`、`Dialog`、`ScoreGauge` 等保持通用组件边界。
- 参考图中的示例数字继续视为独立演示快照，不能被拼成一个虚假的实时业务状态。

## 本轮已完成的文件级变更

- 将规范复制到项目根目录并升级为 v1.3，补充可安装包契约和独立消费验收矩阵。
- 将三张用户提供的原始 Permitly 图片复制到 `references/infission/`，按规范中的稳定文件名保存，并在实现规范中明确品牌迁移为 infission。
- 将视频复制到 `references/source/`，不转码。
- 生成 `references/manifest.json`，记录四份素材的大小、SHA-256 和媒体元数据。
- 生成 `docs/component-inventory.md`，包含 A01–A37、B01–B28、C01–C36 共 101 行初始追踪记录。
- 生成 `references/reference-map.md`，记录素材分工、证据等级和后续视频截帧格式。
- 添加根目录 `AGENTS.md`，只保留长期约束和规范入口，不替代完整规范。
- 建立 `packages/infisson_ui`，包名固定为 `infisson_ui`，许可证为 Apache-2.0，并导出 global/detail/workflow 组件与 CSS 变量。
- 建立根目录自包含 `index.html`：由 `pnpm preview:update` 生成，支持直接双击 `file://` 打开；`pnpm preview:verify` 已用 Playwright 验证 37 个 A、28 个 B、36 个 C 预览条目和无页面错误。
- 建立 `.storybook/` 与 `stories/`，Storybook 与演示预览共用包源码；`pnpm build:storybook` 已通过。
- 生成 101 个独立的中英文组件帮助文件，并以 `pnpm docs:verify` 校验安装、Props、调用、状态、无障碍、主题和配图章节。
- `pnpm typecheck`、`pnpm test`（23 files / 97 tests）、`pnpm build`、`pnpm test:consumer` 和 `pnpm pack:library` 已通过。

## 尚未完成且不应冒充完成

1. A/B 组件在 `docs/component-inventory.md` 中仍标记为 `visual-pending`：已进入统一根预览并通过组级测试，但还没有逐组件人工视觉签核。
2. 视频证据只对清单标记的 C01–C22、C25–C36 采用已观察结论；C23–C24 仍明确标为 `implementation-proposal`，不写成精确还原。
3. 当前有浏览器自动加载、交互点击和截图验证；对比度自动门禁、屏幕阅读器和性能基准仍需单独补齐。
4. 包已构建、打包并在 `tests/consumer-smoke` 独立消费者中构建通过；尚未发布到 npm 或 GitHub，符合未获授权不发布的约束。
5. 用户素材仍只作为仓库内开发参考保存，没有上传或公开发布。

## 下一步建议

后续应逐个把 A/B 条目的人工视觉结果和可核对的视频证据写回清单，并补齐对比度、键盘、屏幕阅读器和性能门禁。发布前仍要在真实干净项目中安装 tarball、检查 SSR/CSS 隔离和版本矩阵；未确认 npm scope 与 GitHub 组织名之前不发布。

## 官方资料核对

本次评估核对了以下官方资料的当前表述：

- [Base UI About](https://base-ui.com/react/overview/about)
- [Tailwind CSS Theme variables](https://tailwindcss.com/docs/theme)
- [shadcn/ui Base UI 更新说明](https://ui.shadcn.com/docs/changelog/2026-07-base-ui-default)
- [Storybook Vitest addon](https://storybook.js.org/docs/11/writing-tests/integrations/vitest-addon)

这些链接用于验证能力边界和文档入口；实际安装参数以实施时锁定的版本为准。

