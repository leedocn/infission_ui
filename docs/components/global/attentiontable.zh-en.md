# AttentionTable / AttentionTable

> Reference ID: **A19** · 03 · 3.4

## 用途 / Purpose

Compact keyboard reachable rows for projects needing attention. The host supplies filtered rows; onRowClick opens the project or blocker. / 紧凑且可键盘访问的待关注项目行，宿主提供筛选后的数据，onRowClick 打开项目或阻塞项。

## 安装与导入 / Install and import

~~~bash
pnpm add infisson_ui
~~~

~~~tsx
import { AttentionTable, type AttentionRow } from "infisson_ui";
import "infisson_ui/styles.css";
~~~

## Props / 属性

| Prop | Type | Required | 中文说明 / English |
|---|---|---:|---|
| rows | AttentionRow[] | Yes | Filtered project rows / 已筛选项目行 |
| onRowClick | (row: AttentionRow) => void | No | Row entry callback / 行入口回调 |
| className | string | No | Extra class name / 附加类名 |

AttentionRow requires id, project, stage and blocker; address, risk (high | medium | low) and due are optional. / AttentionRow 必须有 id、project、stage、blocker；地址、风险、日期可选。

## 可复制调用 / Copyable usage

~~~tsx
return <AttentionTable
  rows={[{ id: "PL-2796", project: "42 Willow Loop", address: "Pine Hollow, PH",
    stage: "AHJ review", blocker: "Missing docs", risk: "high", due: "Oct 1" }]}
  onRowClick={(row) => openProject(row.id)}
/>;
~~~

## 状态与边界 / States and edge cases

- Rows are native buttons; empty rows expose an explicit status; missing address or due is shown as —. Filtering remains a host responsibility. / 行是原生按钮；空数据有明确状态；缺少地址或日期显示 —；筛选由宿主负责。
- A single user activation invokes each callback at most once; no external service is called. / 一次用户操作至多触发一次回调，不连接外部服务。

## 无障碍 / Accessibility

The section has a heading, row labels describe project and blocker, and risk includes text as well as color. / 分区有标题，行标签包含项目和阻塞项，风险同时提供文字和颜色。

## 主题与配图 / Theme and visual reference

~~~css
[data-infisson] {
  --inf-color-border: #e4e7ec; --inf-color-surface-muted: #f0f2f6; --inf-color-danger: #ef5b55;
}
~~~

![AttentionTable reference / AttentionTable 参考图](../../../references/infission/01_global_dashboard_projects.png)

The image confirms compact columns and risk/due separation; row hover is an implementation proposal. / 图片确认紧凑列和风险/日期分离；行悬停属于实现提案。

~~~mermaid
flowchart LR
  Rows --> Table --> Row[Keyboard activation] --> Host[onRowClick]
~~~

