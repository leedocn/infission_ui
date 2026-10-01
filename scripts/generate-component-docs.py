from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
INVENTORY = ROOT / "docs" / "component-inventory.md"
SOURCE = ROOT / "packages" / "infisson_ui" / "src"
IMAGES = {
    "A": "../../references/infission/01_global_dashboard_projects.png",
    "B": "../../references/infission/02_detail_documents_compliance.png",
    "C": "../../references/infission/03_workflows_submission_feedback.png",
}
ALIASES = {
    "A01": "BrandLogo", "A02": "WorkspaceSwitcher", "A03": "NavGroup",
    "A04": "NavItem", "A05": "NavItem", "A06": "NavItem",
    "A07": "SidebarAIWidget", "A08": "UserProfileCard", "A09": "SearchField",
    "A10": "NotificationButton", "A11": "DarkActionButton", "A12": "OutlineActionButton",
    "A13": "StatusBadge", "A14": "FilterChip", "A15": "TimeRangeControl",
    "A16": "ProjectHeroCard", "A17": "PortfolioStats", "A18": "ProjectPipeline",
    "A19": "AttentionTable", "A20": "AIRiskCard", "A21": "PackageComplianceCard",
    "A22": "ProjectStatusFilters", "A23": "JurisdictionFilter", "A24": "ProjectTypeFilter",
    "A25": "ViewToggle", "A26": "ProjectCard", "A27": "ProjectCard", "A28": "ProjectCard",
    "A29": "ProjectCard", "A30": "ProjectCard", "A31": "StatusPillSet", "A32": "RiskBadge",
    "A33": "LinearProgress", "A34": "IconButtonSet", "A35": "CountBadge",
    "A36": "CompactProjectRow", "A37": "CardFooterActions",
    "C01": "AIFixDialog", "C02": "Dialog", "C03": "Dialog", "C04": "ChangeList",
    "C05": "VersionIndicator", "C06": "ApprovalOptions", "C07": "VersionHistoryHint",
    "C08": "Button", "C09": "Button", "C10": "PackageSubmitPanel", "C11": "PackageReadyBanner",
    "C12": "PackageContentList", "C13": "AIFinalCheckCard", "C14": "SubmissionTargetCard",
    "C15": "BeforeSubmitChecklist", "C16": "Button", "C17": "Button",
    "C18": "SubmitConfirmationDialog", "C19": "SubmissionSummary", "C20": "ConnectionStatusBadge",
    "C21": "SubmissionConfirmations", "C22": "SubmissionDialogActions", "C23": "SubmissionProgressOverlay",
    "C24": "Button", "C25": "WorkflowBadge", "C26": "SubmissionSuccessPanel", "C27": "DecisionSummary",
    "C28": "SubmissionTargetCard", "C29": "NotificationReceiptCard", "C30": "NextStepsPanel",
    "C31": "WorkflowBadge", "C32": "WorkflowBadge", "C33": "WorkflowBadge", "C34": "WorkflowBadge",
    "C35": "WorkflowBadge", "C36": "WorkflowBadge",
}

def source_text(component: str) -> str:
    for path in [SOURCE / "global" / "index.tsx", SOURCE / "detail" / "detail.tsx", SOURCE / "workflow" / "types.ts"]:
        if path.exists() and component in path.read_text(encoding="utf-8"):
            return path.read_text(encoding="utf-8")
    for path in [SOURCE / "button.tsx", SOURCE / "badge.tsx", SOURCE / "tabs.tsx", SOURCE / "dialog.tsx", SOURCE / "score-gauge.tsx"]:
        if path.exists() and component in path.read_text(encoding="utf-8"):
            return path.read_text(encoding="utf-8")
    return ""

def props_for(component: str):
    text = source_text(component)
    match = re.search(r"export interface " + re.escape(component) + r"Props[^\{]*\{", text)
    if not match:
        return [("component-specific props", "see dist/index.d.ts", "完整类型见发布包声明 / see the package declaration")]
    start = match.end()
    depth = 1
    end = start
    while end < len(text) and depth:
        if text[end] == "{": depth += 1
        elif text[end] == "}": depth -= 1
        end += 1
    body = text[start:end - 1]
    rows = []
    for field, optional, typ in re.findall(r"(?:^|\n)\s*([A-Za-z][\w]*)\s*(\?)?\s*:\s*([^;\n]+)", body):
        rows.append((field + ("?" if optional else ""), typ.strip(), "组件 API 字段 / component API field"))
    return rows or [("component-specific props", f"{component}Props", "完整类型见发布包声明 / see the package declaration")]

