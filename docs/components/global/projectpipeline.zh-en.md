# ProjectPipeline / ProjectPipeline

> Reference ID: **A18** · 03 · 3.3

## 用途 / Purpose

Stage counts with proportional segments and an explicit Open action. Width is a visual strategy, not a business denominator claim. / 按阶段数量展示分段条并提供 Open 操作；宽度只是视觉策略，不代表业务分母。

## 安装与导入 / Install and import

~~~bash
pnpm add infisson_ui
~~~

~~~tsx
import { ProjectPipeline, type PipelineStage } from "infisson_ui";
import "infisson_ui/styles.css";
~~~

## Props / 属性

| Prop | Type | Required | 中文说明 / English |
|---|---|---:|---|
| stages | PipelineStage[] | Yes | Stage label, count and optional color / 阶段标签、数量和可选颜色 |
| averageLabel | string | No | Header summary / 顶部摘要 |
| actionLabel | string | No | Action text / 操作文案 |
| onAction | () => void | No | Open callback / 打开回调 |
| className | string | No | Extra class name / 附加类名 |

PipelineStage requires label and count; color is optional CSS color. / PipelineStage 必须有 label、count，可选 color。

## 可复制调用 / Copyable usage

~~~tsx
return <ProjectPipeline
  stages={[{ label: "Design", count: 32 }, { label: "Permit", count: 47 }]}
  averageLabel="Average approval 8.4 days"
  onAction={() => openPipeline()}
/>;
~~~

## 状态与边界 / States and edge cases

- Open is a real keyboard reachable button. Zero or negative counts keep a minimum segment; empty stages do not invent data. / Open 是可键盘访问的真实按钮；0 或负数仍保留最小分段；空数组不虚构阶段。
- A single user activation invokes each callback at most once; no external service is called. / 一次用户操作至多触发一次回调，不连接外部服务。

## 无障碍 / Accessibility

Stage names remain text and meaning never depends on color alone. / 阶段名始终是文字，不依赖单一颜色。

## 主题与配图 / Theme and visual reference

~~~css
[data-infisson] {
  --inf-color-brand: #c5f33e; --inf-color-surface-muted: #f0f2f6; --inf-color-text-muted: #697386;
}
~~~

![ProjectPipeline reference / ProjectPipeline 参考图](../../../references/infission/01_global_dashboard_projects.png)

The image confirms segmented bar, labels and Open; transition animation is an implementation proposal. / 图片确认分段条、标签和 Open；过渡动画属于实现提案。

~~~mermaid
flowchart LR
  Stages --> Bar[Segmented pipeline] ; Open --> Host[onAction]
~~~
