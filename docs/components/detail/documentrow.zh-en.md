# DocumentRow / DocumentRow

> Reference ID: **B18** · 03 · 文档行与解剖

## 用途 / Purpose

`DocumentRow` is the reusable infission component mapped to `B18` in the reference board. It receives data through props and leaves routing, networking, permissions, payments, and business state to the consumer.

`DocumentRow` 是 `B18` 对应的可复用 infission 组件。组件通过 Props 接收数据并展示状态；路由、网络、权限、支付和业务状态由宿主项目负责。

## 安装与导入 / Install and import

```bash
pnpm add infisson_ui
```

```tsx
import { DocumentRow } from "infisson_ui";
import "infisson_ui/styles.css";
```

## Props / 属性

| Prop | Type | 中文说明 / English |
|---|---|---|
| `file` | `DocumentFile` | Required document data: `id`, `name`, optional size, owner, status, confidence, date and type. / 必填文档数据：`id`、`name`，以及可选的大小、所有者、状态、置信度、日期和类型。 |
| `onOpen` | `(file: DocumentFile) => void` | Makes the document name a keyboard-accessible open action. / 传入后文档名成为可键盘访问的打开操作。 |
| `onMenu` | `(file: DocumentFile) => void` | Shows the row’s functional more-actions control. / 传入后显示可触发回调的行操作按钮。 |
| `className` + native div props | `string` + `HTMLAttributes<HTMLDivElement>` | Root styling and semantics. / 根节点样式和语义。 |

`dist/index.d.ts` 是发布包的权威声明；组件变体沿用同一 Props 契约。/ `dist/index.d.ts` is the authoritative declaration shipped with the package; visual variants use the same Props contract.

## 可复制调用 / Copyable usage

```tsx
export function DocumentRowExample() {
  return (
    <section data-infisson aria-label="DocumentRow example">
      <DocumentRow
        file={{ id: "site", name: "Site Plan v3.pdf", size: "2.4 MB", status: "verified", confidence: 98 }}
        onOpen={(file) => console.log(file)}
        onMenu={(file) => console.log(file)}
        className="example-documentrow"
      />
    </section>
  );
}
```

For components with required data, pass the required fields listed above; callbacks remain owned by the host application. / 如果组件需要必填数据，请按上表传入；回调由宿主应用负责。

## 状态与边界 / States and edge cases

- Default, hover, focus-visible, active/selected, disabled, loading, error, and empty states are explicit where supported by the component Props.
- Missing or unknown data stays visible as an empty or pending state; it must not be represented as a successful result.
- Long labels, zero values, missing media, duplicate clicks, and narrow viewports are handled without breaking the surrounding layout.
- State changes are interruptible, and callbacks are not fired twice for one user action.
- Confidence uses semantic bands: `>=80` high (green), `50–79` medium (amber), and `<50` low (red); the numeric label remains available to assistive technology.

- 默认、悬停、可见焦点、激活/选中、禁用、加载、错误和空状态按组件 Props 显式表达。
- 缺失或未知数据保持为空或待处理状态，不能伪装成成功。
- 长标签、零值、缺少图片、重复点击和窄视口不能破坏布局。
- 状态切换可中断，一次用户动作不会重复触发回调。
- 置信度按语义分级：`>=80` 高（绿色）、`50–79` 中（琥珀色）、`<50` 低（红色）；数字标签仍提供给辅助技术。

## 无障碍 / Accessibility

- Keep native semantics and visible labels; color alone never communicates state.
- Interactive elements are keyboard reachable and show a visible `:focus-visible` indicator.
- Important updates use an appropriate status or live region; decorative icons are hidden from assistive technology.
- `prefers-reduced-motion: reduce` disables non-essential movement.

- 保留原生语义和可见标签，不能只依赖颜色表达状态。
- 交互元素可用键盘访问，并显示清晰的 `:focus-visible` 焦点指示。
- 重要更新使用合适的 status 或 live region，装饰图标对辅助技术隐藏。
- `prefers-reduced-motion: reduce` 会关闭非必要动效。

## 主题与配图 / Theme and visual reference

```css
[data-infisson] {
  --inf-color-brand: #c5f33e;
  --inf-color-surface-inverse: #111214;
}
```

![DocumentRow reference / DocumentRow 参考图](../../../references/infission/02_detail_documents_compliance.png)

图片是静态范围基线；视频中未逐帧确认的行为会标为 `implementation-proposal`。The image is the static scope baseline; motion not verified frame-by-frame remains `implementation-proposal`.

```mermaid
flowchart LR
  Props[Consumer props / 宿主 Props] --> State[Explicit state / 显式状态]
  State --> View[Accessible view / 可访问视图]
  View --> Event[Host callback / 宿主回调]
```
