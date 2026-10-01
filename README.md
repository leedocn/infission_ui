# infisson_ui

`infisson_ui` 是一个私有、可安装的 React + TypeScript 组件库，视觉基线来自项目中的三张 infission 组件拆解参考图，视频只作为已核对动效的补充证据。仓库采用 Apache-2.0；当前包和仓库均保持私有，不会在没有授权的情况下发布。

`infisson_ui` is a private, installable React + TypeScript component library. Its visual baseline comes from the three infission component reference boards in this repository; the video is used only as evidence for motion that has been verified. The repository uses Apache-2.0. The package and repository remain private until an explicit release authorization is provided.

## 安装 / Install

```bash
# 从仓库生成可安装的私有 tarball
pnpm pack:library
pnpm add ./infisson_ui-0.1.0.tgz
```

```tsx
import { Badge, Button, Dialog, ScoreGauge, Tabs } from "infisson_ui";
import "infisson_ui/styles.css";

export function Example() {
  return (
    <div data-infisson>
      <Badge tone="success" dot>On track</Badge>
      <Button variant="brand">Open project</Button>
      <ScoreGauge value={87} label="Compliance" />
    </div>
  );
}
```

`data-infisson` 是可选的主题边界；组件样式使用 `inf-` 类名前缀和 `--inf-*` 设计变量，不要求宿主项目安装 Tailwind。

`data-infisson` is an optional theme boundary. Component styles use the `inf-` class prefix and `--inf-*` design tokens; consumer projects do not need Tailwind.

## 预览主题 / Preview themes

根目录预览的三个分区共用同一个主题选择器，默认值是原始色，另外提供八套参考配色。选择器只改变预览作用域的 `--inf-*` 变量；组件包仍由宿主通过 `[data-infisson]` 或其他局部作用域覆盖变量。

The three preview sections share one theme selector. The default keeps the original palette and eight named palettes provide the supplied color directions. The selector only changes preview-scoped `--inf-*` variables; consumers can override the same tokens on `[data-infisson]` or another local scope.

| 预览选项 / Preview option | 主色 / Brand | 深色面 / Inverse surface |
| --- | --- | --- |
| 默认 · 原始色 / Default | `#c5f33e` | `#111214` |
| 青柠绿 / Lime green | `#84cc16` | `#0f172a` |
| 玫瑰摩卡 / Rose mocha | `#c86b85` | `#8e4b61` |
| 薄荷青岩 / Mint slate | `#46c2b2` | `#2e7d73` |
| 雅致朱红 / Vermilion | `#af3e3e` | `#8b1e1e` |
| 意式经典 / Italian classic | `#cdc7b1` | `#1d331e` |
| 少女之心 / Rose heart | `#d94893` | `#8f174f` |
| 低奢商务 / Champagne gold | `#d4af7c` | `#886f47` |
| 高级静奢 / Jade green | `#18a979` | `#0f3a32` |

## 双语帮助 / Bilingual help

每个已完成组件必须有中英文帮助文件，其中包含 Props 表、可复制调用、状态、无障碍、主题和配图：

Every completed component must have a bilingual help file with a Props table, copyable usage, states, accessibility, theming, and an image:

- [组件帮助索引 / Component help index](docs/components/README.md)
- [Button](docs/components/button.zh-en.md)
- [Badge](docs/components/badge.zh-en.md)
- [Tabs](docs/components/tabs.zh-en.md)
- [Dialog](docs/components/dialog.zh-en.md)
- [ScoreGauge](docs/components/score-gauge.zh-en.md)

三张原始参考图和视频位于 [`references/`](references/reference-map.md)，不会进入 npm 产物。

The three source reference boards and video live under [`references/`](references/reference-map.md) and are excluded from the npm artifact.

## 本地开发 / Local development

```bash
pnpm install
pnpm typecheck
pnpm test
pnpm build
pnpm test:consumer
```

`test:consumer` 会先生成包压缩包，再在工作区之外的临时消费项目中安装
该压缩包，执行 TypeScript 检查和 Vite 生产构建；它验证的是发布包边界，不是
源码 workspace 别名。

`test:consumer` builds and installs the tarball into a temporary consumer
outside the workspace, runs TypeScript checking, and then performs a Vite
production build. This validates the published package boundary rather than a
source workspace alias.

根目录的 [`index.html`](index.html) 是可直接双击打开的自包含预览，不是空的 Vite 入口壳。源码或组件条目变更后运行 `pnpm preview:update` 更新它；运行 `pnpm preview:verify` 会在 `file://` 下检查页面错误、图片加载和 A01–A37 / B01–B28 / C01–C36 的条目数量。

The root [`index.html`](index.html) is a self-contained preview that can be opened by double-clicking; it is not a blank Vite entry shell. Run `pnpm preview:update` after source or catalog changes, and `pnpm preview:verify` to check the `file://` page, image loading, and all A/B/C catalog IDs.

Storybook 使用同一份 `packages/infisson_ui/src` 源码：

```bash
pnpm storybook
pnpm build:storybook
pnpm docs:verify
```

Storybook uses the same `packages/infisson_ui/src` source as the preview. `docs:verify` validates all 101 bilingual component help files.

当前目标按图片分区实现 A01–A37、B01–B28、C01–C36，并逐项登记到 [`docs/component-inventory.md`](docs/component-inventory.md)。视频中未能确认的行为会标记为推测，不会冒充精确还原。

The current target covers A01–A37, B01–B28, and C01–C36 by reference-board area. Each item is tracked in [`docs/component-inventory.md`](docs/component-inventory.md). Video behavior that cannot be verified is marked as inferred rather than presented as an exact reproduction.

## 许可证 / License

代码采用 [Apache-2.0](LICENSE)。参考素材的来源与再发布边界见 [`references/manifest.json`](references/manifest.json)；参考素材仅用于开发核对。

Source code is licensed under [Apache-2.0](LICENSE). Provenance and redistribution boundaries for reference assets are documented in [`references/manifest.json`](references/manifest.json); the assets are for development verification only.
