# PackageComplianceCard / PackageComplianceCard

> Reference ID: **A21** · 03 · 3.6

## 用途 / Purpose

Bounded compliance score with independent package metrics. Header and footer actions toggle visible details and call the optional callback. / 有边界的合规分数与独立包统计，标题和底部操作会展开详情并调用可选回调。

## 安装与导入 / Install and import

~~~bash
pnpm add infisson_ui
~~~

~~~tsx
import { PackageComplianceCard } from "infisson_ui";
import "infisson_ui/styles.css";
~~~

## Props / 属性

| Prop | Type | Required | 中文说明 / English |
|---|---|---:|---|
| score | number | Yes | Compliance percentage clamped to 0–100 / 合规百分比限制在 0–100 |
| project | string | No | Project label / 项目名称 |
| checked | number | Yes | Checked count / 已检查数 |
| flagged | number | Yes | Flagged count / 标记数 |
| rejected | number | Yes | Rejected percentage / 拒绝百分比 |
| actionLabel | string | No | Closed action label / 收起状态文案 |
| onAction | () => void | No | Called once per toggle / 每次切换回调一次 |
| className | string | No | Extra class name / 附加类名 |



## 可复制调用 / Copyable usage

~~~tsx
return <PackageComplianceCard
  score={94} project="18 Meridian Way" checked={1184} flagged={31} rejected={0.8}
  onAction={() => openPackageReview()}
/>;
~~~

## 状态与边界 / States and edge cases

- Scores are clamped; metrics remain independent; either action opens the same details region; no filing or payment occurs. / 分数会限制范围；统计保持独立；两个入口打开同一详情区域；不执行提交或支付。
- A single user activation invokes each callback at most once; no external service is called. / 一次用户操作至多触发一次回调，不连接外部服务。

## 无障碍 / Accessibility

The score has an accessible label, actions expose aria-expanded, and details/status are labelled regions. / 分数有可访问标签，操作暴露 aria-expanded，详情/状态都有标签。

## 主题与配图 / Theme and visual reference

~~~css
[data-infisson] {
  --inf-color-brand: #c5f33e; --inf-color-on-brand: #13170c;
  --inf-global-compliance-score-bg: var(--inf-color-brand);
  --inf-global-compliance-score-fg: var(--inf-color-on-brand);
  --inf-color-surface-muted: #f0f2f6; --inf-color-border: #e4e7ec;
}
~~~

The score surface uses the paired `--inf-global-compliance-score-bg` and `--inf-global-compliance-score-fg` variables, which default to the theme's brand/on-brand pair. Override both together in a host or instance scope when this component needs a custom color; this does not change its dimensions or layout. / 分数区域使用成对的 `--inf-global-compliance-score-bg` 和 `--inf-global-compliance-score-fg`，默认分别取主题的品牌色和品牌底色文字。组件需要单独配色时，应在宿主或实例作用域同时覆盖两个变量；这不会改变组件尺寸或排版。

~~~css
.custom-compliance-card {
  --inf-global-compliance-score-bg: #8b1e1e;
  --inf-global-compliance-score-fg: #fff8f3;
}
~~~

![PackageComplianceCard reference / PackageComplianceCard 参考图](../../../references/infission/01_global_dashboard_projects.png)

The image confirms green score surface and metrics; exact gauge tick geometry uses the shared primitive. / 图片确认绿色分数区域和统计；精确刻度由共享原语实现。

~~~mermaid
flowchart LR
  Score --> Card ; Action --> Details --> Callback
~~~

