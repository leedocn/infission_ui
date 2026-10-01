# TimeRangeControl / TimeRangeControl

> Reference ID: **A15** · 02 · 2.7

## 用途 / Purpose

Interactive time filter for Today / 7 days / 30 days. The host decides how the selected range refreshes statistics. / 交互式时间筛选，宿主决定选中范围后如何刷新统计。

## 安装与导入 / Install and import

~~~bash
pnpm add infisson_ui
~~~

~~~tsx
import { TimeRangeControl } from "infisson_ui";
import "infisson_ui/styles.css";
~~~

## Props / 属性

| Prop | Type | Required | 中文说明 / English |
|---|---|---:|---|
| options | TimeRangeOption[] | No | Options with value and label; defaults to Today, 7 days, 30 days / 时间选项，默认 Today、7 days、30 days |
| value | string | No | Controlled selected value / 受控选中值 |
| defaultValue | string | No | Initial uncontrolled value, defaults to the second option / 非受控初始值，默认第二项 |
| onChange | (value: string) => void | No | Called once after selection / 选择后回调一次 |
| className | string | No | Extra class name / 附加类名 |

TimeRangeOption has value: string and label: string. / TimeRangeOption 包含 value 和 label。

## 可复制调用 / Copyable usage

~~~tsx
function DashboardRange() {
  const [range, setRange] = useState("7-days");
  return <TimeRangeControl value={range} onChange={setRange} />;
}
~~~

## 状态与边界 / States and edge cases

- 7 days is the default; controlled consumers update value after onChange; an empty options array stays empty. Each option is a native button with aria-pressed. / 默认选中 7 days；受控用法在回调后更新 value；空数组保持空分组。每个选项是带 aria-pressed 的原生按钮。
- A single user activation invokes each callback at most once; no external service is called. / 一次用户操作至多触发一次回调，不连接外部服务。

## 无障碍 / Accessibility

The group has an accessible label and keyboard reachable buttons with visible focus. / 控件组有可访问名称，按钮可键盘操作且有可见焦点。

## 主题与配图 / Theme and visual reference

~~~css
[data-infisson] {
  --inf-color-brand: #c5f33e; --inf-color-surface-inverse: #111214;
}
~~~

![TimeRangeControl reference / TimeRangeControl 参考图](../../../references/infission/01_global_dashboard_projects.png)

The image confirms labels and the selected treatment; query loading animation is an implementation proposal. / 图片确认标签和选中样式；查询加载动效属于实现提案。

~~~mermaid
flowchart LR
  User --> State[aria-pressed] --> Callback[onChange] --> Host
~~~
