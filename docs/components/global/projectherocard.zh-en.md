# ProjectHeroCard / ProjectHeroCard

> Reference ID: **A16** · 03 · 3.1

## 用途 / Purpose

Featured project image, status, address, progress and metadata. The open arrow calls onOpen; routing remains with the host. / 展示重点项目图片、状态、地址、进度和元数据；打开箭头调用 onOpen，路由由宿主负责。

## 安装与导入 / Install and import

~~~bash
pnpm add infisson_ui
~~~

~~~tsx
import { ProjectHeroCard, type ProjectHeroData } from "infisson_ui";
import "infisson_ui/styles.css";
~~~

## Props / 属性

| Prop | Type | Required | 中文说明 / English |
|---|---|---:|---|
| project | ProjectHeroData | Yes | Project data / 项目数据 |
| onOpen | (project: ProjectHeroData) => void | No | Open entry callback / 打开入口回调 |
| className | string | No | Extra class name / 附加类名 |

ProjectHeroData requires id and title; optional address, jurisdiction, imageSrc, status, progress and meta ({ label, value }[]). / ProjectHeroData 必须有 id、title，可选地址、辖区、图片、状态、进度和元数据。

## 可复制调用 / Copyable usage

~~~tsx
const project = {
  id: "PL-2841", title: "18 Meridian Way", address: "Nova Ridge, NR",
  status: "under-review", progress: 78,
  meta: [{ label: "Stage", value: "AHJ review" }],
};
return <ProjectHeroCard project={project} onOpen={(item) => navigate(item.id)} />;
~~~

## 状态与边界 / States and edge cases

- Missing image uses a neutral placeholder; missing optional fields are omitted; progress is clamped by LinearProgress. Only the open button navigates. / 缺少图片使用中性占位；缺少可选字段时省略；进度由 LinearProgress 限制范围。只有打开按钮触发导航。
- A single user activation invokes each callback at most once; no external service is called. / 一次用户操作至多触发一次回调，不连接外部服务。

## 无障碍 / Accessibility

The open entry is a labelled native button, progress is a progressbar, and decorative media uses empty alt text. / 打开入口是带标签的原生按钮，进度是 progressbar，装饰图片使用空 alt。

## 主题与配图 / Theme and visual reference

~~~css
[data-infisson] {
  --inf-color-brand: #c5f33e; --inf-radius-card: 1rem; --inf-shadow-card: 0 8px 24px rgb(17 18 20 / 8%);
}
~~~

![ProjectHeroCard reference / ProjectHeroCard 参考图](../../../references/infission/01_global_dashboard_projects.png)

The image confirms the covered media layer, status and bottom metadata; hover lift is an implementation proposal. / 图片确认覆盖式图片层、状态和底部元数据；悬停浮起属于实现提案。

~~~mermaid
flowchart LR
  Card --> Open[Open button] --> Host[onOpen(project)]
~~~

