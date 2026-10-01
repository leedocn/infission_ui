# ProjectStatusFilters / ProjectStatusFilters

> Reference ID: **A22** · 04 · 4.1

## 用途 / Purpose

Composable single selection filter group using tab semantics. The host owns project queries and count definitions. / 使用 tab 语义的单选筛选组，项目查询和计数口径由宿主负责。

## 安装与导入 / Install and import

~~~bash
pnpm add infisson_ui
~~~

~~~tsx
import { ProjectStatusFilters, type StatusFilterOption } from "infisson_ui";
import "infisson_ui/styles.css";
~~~

## Props / 属性

| Prop | Type | Required | 中文说明 / English |
|---|---|---:|---|
| options | StatusFilterOption[] | Yes | Label, value and optional count / 标签、值和可选数量 |
| value | string | No | Controlled selected value / 受控选中值 |
| defaultValue | string | No | Initial uncontrolled value; defaults to first / 非受控初始值，默认第一项 |
| onChange | (value: string) => void | No | Called once after selection / 选择后回调一次 |
| className | string | No | Extra class name / 附加类名 |

StatusFilterOption requires value and label; count is optional display data. / StatusFilterOption 必须有 value、label，count 为可选展示数据。

## 可复制调用 / Copyable usage

~~~tsx
return <ProjectStatusFilters
  options={[
    { value: "all", label: "All", count: 128 },
    { value: "risk", label: "At risk", count: 7 },
  ]}
  onChange={(status) => setStatus(status)}
/>;
~~~

## 状态与边界 / States and edge cases

- Only one option is selected; controlled consumers update value after onChange; empty options stay empty and never invent All. / 同时只有一个选项；受控用法回调后更新 value；空数组不虚构 All。
- A single user activation invokes each callback at most once; no external service is called. / 一次用户操作至多触发一次回调，不连接外部服务。

## 无障碍 / Accessibility

The group is a tablist; options are tabs with aria-selected and visible focus. / 组是 tablist，选项是带 aria-selected 和可见焦点的 tab。

## 主题与配图 / Theme and visual reference

~~~css
[data-infisson] {
  --inf-color-surface-inverse: #111214; --inf-color-border: #e4e7ec; --inf-color-brand: #c5f33e;
}
~~~

![ProjectStatusFilters reference / ProjectStatusFilters 参考图](../../../references/infission/01_global_dashboard_projects.png)

The image confirms the filter row and dark selected treatment; count refresh is a host responsibility. / 图片确认筛选行和深色选中；计数刷新由宿主负责。

~~~mermaid
flowchart LR
  Options --> Tabs --> Selection[aria-selected] --> Host[onChange]
~~~
