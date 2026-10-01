# AIRiskCard / AIRiskCard

> Reference ID: **A20** · 03 · 3.5

## 用途 / Purpose

Risk summary with a functional Review risks action. Activating it reveals all risk details and calls the optional host callback. / 风险摘要与可操作的 Review risks，点击后显示全部风险详情并调用可选回调。

## 安装与导入 / Install and import

~~~bash
pnpm add infisson_ui
~~~

~~~tsx
import { AIRiskCard } from "infisson_ui";
import "infisson_ui/styles.css";
~~~

## Props / 属性

| Prop | Type | Required | 中文说明 / English |
|---|---|---:|---|
| projectsAtRisk | number | Yes | Summary count / 风险项目数量 |
| risks | string[] | Yes | Reasons, all shown after review / 风险原因，展开后全部显示 |
| title | string | No | Card title, default infission AI / 卡片标题 |
| actionLabel | string | No | Closed action label / 收起状态文案 |
| onAction | () => void | No | Called once per toggle / 每次切换回调一次 |
| className | string | No | Extra class name / 附加类名 |



## 可复制调用 / Copyable usage

~~~tsx
return <AIRiskCard
  projectsAtRisk={7}
  risks={["Missing documents", "Review delay", "Install date conflict"]}
  onAction={() => trackRiskReview()}
/>;
~~~

## 状态与边界 / States and edge cases

- Closed state shows up to three reasons; open state shows every reason in a labelled region; empty risks show an explicit empty item. / 收起显示最多三条，展开显示全部；空风险显示明确空项。
- A single user activation invokes each callback at most once; no external service is called. / 一次用户操作至多触发一次回调，不连接外部服务。

## 无障碍 / Accessibility

aria-expanded, a labelled details region and a polite live status make the toggle understandable. / aria-expanded、带标签详情区域和 polite 状态区让切换可理解。

## 主题与配图 / Theme and visual reference

~~~css
[data-infisson] {
  --inf-color-surface-inverse: #111214; --inf-color-on-surface-inverse: #fff;
  --inf-global-risk-card-bg: var(--inf-color-surface-inverse);
  --inf-global-risk-card-fg: var(--inf-color-on-surface-inverse);
  --inf-global-risk-card-muted: color-mix(in srgb, var(--inf-global-risk-card-fg) 72%, transparent);
  --inf-global-risk-card-accent: var(--inf-color-on-inverse-accent);
  --inf-color-brand: #c5f33e;
}
~~~

The dark risk surface uses a paired background/foreground contract. Override `--inf-global-risk-card-bg` and `--inf-global-risk-card-fg` together; use `--inf-global-risk-card-muted` for secondary copy and `--inf-global-risk-card-accent` for the spark/accent mark. / 深色风险区域遵循背景/前景成对契约。覆盖时必须同时设置 `--inf-global-risk-card-bg` 与 `--inf-global-risk-card-fg`，辅助文字使用 `--inf-global-risk-card-muted`，闪光/强调标记使用 `--inf-global-risk-card-accent`。

![AIRiskCard reference / AIRiskCard 参考图](../../../references/infission/01_global_dashboard_projects.png)

The image confirms dark surface, bullets and Review risks; expanded details are an implementation proposal. / 图片确认深色表面、风险点和 Review risks；展开详情属于实现提案。

~~~mermaid
flowchart LR
  Closed -->|Review risks| Open[Risk details] ; Open -->|Hide risks| Closed
~~~
