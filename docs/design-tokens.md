# 设计变量 / Design Tokens

**来源 / Source:** [`packages/infisson_ui/src/tokens.css`](../packages/infisson_ui/src/tokens.css)  
**主题边界 / Theme boundary:** variables are scoped to `:root` and `[data-infisson]`; components consume semantic variables instead of repeating raw colors.

## 颜色 / Color

| Token | Value | 用途 / Use |
|---|---|---|
| `--inf-color-canvas` | `#f1f5f8` | 页面背景 / page canvas |
| `--inf-color-surface` | `#ffffff` | 卡片与控件 / cards and controls |
| `--inf-color-surface-muted` | `#f5f5f9` | 次级区块 / muted panels |
| `--inf-color-surface-inverse` | `#111214` | 深色操作面 / inverse actions |
| `--inf-color-on-surface-inverse` | `#ffffff` | 深色操作面文字 / text on inverse surfaces |
| `--inf-color-brand` | `#c5f33e` | 品牌强调 / brand accent |
| `--inf-color-on-brand` | `#13170c` | 品牌底色文字 / text on accent |
| `--inf-color-on-inverse-accent` | `#c5f33e` | 深色操作面上的强调内容 / accent on inverse surfaces |
| `--inf-color-text` | `#151619` | 主文字 / primary text |
| `--inf-color-text-muted` | `#73788a` | 辅助文字 / secondary text |
| `--inf-color-border` | `#e5e7ef` | 边框 / borders |
| `--inf-color-focus` | `#58720a` | 可见焦点 / focus ring |
| `--inf-color-success` / `--inf-color-success-surface` | `#356500` / `#eafaaf` | 成功状态 / success |
| `--inf-color-warning` / `--inf-color-warning-surface` | `#9a5300` / `#fff0c2` | 警告状态 / warning |
| `--inf-color-danger` / `--inf-color-danger-surface` | `#b42318` / `#ffe1de` | 错误状态 / danger |
| `--inf-color-submitted` / `--inf-color-submitted-surface` | `#4d35a4` / `#e8e0ff` | 已提交状态 / submitted |

## 几何、阴影与动效 / Geometry, shadow, motion

| Token | Value |
|---|---|
| `--inf-radius-control` | `12px` |
| `--inf-radius-card` | `18px` |
| `--inf-radius-dialog` | `24px` |
| `--inf-radius-pill` | `999px` |
| `--inf-shadow-card` | `0 2px 8px rgb(25 35 55 / 4%)` |
| `--inf-shadow-dialog` | `0 20px 60px rgb(15 20 30 / 18%)` |
| `--inf-motion-fast` | `140ms` |
| `--inf-motion-standard` | `220ms` |
| `--inf-font-sans` | `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif` |

The standalone preview may add a platform Segoe UI fallback for local rendering. That is a preview environment choice, not a second component token set.

## 使用与审计 / Usage and audit

Components should use semantic tokens for surfaces, text, borders, status, focus, radius, and motion. `--inf-color-focus` is reserved for `:focus-visible`; keyboard checks must remain part of component tests. Reduced-motion media queries disable or shorten transitions/animations in global and workflow styles.

这些值是实现基线，不是自动对比度认证。对比度矩阵、屏幕阅读器和不同字体环境仍需单独验收；修改 token 时必须重新运行类型、测试、构建和浏览器预览检查。

## 主题适配与组件级覆盖 / Theme adaptation and component overrides

主题只提供全局语义默认值；组件不应根据主题名称（例如“雅致朱红”或“青柠绿”）写条件分支。凡是文字直接放在 `--inf-color-brand`、`--inf-color-surface-inverse` 或其他强调 / 反色背景上，必须分别使用对应的 `--inf-color-on-brand`、`--inf-color-on-surface-inverse` 或 `--inf-color-on-inverse-accent`，不能回退到普通 `--inf-color-text`。

Themes provide global semantic defaults only; components must not branch on a theme name such as “Vermilion” or “Lime”. Text placed directly on `--inf-color-brand`, `--inf-color-surface-inverse`, or another accent/inverse surface must use the matching `--inf-color-on-brand`, `--inf-color-on-surface-inverse`, or `--inf-color-on-inverse-accent`; it must not fall back to ordinary `--inf-color-text`.

状态徽标放在普通或中性表面时，使用 `--inf-color-success`、`--inf-color-warning`、`--inf-color-danger` 等状态前景色；不要把仅适用于品牌底色的 `--inf-color-on-brand` 带到中性表面上。 / Status badges on ordinary or neutral surfaces use the status foreground tokens such as `--inf-color-success`, `--inf-color-warning`, and `--inf-color-danger`; do not carry the brand-surface `--inf-color-on-brand` onto a neutral surface.

需要某个组件单独配色时，覆盖该组件公开的语义变量，而不是修改全局品牌变量。背景和前景必须成对覆盖，以便主题切换仍保持可读性；如果只覆盖其中一个变量，组件会保留主题默认的另一半，可能产生对比度错误。当前全局组件的公开覆盖变量如下：

When one component needs an independent color, override that component's public semantic variables instead of changing the global brand token. Override background and foreground as a pair so the component remains readable when themes change. If only one side is overridden, the other side keeps the theme default and can create a contrast defect. The current global component override variables are:

| 组件 / Component | 背景 / Background | 前景 / Foreground | 深色辅助 / Dark auxiliary | 开关 / Switch |
|---|---|---|---|---|
| `PortfolioStats` brand tone | `--inf-global-stat-brand-bg` | `--inf-global-stat-brand-fg` | `--inf-global-stat-dark-bg`, `--inf-global-stat-dark-fg` | — |
| `AIRiskCard` | `--inf-global-risk-card-bg` | `--inf-global-risk-card-fg` | `--inf-global-risk-card-muted`, `--inf-global-risk-card-accent` | — |
| `SidebarAIWidget` | `--inf-global-ai-widget-bg` | `--inf-global-ai-widget-fg` | `--inf-global-ai-widget-muted`, `--inf-global-ai-widget-accent` | `--inf-global-ai-widget-switch-track-off`, `--inf-global-ai-widget-switch-track-on`, `--inf-global-ai-widget-switch-thumb` |
| `PackageComplianceCard` score surface | `--inf-global-compliance-score-bg` | `--inf-global-compliance-score-fg` | — | — |

示例（仅影响当前实例或宿主范围）：

Example (scoped to one instance or host):

~~~css
.custom-compliance-card {
  --inf-global-compliance-score-bg: #8b1e1e;
  --inf-global-compliance-score-fg: #fff8f3;
}
~~~

组件文档必须同时列出默认语义来源、可覆盖变量和覆盖后的可读性责任。变量覆盖不改变组件尺寸、布局或交互契约；它只改变该组件的颜色语义。

Component help must list the default semantic sources, public override variables, and the readability responsibility after an override. Variable overrides do not change a component's size, layout, or interaction contract; they change only that component's color semantics.
