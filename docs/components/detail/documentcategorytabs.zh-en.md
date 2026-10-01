# DocumentCategoryTabs / DocumentCategoryTabs

> Reference ID: **B13** · 03 · 分类标签

## 用途 / Purpose

`DocumentCategoryTabs` is the reusable infission component mapped to `B13` in the reference board. It receives data through props and leaves routing, networking, permissions, payments, and business state to the consumer.

`DocumentCategoryTabs` 是 `B13` 对应的可复用 infission 组件。组件通过 Props 接收数据并展示状态；路由、网络、权限、支付和业务状态由宿主项目负责。

## 安装与导入 / Install and import

```bash
pnpm add infisson_ui
```

```tsx
import { DocumentCategoryTabs } from "infisson_ui";
import "infisson_ui/styles.css";
```

## Props / 属性

| Prop | Type | 中文说明 / English |
|---|---|---|
| `categories` | `DocumentCategory[]` | Required category tabs; each item supports `key`, `label`, optional `count` and `disabled`. / 必填分类页签；条目支持 `key`、`label`，以及可选 `count`、`disabled`。 |
| `value` | `string` | Controlled selected key. / 受控选中 key。 |
| `defaultValue` | `string` | Initial key for uncontrolled usage. / 非受控初始 key。 |
| `onValueChange` | `(value: string) => void` | Called once when a category is selected; keyboard arrows skip disabled tabs. / 选择分类时触发一次；键盘方向键会跳过禁用页签。 |
| `className` + native div props | `string` + `HTMLAttributes<HTMLDivElement>` | Root styling and semantics. / 根节点样式和语义。 |

`dist/index.d.ts` 是发布包的权威声明；组件变体沿用同一 Props 契约。/ `dist/index.d.ts` is the authoritative declaration shipped with the package; visual variants use the same Props contract.

## 可复制调用 / Copyable usage

```tsx
export function DocumentCategoryTabsExample() {
  return (
    <section data-infisson aria-label="DocumentCategoryTabs example">
      <DocumentCategoryTabs
        categories={[{ key: "all", label: "All", count: 10 }, { key: "design", label: "Design", disabled: true }]}
        defaultValue="all"
        onValueChange={(value) => console.log(value)}
        className="example-documentcategorytabs"
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

- 默认、悬停、可见焦点、激活/选中、禁用、加载、错误和空状态按组件 Props 显式表达。
- 缺失或未知数据保持为空或待处理状态，不能伪装成成功。
- 长标签、零值、缺少图片、重复点击和窄视口不能破坏布局。
- 状态切换可中断，一次用户动作不会重复触发回调。

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

![DocumentCategoryTabs reference / DocumentCategoryTabs 参考图](../../../references/infission/02_detail_documents_compliance.png)

图片是静态范围基线；视频中未逐帧确认的行为会标为 `implementation-proposal`。The image is the static scope baseline; motion not verified frame-by-frame remains `implementation-proposal`.

```mermaid
flowchart LR
  Props[Consumer props / 宿主 Props] --> State[Explicit state / 显式状态]
  State --> View[Accessible view / 可访问视图]
  View --> Event[Host callback / 宿主回调]
```
