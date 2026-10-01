# PortfolioStats / PortfolioStats

> Reference ID: **A17** · 03 · 3.2

## 用途 / Purpose

Display-only collection of independent metric cards. Values, details and tone come from data; metric selection is outside this component. / 展示型独立统计卡，数值、描述和色调均由数据传入，不提供统计项选择交互。

## 安装与导入 / Install and import

~~~bash
pnpm add infisson_ui
~~~

~~~tsx
import { PortfolioStats, type PortfolioStat } from "infisson_ui";
import "infisson_ui/styles.css";
~~~

## Props / 属性

| Prop | Type | Required | 中文说明 / English |
|---|---|---:|---|
| stats | PortfolioStat[] | Yes | Independent metric cards / 独立统计项 |
| className | string | No | Extra class name / 附加类名 |

PortfolioStat requires label and value; optional detail and tone (default | dark | brand). / PortfolioStat 必须有 label、value，可选 detail、tone。

## 可复制调用 / Copyable usage

~~~tsx
return <PortfolioStats stats={[
  { label: "Active projects", value: 128, detail: "7 this week", tone: "dark" },
  { label: "At risk", value: 7, detail: "needs action today" },
]} />;
~~~

## 状态与边界 / States and edge cases

- Display-only by design: no buttons or links. Empty arrays render an empty grid; zero and string values are preserved. / 明确为展示型，不渲染按钮或链接；空数组为空网格，0 和字符串值原样展示。
- A single user activation invokes each callback at most once; no external service is called. / 一次用户操作至多触发一次回调，不连接外部服务。

## 无障碍 / Accessibility

Use meaningful labels and values; cards do not masquerade as interactive controls. / 使用有意义的标签和值，不把统计卡伪装成控件。

## 主题与配图 / Theme and visual reference

~~~css
[data-infisson] {
  --inf-color-surface-inverse: #111214; --inf-color-on-surface-inverse: #fff;
  --inf-color-brand: #c5f33e; --inf-color-on-brand: #13170c;
  --inf-global-stat-dark-bg: var(--inf-color-surface-inverse);
  --inf-global-stat-dark-fg: var(--inf-color-on-surface-inverse);
  --inf-global-stat-brand-bg: var(--inf-color-brand);
  --inf-global-stat-brand-fg: var(--inf-color-on-brand);
  --inf-color-text-muted: #697386;
}
~~~

`dark` and `brand` tones use explicit background/foreground pairs, so a theme switch cannot make their labels inherit ordinary text color. To customize one stats instance, override the matching pair together (`--inf-global-stat-dark-bg` with `--inf-global-stat-dark-fg`, or `--inf-global-stat-brand-bg` with `--inf-global-stat-brand-fg`). / `dark` 和 `brand` 色调使用明确的背景/前景配对，切换主题时标签不会错误继承普通文字色。要单独定制某个统计实例，需同时覆盖对应的一对变量（`--inf-global-stat-dark-bg` 与 `--inf-global-stat-dark-fg`，或 `--inf-global-stat-brand-bg` 与 `--inf-global-stat-brand-fg`）。

~~~css
.custom-stat {
  --inf-global-stat-brand-bg: #8b1e1e;
  --inf-global-stat-brand-fg: #fff8f3;
}
~~~

![PortfolioStats reference / PortfolioStats 参考图](../../../references/infission/01_global_dashboard_projects.png)

The image confirms four independent cards and dark first-card emphasis; animated counters are not verified. / 图片确认四个独立统计卡和首卡深色强调；数字动画未被核对。

~~~mermaid
flowchart LR
  PortfolioStat[] --> Cards[Independent display cards]
~~~