def parse_rows():
    result = []
    for line in INVENTORY.read_text(encoding="utf-8").splitlines():
        match = re.match(r"\| (A\d+|B\d+|C\d+) \| `?([^|]+?)`? \| `?([^|]+?)`? \| `?([^|]+?)`? \|", line)
        if match:
            ident, area, region, label = [x.strip().strip("`") for x in match.groups()]
            result.append((ident, region, label, ALIASES.get(ident, label.split("·")[0].strip())))
    return result

def make_doc(ident, region, label, component):
    area = ident[0]
    slug = re.sub(r"[^a-z0-9]+", "-", label.lower()).strip("-") or component.lower()
    rows = props_for(component)
    props = "\n".join(f"| `{name}` | `{typ}` | {desc} |" for name, typ, desc in rows)
    return f'''# {label} / {component}

> Reference ID: **{ident}** · {region}

## 用途 / Purpose

`{component}` is the reusable infission component mapped to `{ident}` in the reference board. It receives data through props and leaves routing, networking, permissions, payments, and business state to the consumer.

`{component}` 是 `{ident}` 对应的可复用 infission 组件。组件通过 Props 接收数据并展示状态；路由、网络、权限、支付和业务状态由宿主项目负责。

## 安装与导入 / Install and import

```bash
pnpm add infisson_ui
```

```tsx
import {{ {component} }} from "infisson_ui";
import "infisson_ui/styles.css";
```

## Props / 属性

| Prop | Type | 中文说明 / English |
|---|---|---|
{props}

`dist/index.d.ts` 是发布包的权威声明；组件变体沿用同一 Props 契约。/ `dist/index.d.ts` is the authoritative declaration shipped with the package; visual variants use the same Props contract.

## 可复制调用 / Copyable usage

```tsx
export function {component}Example() {{
  return (
    <section data-infisson aria-label="{component} example">
      <{component} className="example-{slug}" />
    </section>
  );
}}
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
[data-infisson] {{
  --inf-color-brand: #c5f33e;
  --inf-color-surface-inverse: #111214;
}}
```

![{component} reference / {component} 参考图]({IMAGES[area]})

图片是静态范围基线；视频中未逐帧确认的行为会标为 `implementation-proposal`。The image is the static scope baseline; motion not verified frame-by-frame remains `implementation-proposal`.

```mermaid
flowchart LR
  Props[Consumer props / 宿主 Props] --> State[Explicit state / 显式状态]
  State --> View[Accessible view / 可访问视图]
  View --> Event[Host callback / 宿主回调]
```
'''

def main():
    rows = parse_rows()
    for ident, region, label, component in rows:
        folder = {"A": "global", "B": "detail", "C": "workflow"}[ident[0]]
        target = ROOT / "docs" / "components" / folder
        target.mkdir(parents=True, exist_ok=True)
        slug = re.sub(r"[^a-z0-9]+", "-", label.lower()).strip("-") or component.lower()
        (target / f"{slug}.zh-en.md").write_text(make_doc(ident, region, label, component), encoding="utf-8")
    for prefix, title, folder in [("A", "Global dashboard components / 全局仪表盘组件", "global"), ("B", "Project detail components / 项目详情组件", "detail"), ("C", "Workflow components / 工作流组件", "workflow")]:
        lines = [f"# {title}\n", "每个映射条目都有独立的中英文帮助文件、Props、调用、状态、无障碍和配图。Every mapped entry has its own bilingual help, Props, usage, states, accessibility notes, and reference image.\n", "| ID | Component / 组件 | Help |", "|---|---|---|"]
        for ident, region, label, component in rows:
            if ident.startswith(prefix):
                slug = re.sub(r"[^a-z0-9]+", "-", label.lower()).strip("-") or component.lower()
                lines.append(f"| {ident} | `{label}` | [{slug}.zh-en.md]({slug}.zh-en.md) |")
        (ROOT / "docs" / "components" / folder / "index.md").write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"generated {len(rows)} mapped component docs")

if __name__ == "__main__":
    main()
