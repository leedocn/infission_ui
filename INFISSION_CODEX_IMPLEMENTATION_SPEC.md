# infission 组件库：技术框架与实现方案

## Codex 执行规范 · 三张参考图对应版

> **版本：** v1.3（infission 品牌迁移版）  
> **日期：** 2026-09-30  
> **目标：** 依据用户指定的三张原始 Permitly 参考图建立 infission 组件库，将技术选型、组件结构、交互与动效实现方法整理成 Codex 可执行的开发规范，覆盖三张图登记的全部组件目标，并交付可复用组件库和完整演示应用。视频中已经核对的组件效果也纳入目标；未核对细节必须标记为推测。  
> **参考范围：** 图 01「全局框架 / 仪表盘 / 项目列表」、图 02「项目详情 / 文档中心 / 合规审查」、图 03「流程弹窗 / 提交流程 / 状态反馈」。
> **文档性质：** 技术方案与实施要求，不是新增设计图，也不是已完成的代码。静态外观与组件范围以这三张图为准；原视频用于补充动效。图片不能证明动画时长，本文未声明完成原视频逐帧审计。v1.2 已补充素材落位与哈希、交付文件一致性、浏览器与无障碍门槛、失败 / 未知结果处理、参考素材来源约束和首轮质量门禁；v1.3 将项目品牌统一迁移为 infission，并保留原始 Permitly 参考图的来源说明。

---

## 文档导航

| 需要做什么 | 阅读位置 |
|---|---|
| 确认目标、技术框架与项目目录 | 第 0–3 节 |
| 阅读本次评估结论与必须补充项 | 第 0.5 节、`docs/spec-review.md` |
| 核对三张参考图和 101 条映射 | 第 4、6 节、`docs/component-inventory.md` |
| 建立视觉变量和通用组件接口 | 第 5、7 节 |
| 实现动效、修复与提交流程 | 第 8–10 节 |
| 建立 Storybook、测试与阶段验收 | 第 11–14 节 |
| 校验素材、交付文件和质量门禁 | 第 4.6、10.5、11.8、14.3 节 |
| 复制首轮任务与长期指令 | 第 15–16 节 |
| 查阅官方技术文档 | 第 17 节 |

---

## 0. 给 Codex 的执行摘要

### 0.1 本项目要做什么

**项目身份固定为 infission 组件库。实现代码、演示文案和发布名称使用 infission；三张用户提供的原始图片保留其 Permitly 视觉作为参考，不把原品牌带入产品实现。**

建立 **“可复用组件库 + Storybook 组件展示 + 完整演示应用 + 自动化测试”**，而不是把视频画面拼成几个静态网页。

实现目标同时包含：

- **外观：** 布局、颜色、字体、间距、圆角、阴影、图标、图形与密度。
- **交互：** 搜索、筛选、切换、折叠、弹窗、上传、修复确认、提交与反馈。
- **动效：** 悬停与按压反馈、选中背景滑动、布局过渡、弹窗进出、进度变化和成功反馈。
- **工程能力：** 类型明确、状态完整、组件可独立使用、测试可重复执行。

### 0.2 默认技术路线

```text
React + TypeScript + Vite
Tailwind CSS v4 + CSS 设计变量
shadcn/ui 的 Base UI 路线
Motion + CSS 动画
Lucide + 自定义 SVG
Storybook + Vitest + Playwright
MSW：需要异步演示时加入
TanStack Table：实现复杂表格时加入
```

### 0.3 第一次执行范围

**用户没有另行指定范围时，首次只完成阶段 P0 与 P1，不要一次性铺开全部页面。**

1. 检查现有仓库、项目指令、运行环境和参考素材。
2. 建立组件与状态清单、参考映射和设计变量。
3. 建立组件包、演示应用、Storybook 与基础测试。
4. 实现六个样板组件：`Button`、`Badge`、`Tabs`、`Dialog`、`ProjectCard`、`ScoreGauge`。
5. 完成真实浏览器检查并报告结果，保留后续阶段清单。

`ProjectCard` 属于业务组件，初期放在演示应用中；它可以进入 Storybook，但不能因此被误放进通用 UI 包。

### 0.4 工作原则

- 先读取现有代码、`AGENTS.md` 和锁文件，再修改项目；不得擅自删除或重建现有工程。
- 使用项目既有包管理器；新仓库默认使用 pnpm，并提交锁文件。
- 先验证布局与交互，再加入动效；不能用动画掩盖布局问题。
- 本次用户指定的三张原始 Permitly 参考图确定组件范围和静态外观；实现时品牌替换为 infission；视频补充动效，冲突先记录，不擅自换回其他参考。
- 不接入真实付费、提交、邮件、AI 或存储服务，除非获得单独授权。
- 不把模拟成功描述为真实业务成功，不把未执行的检查写成通过。
- 无法完成某项时，提交已经完成的代码和准确的阻塞说明，不伪造实现或结果。

---

### 0.5 本次深度评估结论与必须补充项

v1.1 的核心方向可以保留：参考图负责静态范围，视频负责动效线索，组件按设计规范 / 基础组件 / 通用组合 / 业务流程分层。评估后需要把以下边界写死，避免规范在执行时产生歧义：

1. **阶段范围与最终交付分开。** 第 1 节描述的是最终形态；首次执行仍只做 P0–P1。P1 只需要可运行的组件包骨架、Storybook、六个样板及最小演示壳，不得把未实现的 P2–P5 页面算作已交付。
2. **本轮承诺的参考与追踪文件必须能在仓库中找到。** 本仓库现在补齐 `references/infission/`、`references/source/`、`references/manifest.json`、`references/reference-map.md`、`docs/component-inventory.md` 和 `docs/spec-review.md`；三张图片来自原始 Permitly 参考，开发实现统一换用 infission 品牌。路径、文件名、哈希不一致时，P0 视为阻塞。
3. **参考证据、实现状态、测试状态分离。** 图像只能证明静态可见内容；视频没有完成逐帧审计前，动效只能记为 `proposed` 或 `not-verified`。代码存在不能推导视觉或交互已通过。
4. **环境基线必须可复现。** 实施时记录 Node、pnpm、浏览器、操作系统、视口、DPR、字体和锁文件；缺少浏览器或依赖时写 `not-run`，不能写成通过。
5. **演示数据和外部行为必须可追溯。** 固定 fixture、模拟网络、请求 ID、幂等和结果未知状态均属于流程契约；不接入真实支付、政务门户、邮件、AI 或文件存储。
6. **参考素材只作为开发依据。** 三张图和视频由用户提供，保留来源与 SHA-256；默认不随生产构建发布、不上传第三方服务、不把素材中的示例机构或日期描述为真实事实。

本次评估的具体变更和未解决问题记录在 [`docs/spec-review.md`](docs/spec-review.md)，后续实现每次只更新与当前阶段相关的状态。

---

## 1. 产品目标、范围与边界

### 1.1 交付形态

最终交付同一仓库内的四部分：

| 交付物 | 内容 | 判断标准 |
|---|---|---|
| 通用组件包 | 设计变量、基础控件、通用组合组件 | 不依赖 infission 业务数据，可由其他 React 项目使用 |
| Storybook | 组件展示、参数说明、状态与边界场景 | 可以独立查看和操作每个组件 |
| 演示应用 | 仪表盘、项目、文档、审查、打包提交等界面 | 使用同一套组件源码，关键流程可完整操作 |
| 测试与文档 | 类型检查、组件测试、流程测试、截图回归、运行说明 | 命令可复现，结果真实记录 |

### 1.2 首版默认范围

首版以三张原始 Permitly 参考图所示的 **桌面 Web、浅灰页面底色、白色圆角容器、浅灰紫次级区块、黑色局部卡片、荧光绿色强调** 为视觉方向。

三张原始参考图是组件展板，不是应用整页截图。不得把展板的纵向比例、中文大标题、编号、说明卡和页脚当成产品页面布局。组件在 Storybook 中分别还原，再组装成桌面 Web 演示页面；原视频可辅助判断应用视口。

首版不要求完整移动端重设计，不默认添加暗色主题切换，不默认引入服务端渲染、账户体系、真实后端或云部署。

### 1.3 模拟与真实能力的区别

演示可以模拟上传、审查、修复、审批与提交，但以下能力不因前端界面完成而自动具备：

- 真实文件上传和持久化存储。
- 真实 AI 理解文档、修改文件或计算合规结论。
- 真实政务门户提交、支付、邮件通知与后台状态追踪。

演示环境应有统一的“模拟数据 / 演示模式”标记。模拟数据、日期、费用、机构名称和文案不得被当作真实业务事实。

---

## 2. 技术选型与依赖规则

### 2.1 选型表

| 职责 | 本项目选型 | 实施要求与依据 |
|---|---|---|
| 组件与应用 | React + TypeScript | 使用函数组件；公共接口明确类型；复杂局部状态可采用 reducer。参见 [React 状态组织][react-reducer] |
| 开发与构建 | Vite | 演示应用采用 Vite；发布组件包时采用库构建配置。参见 [Vite 库模式][vite-build] |
| 样式 | Tailwind CSS v4 + CSS 变量 | 统一主题变量，再组合布局；不在组件中散落重复颜色与尺寸。参见 [Tailwind 主题变量][tailwind-theme] |
| 交互基础 | shadcn/ui + Base UI | 使用可编辑的组件源码；复杂控件以统一的无预设样式交互底层实现。参见 [shadcn/ui][shadcn]、[Base UI][base-ui] |
| 动画 | Motion + CSS | CSS 处理简单反馈；Motion 处理布局、共享元素与进入退出。参见 [Motion 布局动画][motion-layout] |
| 图标与图形 | Lucide + 自定义 SVG | 图标体系统一；特殊标志、半圆仪表和刻度自行绘制。参见 [Lucide React][lucide] |
| 组件开发与展示 | Storybook | Stories 与演示页面引用同一份组件源码。参见 [Storybook React/Vite][storybook-vite] |
| 测试 | Vitest + Playwright | 组件交互测试与完整流程测试分工；截图测试单独配置。参见 [Storybook/Vitest][storybook-vitest]、[Playwright 截图][playwright-snapshots] |
| 模拟接口 | MSW，按需加入 | 为成功、失败、延迟与结果不确定场景提供可重复响应。参见 [MSW][msw] |
| 复杂表格 | TanStack Table，按需加入 | 需要排序、筛选、选择等逻辑时使用，不接管视觉样式。参见 [TanStack Table][tanstack-table] |

### 2.2 版本与兼容性

不要机械安装所有依赖的最新版本，也不要照抄旧教程中的安装参数。

实施前必须：

1. 读取已有 Node.js、包管理器和依赖版本约束。
2. 对照当前官方文档确认 React、Vite、Tailwind、Storybook、Vitest 与组件底层的兼容关系。
3. 为新仓库选定一组可配合使用的稳定版本，记录到 `docs/dependency-decisions.md`。
4. 使用锁文件固定安装结果；后续升级单独执行，不与视觉复刻混在一起。
5. 记录实际采用的 shadcn 底层、生成配置与导入方式。

**本项目选择 Base UI 是工程决策，不依赖“某个 CLI 版本默认选了什么”。** 新建项目应显式确认这条路线。

已有 Radix 项目不强行迁移；先评估复用成本并记录决策。不得无说明地混用 Base UI、Radix 与另一套成品 UI 库来实现同类控件。

shadcn 提供 Vite 项目的初始化与已有工程配置说明；实际命令以实施时的官方说明为准。[Vite 集成说明][shadcn-vite]

### 2.3 不默认加入的技术

首版不加入 Three.js、WebGL、Canvas 整页绘制、第二套动画引擎、复杂全局状态库或庞大后台模板。

真实照片可以使用图片资源；仪表和图标可以使用 SVG。**按钮、卡片、表格、弹窗和文字不能通过整块截图冒充组件。**

---

## 3. 分层架构与目录

### 3.1 四层职责

| 层级 | 职责 | 典型内容 | 禁止依赖 |
|---|---|---|---|
| 设计规范层 | 统一视觉与动效参数 | 颜色、间距、圆角、字体、阴影、动画时长 | 业务数据、路由、接口 |
| 基础组件层 | 可独立复用的控件 | Button、Input、Tabs、Dialog、Badge | infission 专用状态与接口 |
| 通用组合层 | 多个控件组合成可复用结构 | AppShell、MetricCard、StepTimeline、FileUpload | 固定项目、机构、地址或服务 |
| 业务与流程层 | 业务含义、页面组合、状态协调 | ProjectCard、ComplianceReview、AIFixWorkflow、SubmissionWorkflow | 不得被通用 UI 包反向导入 |

依赖方向为：

```text
业务页面 / 工作流
        ↓
通用组合组件
        ↓
基础组件
        ↓
设计变量
```

同一类项目卡片的不同状态应优先是一个组件的变体或数据变化，不应复制成五份近似代码。

### 3.2 推荐目录

```text
component-library/
├─ INFISSION_CODEX_IMPLEMENTATION_SPEC.md
├─ AGENTS.md
├─ README.md
├─ package.json
├─ pnpm-workspace.yaml
├─ pnpm-lock.yaml
│
├─ docs/
│  ├─ dependency-decisions.md
│  ├─ component-inventory.md
│  ├─ design-tokens.md
│  ├─ motion-spec.md
│  ├─ interaction-flows.md
│  ├─ acceptance.md
│  └─ implementation-status.md
│
├─ references/
│  ├─ source/                    # 原视频，不更改原件
│  ├─ frames/                    # 原始关键帧与裁切
│  ├─ infission/                 # infission 开发参考图（原始图片含 Permitly 品牌）
│  └─ reference-map.md           # 图号、区域、视频时间点与组件对应关系
│
├─ packages/
│  └─ ui/
│     ├─ package.json
│     ├─ vite.config.ts
│     └─ src/
│        ├─ tokens/
│        ├─ primitives/
│        ├─ patterns/
│        ├─ styles/
│        └─ index.ts
│
├─ apps/
│  └─ playground/
│     ├─ package.json
│     └─ src/
│        ├─ features/            # 项目、文档、合规等业务组件
│        ├─ workflows/           # AI 修复、提交等流程
│        ├─ pages/
│        ├─ mocks/
│        ├─ assets/
│        └─ app/
│
├─ .storybook/
└─ tests/
   ├─ e2e/
   ├─ visual/
   └─ consumer-smoke/            # 独立使用组件包的验证工程
```

上述目录适用于新仓库；已有工程可以保留现有结构，但必须保持同等职责边界。

组件的 `*.stories.tsx` 和组件测试建议与源码相邻，避免修改组件后遗漏相关示例。

Storybook 可以覆盖通用组件与业务组件，但它们的归属、依赖边界仍然不同。

---

## 4. 三张参考图、范围锁定与防遗漏

### 4.1 本次指定的参考

| 参考 ID | 用户提供的图 | 本地建议 / 打包路径 | 对应内容 |
|---|---|---|---|
| REF-01 | infission 组件拆解 01 | `references/infission/01_global_dashboard_projects.png` | 全局框架、顶部控件、仪表盘、项目浏览、通用小组件 |
| REF-02 | infission 组件拆解 02 | `references/infission/02_detail_documents_compliance.png` | 项目头部与页签、概览、文档中心、合规审查、状态反馈 |
| REF-03 | infission 组件拆解 03 | `references/infission/03_workflows_submission_feedback.png` | AI 修复弹窗、材料打包、提交确认、过渡、成功反馈 |

参考图： [图 01](references/infission/01_global_dashboard_projects.png) · [图 02](references/infission/02_detail_documents_compliance.png) · [图 03](references/infission/03_workflows_submission_feedback.png)

> 品牌迁移说明：三张文件是用户提供的 Permitly 原始参考图；本项目名称、Logo 文案、AI 名称和产品 UI 文案统一改为 **infission**，图片文件不做品牌篡改。

**这三张图决定当前组件范围与静态风格。不要读取同一文件夹中其他产品的图来补充本项目。**

文档第 6 节建立 **101 条参考映射：图 01 为 37 条、图 02 为 28 条、图 03 为 36 条**。这是包括变体、子部件与组合模块在内的参考检查数，不是 101 个互相独立的 React 组件，也不是原视频完整组件总数。

### 4.2 图片与视频的分工

```text
用户明确的新指令
    > 本次三张原始 Permitly 参考图：组件范围与静态风格；实现文案统一改为 infission
    > 原视频：补充真实交互顺序、页面关系、动效轨迹
    > 本文标为“建议 / 补充”的实现决策
```

三张图与视频冲突时，将冲突记录到 `references/reference-map.md`，不要无说明替换当前参考。原视频文件名：

```text
references/source/SaveTwitter.Net_4umFJcgPnteHPkhA_(1200p).mp4
```

完整参考包提供这段原视频；只使用独立 Markdown 时，需自行将参考素材放入相应位置。不要把聊天环境的绝对路径当成本地仓库路径。

静态图只能确认某个视觉状态；不能据此确认悬停轨迹、动画时长、弹窗焦点规则、后端接口或商业规则。本次文档没有完成视频逐帧审计。可在开发中使用视频读取工具保存操作前、中、后的关键帧；工具无法读取视频时，保留不确定项并先完成静态组件。

### 4.3 不把“组件展板”做成最终应用

图上的中文区块标题、绿色编号、英文解释、拆解框、页眉版本和页脚是设计说明，不是产品内的必备 UI。不得把三张长图当成三个需要复刻的长网页。

交付应同时具有：

- **组件展示：** 在 Storybook 中查看图中各模块、变体与状态；需要时提供参考图对照。
- **功能演示：** 使用相同组件组装项目管理界面，用户可以进入详情、查看文档、修复问题和模拟提交。

产品内默认采用 infission 英文 UI 文案；原始参考图中出现的 Permitly 字样仅作为视觉证据，开发文档和 Storybook 说明可用中文。不擅自把界面替换为另一种主题或另一类业务。

### 4.4 每条参考映射的记录字段

| 字段 | 要求 |
|---|---|
| `referenceId` | 本文 A01–A37、B01–B28、C01–C36，唯一且稳定 |
| `sourceImage` / `sourceArea` | 图号与原图区域；可补充局部裁切路径 |
| `component` / `variant` | 对应实现与变体；多个参考条目可复用同一组件 |
| `evidence` | `image-confirmed` / `video-confirmed` / `implementation-proposal` / `required-extension` |
| `motionEvidence` | `video-confirmed` / `proposed` / `not-verified` / `not-applicable` |
| `story` / `test` | Storybook 场景与测试位置 |
| `status` | 未开始、开发中、待视觉确认、通过、阻塞或有理由的不适用 |
| `differences` | 文案待确认、资源替代、动画待校准和参考冲突 |

“图中可见”与“交互方案已被视频验证”必须分别记录；禁止将所有条目默认标成已视频确认。

### 4.5 覆盖完成的判定

第 6 节每个参考 ID 都要关联实现、Story 和验收结果；若多个条目合并实现，全部 ID 都要保留映射。不能因为某个小组件在其他图出现过，就省略其变体检查。

覆盖报告分开写：**三图参考条目覆盖率、静态视觉核对状态、交互测试状态、动效核对状态**。没有视频证据时只能写“按建议动效完成”，不能写“视频动效精准还原”。

### 4.6 本次素材落位与校验

以下文件已复制到仓库，原文件未转码；开发代码一律使用相对路径，不引用聊天临时目录或下载目录的绝对路径。

| 用途 | 仓库路径 | 媒体信息 | 校验方式 |
|---|---|---|---|
| 图 01 静态基线 | `references/infission/01_global_dashboard_projects.png` | PNG，1055 × 1491，RGB | `references/manifest.json` |
| 图 02 静态基线 | `references/infission/02_detail_documents_compliance.png` | PNG，1055 × 1491，RGB | `references/manifest.json` |
| 图 03 静态基线 | `references/infission/03_workflows_submission_feedback.png` | PNG，1055 × 1491，RGB | `references/manifest.json` |
| 动效与页面关系参考 | `references/source/SaveTwitter.Net_4umFJcgPnteHPkhA_(1200p).mp4` | H.264，1600 × 1200，60 fps，23.316667 s | `references/manifest.json` |

清单中的 `bytes` 与 `sha256` 必须与实际文件一致；文件替换后必须重新生成清单并记录原因。视频目前只确认了容器元数据，没有把任何时间点标记为“视频已验证”。需要截帧时，将时间戳、命令、帧文件和对应参考 ID 记录到 `references/reference-map.md`；不要把自动抽帧结果直接当作视觉基线。

素材是开发参考，不是产品内容。除非另行确认授权，不得把原图 / 原视频打进发布包、上传到外部分析服务或在公开演示中继续传播。

---

## 5. 设计变量与视觉规则

### 5.1 变量分组

```text
color.canvas                页面底色
color.surface               普通卡片背景
color.surface-muted         次级区域背景
color.surface-inverse       深色卡片背景
color.brand                 品牌强调色
color.on-brand              品牌底色上的文字
color.text                  主文字
color.text-muted            次级文字
color.text-inverse          深色区域文字
color.border                普通边框
color.focus                 聚焦提示

color.success.*             成功语义
color.warning.*             警告语义
color.danger.*              错误 / 高风险语义
color.info.*                信息语义

space.*                     间距刻度
radius.control              输入框和普通控件圆角
radius.card                 卡片圆角
radius.dialog               弹窗圆角
radius.pill                 胶囊圆角
shadow.card                 卡片阴影
shadow.floating             浮层阴影
shadow.dialog               弹窗阴影

font.family.*               字体族
font.size.*                 字号
font.weight.*               字重
font.line-height.*          行高

motion.fast                 微反馈时长
motion.standard             常规切换时长
motion.slow                 明显内容过渡
motion.ease.*               缓动曲线
layer.*                     叠放层级
```

这些是语义名称，不是必须照抄的 CSS 语法。实际 CSS 名称应统一加前缀，例如 `--ui-color-brand`。

品牌荧光绿与成功色必须在语义上分开，即使首版视觉接近，也不能共用一个无法独立修改的变量。

Tailwind 主题变量可以映射这些样式参数；实施时依照 v4 的主题与变量机制，而不是混入旧版配置习惯。[主题变量说明][tailwind-theme]

### 5.2 数值来源

颜色、字号、圆角、阴影和组件尺寸应尽量从指定三张图的组件区域校准；应用整页布局可参考原视频。

未测量的数值使用明确标注的初始值，并列入待校准清单。禁止声称未经测量的颜色、像素或动画时间是原视频精确参数。

### 5.3 布局与字体

- 主布局使用 Grid / Flex；绝对定位仅用于角标、覆盖层、装饰与局部对齐。
- 分别定义按钮高度、输入框高度、卡片内边距、模块间距和内容密度。
- 长文字应有换行或省略策略；不能靠缩小所有字体解决溢出。
- 统计数字建议使用等宽数字特性，减少数值更新时的宽度跳动。
- 字体与照片使用用户提供或允许使用的资源；缺失资源必须明确标注替代。
- 品牌、地址、人员、照片和图标应从数据或插槽传入，不固化在基础组件内部。

### 5.4 桌面适应策略

先校准参考视口，再检查 1280、1440、1920 CSS 像素宽度等补充场景；这些宽度是测试建议，不是对视频尺寸的描述。

主内容可收缩、网格可换列、必要表格可横向滚动。不得在窄桌面下出现无法到达的关键按钮。

### 5.5 样式隔离

组件包输出编译后的 CSS，消费项目不必重新扫描组件包源码生成 Tailwind 样式。

库样式不得无约束修改 `body`、全局标题、原生按钮等宿主页面元素。Tailwind 的全局重置与页面级默认样式由演示应用负责；组件包若依赖必要的基础样式，应明确限定范围并文档化。

为避免宿主 Tailwind 类冲突，应采用一致的类名前缀或其他可靠隔离方式。CSS 变量覆盖入口、样式优先级与 Portal 浮层继承必须验证。

---

### 5.6 可启动的视觉变量草案

以下仅是**实现起始值**，不是从图片精确测得的颜色与尺寸。先让六个样板使用同一套变量，再在 Storybook 中对照三张图校准。

```css
:root {
  --ui-color-canvas: #f1f5f8;
  --ui-color-surface: #ffffff;
  --ui-color-surface-muted: #f5f5f9;
  --ui-color-surface-inverse: #111214;
  --ui-color-brand: #c5f33e;
  --ui-color-on-brand: #13170c;
  --ui-color-text: #151619;
  --ui-color-text-muted: #73788a;
  --ui-color-border: #e5e7ef;
  --ui-color-focus: #58720a;

  --ui-radius-control: 12px;
  --ui-radius-card: 18px;
  --ui-radius-dialog: 24px;
  --ui-radius-pill: 999px;
  --ui-space-unit: 4px;
  --ui-shadow-card: 0 2px 8px rgb(25 35 55 / 4%);
  --ui-shadow-dialog: 0 20px 60px rgb(15 20 30 / 18%);
  --ui-motion-fast: 140ms;
  --ui-motion-standard: 220ms;
  --ui-motion-slow: 300ms;
}
```

再增加 success、warning、danger、info 的前景 / 背景 / 边框变量；不要直接把品牌色当作全部“成功”的文字色。以上根变量用于演示应用；发布组件库时必须遵守前述样式隔离规则。

**静态校准顺序：** 内容宽度与密度 → 字体与字号 → 组件高度和内边距 → 圆角 → 边框与阴影 → 图标线宽 → 色彩微调。不要用大范围缩放把尺寸不对的组件强行贴近图像。

### 5.7 可访问性与字体门槛

- 正文文字目标达到 WCAG 2.2 AA：普通文字对比度至少 4.5:1，大文字至少 3:1；焦点指示器与相邻颜色至少 3:1。品牌荧光绿不能直接作为白底小字号文字色。
- 颜色只承担视觉强化；状态、风险和完成度同时提供文字、图标或可访问名称。
- 字体加载失败时使用记录过的系统回退；在截图验收前固定字体是否可用。不得为贴图缩小正文到不可读。
- `prefers-reduced-motion` 同时覆盖 CSS、Motion、SVG 数值动画和视频自动播放；参考视频只允许由用户主动播放。

---

## 6. 按三张图逐项映射组件

### 阅读方法

下列条目记录参考范围及实现要求；**“可见内容”来自三张图，“交互 / 实现要求”是开发约定，未必在静态图中已经展示。**

先建设基础控件，再按下面的 A / B / C 条目组合。基础控件列表是代码组织建议，不额外计入 101 条参考范围。

### 6.1 基础控件

本表为建议的代码底层，U 前缀与 A/B/C 参考条目分开。未在三图中展示且当前阶段不需要的控件不必预先实现。

| ID | 组件 | 覆盖内容与状态 |
|---|---|---|
| U01 | `Button` | 品牌、深色、描边、轻量、危险；尺寸、禁用、加载、图标 |
| U02 | `IconButton` | 圆形 / 圆角方形；通知、编辑、更多、关闭、跳转 |
| U03 | `Badge` | 状态、数量、风险、类型、位置；纯视觉语义，不写业务判断 |
| U04 | `Input` / `SearchField` | 文本、搜索、清除、前后图标、快捷键提示 |
| U05 | `Textarea`（按需扩展） | 仅当补充表单确实需要时实现；三图没有给出独立文本域设计 |
| U06 | `Checkbox` / `Switch` | 勾选、关闭、禁用；需要时支持部分选中 |
| U07 | `Select` | 筛选与选择；选中、禁用、空选项、长文本 |
| U08 | `DateField`（按需扩展） | 仅当演示编辑日期需要时实现；三图未展示弹出日历 |
| U09 | `Tabs` | 内容页签、数量、激活与禁用状态 |
| U10 | `SegmentedControl` | 时间、过滤条件、视图等互斥切换 |
| U11 | `DropdownMenu` / `Popover` / `Tooltip` | 菜单、轻量浮层、辅助提示；只补充实际需要的入口 |
| U12 | `Dialog` / `AlertDialog` | 普通弹窗、重要操作确认、遮罩、头部与底部操作区 |
| U13 | `Avatar` / `AvatarGroup` | 图片、首字母、缺失图片和成员集合 |
| U14 | `Progress` / `Spinner` | 确定进度、不确定进度和处理反馈 |
| U15 | `Skeleton` / `EmptyState` | 加载占位、无数据、无搜索结果、失败后入口 |
| U16 | `AlertBanner` / `Toast` | 页面内结果、警告与短时反馈；视频未出现者标注为补充 |
| U17 | `Breadcrumb` / `Separator` / `Collapsible` | 面包屑、分隔、可折叠分组 |
| U18 | `Card` / `Kbd` | 通用容器与快捷键外观 |

标签外观不等于控件语义：触发筛选的标签应是按钮，跳转目标应是链接，纯状态标签不应伪装成可点击操作。


来源：[参考图 01](references/infission/01_global_dashboard_projects.png)。

### 图 01 / 01 页面框架

| 参考 ID | 原图区域 | 建议组件 / 变体 | 可见内容 | 交互 / 实现要求 |
|---|---|---|---|---|
| A01 | 01 · 1.1 | `Logo / Brand` | 黑色圆角品牌图形与 infission 字标；应用侧栏的外层、折叠入口一并归入 AppShell。 | 品牌通过参数传入；折叠按钮有可访问名称；折叠动画属补充实现。 |
| A02 | 01 · 1.2 | `WorkspaceSwitcher` | 工作区图标、Sunridge Solar、Austin, TX、副标题、下拉箭头。 | 可切换工作区；菜单内容图片未展开，采用标记的演示选项。 |
| A03 | 01 · 1.3 | `NavGroup` | PERMITTING / WORKSPACE 等分组标题与上下间距。 | 分组标题不可点击，不为视觉分组伪造路由。 |
| A04 | 01 · 1.4 | `NavItem · default` | 默认导航项的线性图标、名称、留白与命中区域。 | 支持链接、悬停与键盘聚焦；当前页由路由传入。 |
| A05 | 01 · 1.5 | `NavItem · active` | 黑色胶囊选中背景、浅色图标和文字、可选绿色数量。 | 与默认项复用同一组件，不为选中态复制代码。 |
| A06 | 01 · 1.6 | `NavItem · count` | 未选中项的浅灰数量徽标，例如 Inspections 19。 | 数量为数据；0、三位数、无数量分别检查。 |
| A07 | 01 · 1.7 | `SidebarAIWidget` | 荧光绿容器、黑色图标、infission AI、开关、覆盖数量与待关注入口。 | 开关真实改变演示启用状态；待关注入口打开风险过滤结果。 |
| A08 | 01 · 用户信息卡 | `UserProfileCard` | 头像、Nizam、职位、更多菜单。原图将此处写为 3.8，本文按所在区域单独编号。 | 头像缺失使用占位；菜单内容未展示，补充项需标记。 |

侧栏需保留可见导航：Overview、Projects；PERMITTING 下为 Permits、Requirements、Documents、Inspections、Utilities；WORKSPACE 下为 Risk Center、AI Assistant、Reports、Team、Settings。只展示名称不代表参考已给出这些页面的内部设计。

### 图 01 / 02 顶部通用控件

| 参考 ID | 原图区域 | 建议组件 / 变体 | 可见内容 | 交互 / 实现要求 |
|---|---|---|---|---|
| A09 | 02 · 2.1 | `SearchField` | Search projects、放大镜、右侧快捷键胶囊。 | 输入能过滤项目；清空恢复；快捷键仅在不抢占其他输入时响应，提示按平台适配。 |
| A10 | 02 · 2.2 | `NotificationButton` | 圆形浅底按钮、铃铛、右上红色提醒点。 | 提醒点由未读状态驱动；弹出内容属于补充演示。 |
| A11 | 02 · 2.3 | `Button · dark` | 黑色 New project 主操作、加号、圆角与轻微高光。 | 打开最小演示创建流程；该表单并非图片已给出的设计。 |
| A12 | 02 · 2.4 | `Button · outline` | Permit package、文件图标、浅色边框。 | 打开当前项目的材料打包页；无当前项目时说明原因。 |
| A13 | 02 · 2.5 | `StatusBadge` | On track、圆点和绿色胶囊。 | 纯状态无点击语义；作为业务状态映射后的展示。 |
| A14 | 02 · 2.6 | `FilterChip` | All 128、黑底、荧光绿数字。 | 为可操作筛选按钮，不是纯 Badge；数量源于数据。 |
| A15 | 02 · 2.7 | `TimeRangeControl` | Today / 7 days / 30 days；7 days 为选中示例。 | 这是时间筛选选项，不是新增产品页面；切换更新对应统计。 |

### 图 01 / 03 仪表盘模块

| 参考 ID | 原图区域 | 建议组件 / 变体 | 可见内容 | 交互 / 实现要求 |
|---|---|---|---|---|
| A16 | 03 · 3.1 | `ProjectHeroCard` | 照片、PL-2841、Under review、地址、跳转图标、78% 进度、System / Stage / Decision。 | 覆盖式底部信息层；图像固定比例；入口、状态与进度分别可配置。 |
| A17 | 03 · 3.2 | `PortfolioStats` | 四块统计：Active projects、In permitting、Awaiting review、At risk；首块黑底。 | 值、描述、趋势与选中强调由数据传入；各统计不能互相复制硬编码。 |
| A18 | 03 · 3.3 | `ProjectPipeline` | 分段条、Design / Permit / Review / Inspection / PTO 数量、平均周期、Open。 | 统一阶段数据；分段宽度策略可配置，勿假设原图宽度等于人数比例。 |
| A19 | 03 · 3.4 | `AttentionTable` | Project、Address、Stage、Blocker、Risk、Due 表头与紧凑项目行。 | 真实筛选与可达行入口；风险标签、长阻塞文案不挤压日期。 |
| A20 | 03 · 3.5 | `AIRiskCard` | 黑色渐变卡、infission AI、时间、风险摘要、不同颜色原因点、Review risks。 | 深色表面作为变量变体；点击后展示对应风险，不只打印日志。 |
| A21 | 03 · 3.6 | `PackageComplianceCard` | 标题与跳转、绿色半圆刻度仪表 94%、项目/23 of 23、Checked / Flagged / Rejected。 | 刻度和读数共用评分；辅助统计有独立含义；不把图像当成仪表组件。 |

### 图 01 / 04 项目浏览

| 参考 ID | 原图区域 | 建议组件 / 变体 | 可见内容 | 交互 / 实现要求 |
|---|---|---|---|---|
| A22 | 04 · 4.1 | `ProjectStatusFilters` | All 128、In permitting 47、Under review 18、At risk 7、Approved 44。 | 可组合筛选；数字不必互斥求和；先定义业务集合与计数口径。 |
| A23 | 04 · 4.2 | `JurisdictionFilter` | All jurisdictions、建筑图标、下拉箭头。 | 与其他过滤条件求交集；空结果提供清除条件入口。 |
| A24 | 04 · 4.3 | `ProjectTypeFilter` | Residential、类型图标、下拉箭头。 | 值和候选项由业务传入；默认值按演示数据配置。 |
| A25 | 04 · 4.4 | `ViewToggle` | 列表和网格图标；黑色胶囊选中网格。 | 切换布局保留过滤条件、排序与选中数据；布局动画不制造重复元素。 |
| A26 | 04 · 4.5 | `ProjectCard · under-review` | 照片与 ID、橙色 Under review、地址、System / Battery、78% 进度、负责人和日期。 | 与 A27–A30 共用 ProjectCard；图片、状态、参数、进度作为参数。 |
| A27 | 04 · 4.6 | `ProjectCard · delayed` | 红色 Delayed、不同照片与地点、62% 进度、Battery None。 | 无电池与数据缺失要区分；菜单点击不触发整卡导航。 |
| A28 | 04 · 4.7 | `ProjectCard · missing-docs` | 红色 Missing docs、不同负责人、41% 进度。 | 状态应可关联文档缺失问题，不能只改变颜色。 |
| A29 | 04 · 4.8 | `ProjectCard · interconnection` | 紫色 Interconnection、91% 进度、不同项目照片。 | 长地址省略或换行规则统一；状态文本完整可读。 |
| A30 | 04 · 4.9 | `ProjectCard · inspection` | 绿色 Inspection、96% 进度、检查阶段。 | 绿色状态不等于全部流程结束；保持业务状态区别。 |

### 图 01 / 05 通用小组件

| 参考 ID | 原图区域 | 建议组件 / 变体 | 可见内容 | 交互 / 实现要求 |
|---|---|---|---|---|
| A31 | 05 · 5.1 | `StatusPillSet` | Under review、Delayed、Missing docs、Inspection、Interconnection、On track。 | 业务枚举映射到 Badge；文本、图标与色彩一起表达状态。 |
| A32 | 05 · 5.2 | `RiskBadge` | High 红色、Medium 浅橙色。 | 风险与项目阶段分开建模，不混成一个 status 字段。 |
| A33 | 05 · 5.3 | `LinearProgress` | 浅灰轨道、深色或绿色填充、右侧百分比。 | 支持 0、100、无数据；宽度按数值计算。 |
| A34 | 05 · 5.4 | `IconButtonSet` | 斜向跳转、更多操作，浅色圆形底。 | 无文字按钮必须有可访问名称；更多菜单支持键盘。 |
| A35 | 05 · 5.5 | `CountBadge` | 128、47、19 的绿色 / 灰色数量徽标。 | 数量格式统一，宽度随内容变化。 |
| A36 | 05 · 5.6 | `CompactProjectRow` | 极紧凑项目 ID、两行地址、阻塞说明、风险和到期日。 | 作为表格行密度变体，不以缩小整张截图实现。 |
| A37 | 05 · 5.7 | `CardFooterActions` | Ranked by infission AI 胶囊、筛选设置图标、更多操作。 | 排名提示与设置操作分开；排名演示规则明确，不伪称真实 AI。 |

来源：[参考图 02](references/infission/02_detail_documents_compliance.png)。

### 图 02 / 01 项目头部与页签

| 参考 ID | 原图区域 | 建议组件 / 变体 | 可见内容 | 交互 / 实现要求 |
|---|---|---|---|---|
| B01 | 01 · 面包屑与返回 | `ProjectBreadcrumb` | 圆形返回按钮、Projects > PL-2841、1254 Oak Street 标题。 | 返回保留项目列表筛选；面包屑可访问。 |
| B02 | 01 · 项目 ID | `ProjectIdChip` | 项目图标与 PL-2841 浅色胶囊。 | 显示项目标识；是否可复制属于补充行为，不能默认冒充原有交互。 |
| B03 | 01 · 顶部导航页签 | `ProjectTabs` | Overview、Requirements 23、Documents 10、Permit、Inspections 1、Timeline。 | 切换真实内容或明确占位；数量共用当前项目数据。 |
| B04 | 01 · 右上角操作 | `ProjectHeaderActions` | 通知、Permit package、黑色 Actions 菜单。 | 复用图 01 控件；Actions 的未展示菜单需独立标注补充。 |
| B05 | 01 · 状态标记 | `ProjectStatusBadge` | On track 的绿色状态展示。 | 当前项目改变时同步更新，不依附页签选中状态。 |

### 图 02 / 02 项目概览

| 参考 ID | 原图区域 | 建议组件 / 变体 | 可见内容 | 交互 / 实现要求 |
|---|---|---|---|---|
| B06 | 02 · 许可进度时间线 | `PermitProgressCard` | 78%、Survey / Design / Prep / Submitted / In review / Inspection / PTO、完成勾选、当前黑点、未来空圈及日期。 | 时间线与百分比可为不同业务维度；不能仅按完成节点比例反推 78%。 |
| B07 | 02 · 项目状态 / AI 置信度 | `ProjectAIStatusCard` | 黑色卡片、状态说明、下一里程碑、时间、91% 和点状置信度。 | 置信度与完成度分开；点状刻度与数值一致。 |
| B08 | 02 · 需求汇总 | `RequirementsSummary` | All complete、Open requirements、23 Complete、14 of 14 City of Austin、9 of 9 Austin Energy。 | 完成数由需求集合派生；跳转定位当前项目需求。 |
| B09 | 02 · 活动动态 | `ActivityFeed` | All / AI / People 分段、事件图标、标题、日期和多行说明。 | 过滤真正改变记录；保持稳定时间，避免测试时漂移。 |
| B10 | 02 · 项目信息 | `ProjectDetailsCard` | Jurisdiction、Utility、System、Storage 的键值列表与编辑按钮。 | 编辑补充对话框更新同一项目数据；参数和单位分开存储。 |
| B11 | 02 · 团队成员 | `ProjectTeamCard` | 首字母头像、姓名、角色、分隔线和行级更多。 | 姓名仅作参考图中示例文本；用稳定成员 ID，不靠姓名关联数据。 |
| B12 | 02 · 下次检查 | `InspectionScheduleCard` | 绿色 Final inspection、日期时间、日历图标、Inspector John Carter 和箭头。 | 有/无检查安排分别演示；点击打开明确的演示详情。 |

### 图 02 / 03 文档中心

| 参考 ID | 原图区域 | 建议组件 / 变体 | 可见内容 | 交互 / 实现要求 |
|---|---|---|---|---|
| B13 | 03 · 分类标签 | `DocumentCategoryTabs` | All 10 / Design 3 / Permitting 3 / Utility 4。 | 分类数量从文档集合派生；与搜索、状态过滤组合。 |
| B14 | 03 · 状态筛选 | `DocumentStatusFilter` | Any status 下拉选择。 | 以文档状态枚举过滤，不误用项目状态。 |
| B15 | 03 · 文档搜索 | `DocumentSearch` | Find a document、放大镜、浅色边框。 | 大小写无关名称搜索、清除、空结果状态。 |
| B16 | 03 · AI 检查状态横幅 | `AICheckSummary` | AI checked 9 of 10 绿色胶囊、排序 / 筛选图标、更多。 | 检查数量不等于合规通过数量；提供检查中/完成演示。 |
| B17 | 03 · 文档分组容器 | `DocumentGroup` | Design 3 files、分组图标、折叠箭头、浅灰圆角组。 | 可折叠；筛选后数量口径明确；收起内容不可被键盘聚焦。 |
| B18 | 03 · 文档行与解剖 | `DocumentRow` | PDF 图标、名称、大小 / Owner、Verified 或 Needs review、彩色短条置信度、日期、更多菜单。 | 文件预览与菜单分开；支持长名；置信度 98/87/74 为演示值而非算法阈值定义。 |
| B19 | 03 · 上传区域 | `FileUploadDropzone` | 虚线容器、上传图标、Drop files to check them、文件格式 / 大小说明、Browse files。 | 选择和拖拽同一校验；进度、移除、失败、重试为补充完整状态；不伪装真实上传。 |
| B20 | 03 · 文档智能侧边栏 | `DocumentIntelligencePanel` | 深色卡片、解释文案、Fields extracted、Mismatches found、Average check time。 | 分析结果由业务传入；检查中和无结果需有反馈。 |

### 图 02 / 04 合规审查

| 参考 ID | 原图区域 | 建议组件 / 变体 | 可见内容 | 交互 / 实现要求 |
|---|---|---|---|---|
| B21 | 04 · 合规分数 | `ComplianceScoreCard` | 半圆刻度仪表 87%、Passed 2 / Minor 1 / Critical 1。 | 同一 ScoreGauge 的主题变体；统计来源一致但不得凭统计发明评分公式。 |
| B22 | 04 · 问题发现列表 | `ComplianceFindingsList` | 四条发现、通过 / 警告 / 严重图标、结果标签。 | 选择问题更新右侧详情；问题严重程度与修复状态分别记录。 |
| B23 | 04 · 主要问题详情 | `FindingDetailPanel` | 标题、Finding 04 of 04、Critical、Blocks submission、图纸预览、红色虚线标注、Sheet E-2 · detail C、Open in viewer。 | 图纸可用图片；标注使用 SVG / DOM 覆盖并随缩放定位，问题文本保持真实 DOM。 |
| B24 | 04 · 原因与规范来源 | `RequirementSourcesPanel` | What infission saw 说明、Requirement、两条来源卡、机构图标和外链箭头。 | 这里只复刻演示数据，不提供真实合规判断；来源可作为示例记录或明确的合法链接。 |
| B25 | 04 · 推荐操作 | `RecommendedActionCard` | 荧光绿推荐卡、操作图标、说明、Label 与位置参数标签。 | 建议与选中问题绑定；长标签有可读布局。 |
| B26 | 04 · AI 修复对比 | `AIFixDiffPanel` | 深色 Current callouts / After the fix、箭头、变更高亮、Sheet E-2 · detail C。 | 先有 before / after 数据再做高亮动画；不能只切背景颜色。 |
| B27 | 04 · 底部操作 | `ReviewActionBar` | Open in viewer、Send to designer、Fix with AI。 | 查看器、模拟发送或修复对话框都有真实前端响应；未授权不得发送真实消息。 |

### 图 02 / 05 状态标记与反馈

| 参考 ID | 原图区域 | 建议组件 / 变体 | 可见内容 | 交互 / 实现要求 |
|---|---|---|---|---|
| B28 | 05 · 状态集合 | `ReviewStatusPills` | Verified、Needs review、Pass、Minor、Critical、Fixed、Complete。 | 复用视觉 Badge，但保持文档状态、发现级别、修复状态、流程完成四类语义独立。 |

来源：[参考图 03](references/infission/03_workflows_submission_feedback.png)。

### 图 03 / 01 AI 修复确认弹窗

| 参考 ID | 原图区域 | 建议组件 / 变体 | 可见内容 | 交互 / 实现要求 |
|---|---|---|---|---|
| C01 | 01 · 1.1 | `AIFixDialog / Dialog` | 白色大圆角容器及浮层布局。 | 应用中按弹窗显示，不在正文静态摆放；遮罩、滚动锁、焦点返回可用。 |
| C02 | 01 · 1.2 | `DialogTitle / Description` | Let infission AI edit sheet E-2?、修订需审批的说明。 | 项目 / 文件名来自当前上下文；无障碍标题和说明关联正确。 |
| C03 | 01 · 1.3 | `DialogCloseButton` | 右上浅灰圆形关闭叉。 | 关闭只关闭浮层，不把已提交请求假装取消。 |
| C04 | 01 · 1.4 | `ChangeList` | Changes to detail C；新增 callout、location、revision 条目与图标。 | 逐条表现新增 / 修改；内容由变更对象生成，保持长文本可读。 |
| C05 | 01 · 1.5 | `VersionIndicator` | v2 to v3、REV 3 与日期等版本信息。 | 新旧版本由文档记录驱动，旧版保留，不随动画虚构版本。 |
| C06 | 01 · 1.6 | `ApprovalOptions` | Ask Elena Ruiz to approve the revision；Re-run the compliance check on all 4 sheets。 | 独立受控复选框；请求审批和重新检查不是同一布尔值。 |
| C07 | 01 · 1.7 | `VersionHistoryHint` | 信息图标、v2 stays in version history。 | 作为辅助说明；无真实存储时仅承诺本次演示状态保留。 |
| C08 | 01 · 1.8 | `Button · cancel` | 底部 Cancel 描边按钮。 | 返回查看问题；输入保留策略明确。 |
| C09 | 01 · 1.9 | `Button · apply-fix` | 荧光绿 Apply fix、AI 图标。 | 触发工作流；处理中禁重复，成功 / 待审批 / 失败分别反馈。 |

### 图 03 / 02 提交前打包页

| 参考 ID | 原图区域 | 建议组件 / 变体 | 可见内容 | 交互 / 实现要求 |
|---|---|---|---|---|
| C10 | 02 · 2.1 | `ProjectHeader · permit` | 项目 ID、页签、机构、右侧 On track；Permit 激活。 | 复用 B01–B05；不建立另一套页签。 |
| C11 | 02 · 2.2 | `PackageReadyBanner` | 绿色横幅、白底勾选、23 of 23 requirements complete、说明、Estimated decision、Compliance 96%。 | 完成需求、无阻塞、合规分、预估日期各有数据来源，不互相代替。 |
| C12 | 02 · 2.3 | `PackageContentList` | What is in the package、10 documents · 48 pages、下载入口；Permit forms 3 / Design set 3 / Utility 4，文件勾选、名称、页数 / 来源、预览图标、Complete。 | 共三组十条文件，详见下文；总数与页数汇总；所选项目变化后重新计算提交条件。 |
| C13 | 02 · 2.4 | `AIFinalCheckCard` | 黑色卡片、Passed、无严重问题说明、四条勾选检查。 | 最终检查结果绑定当前包版本；文件变更后结果需要失效或重算。 |
| C14 | 02 · 2.5 | `SubmissionTargetCard` | City of Austin、门户说明、Connected、Filing type、Fee、Filed by。 | 目标、连接状态、费用和提交人均为演示数据；连接错误需能展示。 |
| C15 | 02 · 2.6 | `BeforeSubmitChecklist` | 通知客户、审批前暂缓安装、发送副本给设计师三项。 | 哪些必填是业务配置；不把所有可选项都强制勾选。 |
| C16 | 02 · 2.7 | `PreviewPackageButton` | 眼睛图标、Preview package。 | 打开材料预览演示，不能下载空文件或无响应。 |
| C17 | 02 · 2.8 | `SubmitPackageButton` | 黑色纸飞机图标、Submit to City of Austin。 | 先打开确认弹窗，不直接模拟成功或自动扣费。 |

### 图 03 / 03 提交确认弹窗

| 参考 ID | 原图区域 | 建议组件 / 变体 | 可见内容 | 交互 / 实现要求 |
|---|---|---|---|---|
| C18 | 03 · 3.1 | `SubmitConfirmationDialog` | 标题、关闭入口、提交不可直接撤回的说明、白色大圆角容器。 | 取消与确认入口清楚；提交中禁重复；说明只适用于当前模拟流程。 |
| C19 | 03 · 3.2 | `SubmissionSummary` | 目标机构、Project、Filing type、Package、Fee、Filed by。 | 从当前材料包快照生成；不沿用另一项目的数据。 |
| C20 | 03 · 3.3 | `ConnectionStatusBadge` | Ready 胶囊与机构门户说明。 | 连接可用和材料完备是两个维度；不得只凭绿色标签跳过检查。 |
| C21 | 03 · 3.4 | `SubmissionConfirmations` | Tell the homeowners once it is filed；I confirm the package is complete and accurate。 | 通知为选项，完整准确为必要确认的演示规则；键盘可操作。 |
| C22 | 03 · 3.5 | `SubmissionDialogActions` | Cancel；黑色 Submit and pay $418、纸飞机图标。 | 金额从业务数据格式化；演示仅模拟提交与费用，不接入真实支付。 |

### 图 03 / 04 过渡态

| 参考 ID | 原图区域 | 建议组件 / 变体 | 可见内容 | 交互 / 实现要求 |
|---|---|---|---|---|
| C23 | 04 · 4.1 | `SubmissionProgressOverlay` | 半透明背景、小白面板、旋转图标、Submitting permit package... 与提示。 | 显示不确定进度；请求状态驱动，不用固定动画时长冒充真实处理完成。 |
| C24 | 04 · 4.2 | `SubmitButton · pending` | 灰色不可再次点击的 Submitting to City of Austin...。 | 与遮罩共享提交状态；无重复发请求窗口。 |
| C25 | 04 · 4.3 | `SubmissionStatusBadge` | 紫色 Submitted、圆点和轻微发光视觉。 | 提交标记与完成整个审批流程不同；减少动态效果时保持静态可读。 |

### 图 03 / 05 提交成功反馈

| 参考 ID | 原图区域 | 建议组件 / 变体 | 可见内容 | 交互 / 实现要求 |
|---|---|---|---|---|
| C26 | 05 · 5.1 | `SubmissionSuccessBanner` | 绿色 Filed with the City of Austin、勾选、参考编号 / 时间 / 金额；Download receipt 与 Open permit tracker。 | 响应后显示成功；回执为明确标记的演示文件，追踪为本地演示。 |
| C27 | 05 · 5.2 | `DecisionSummary` | Estimated decision 与 Plan review 的双栏摘要。 | 时间从提交结果读取；示例日期不描述为真实处理承诺。 |
| C28 | 05 · 5.3 | `SubmissionTargetCard · compact` | 小型机构图标、机构 / 门户说明、Connected。 | 复用 C14 的紧凑变体。 |
| C29 | 05 · 5.4 | `NotificationReceiptCard` | 绿色小卡、Homeowners notified、收件人说明、时间。 | 仅在模拟通知成功后显示；通知失败与提交成功可同时存在。 |
| C30 | 05 · 5.5 | `NextStepsPanel` | What happens next、三个图标条目：审查开始、门户检查、预计结果。 | 列表内容为配置；提到定时检查不代表前端已经具备真实后台任务。 |

### 图 03 / 06 通用状态组件

| 参考 ID | 原图区域 | 建议组件 / 变体 | 可见内容 | 交互 / 实现要求 |
|---|---|---|---|---|
| C31 | 06 · 6.1 | `WorkflowBadge · ready` | Ready。 | 准备就绪状态，不代替所有前置条件校验。 |
| C32 | 06 · 6.2 | `WorkflowBadge · connected` | Connected。 | 只表达目标连接状态。 |
| C33 | 06 · 6.3 | `WorkflowBadge · passed` | Passed。 | 只表达对应检查已通过。 |
| C34 | 06 · 6.4 | `WorkflowBadge · submitted` | Submitted。 | 已提交，仍可处于外部审批过程中。 |
| C35 | 06 · 6.5 | `WorkflowBadge · complete` | Complete。 | 表达当前材料组或局部流程完成。 |
| C36 | 06 · 6.6 | `WorkflowBadge · on-track` | On track。 | 表达项目总体进度状态，与上述字段独立。 |

### 6.2 关键复用关系

| 可见差异 | 应如何复用 |
|---|---|
| A04/A05/A06 导航默认、激活、带数量 | 一个 NavItem 的状态与参数 |
| A26–A30 五种项目卡 | 一个 ProjectCard 与业务状态映射 |
| A21/B21 的不同评分卡 | 共享 ScoreGauge，外层业务卡片分别组合 |
| A13/A31/B05/B28/C25/C31–C36 的标签 | 共享 Badge 外观；项目、文档、问题、提交各自维护枚举 |
| B03/C10 页签 | 一份 ProjectTabs，通过当前路由决定激活项 |
| B18/C12 文件行 | 可共享 FileIcon、FileMetadata；文档审查行和提交勾选行保持独立组合 |
| C14/C28 提交目标 | 一个 SubmissionTargetCard 的标准 / 紧凑变体 |
| C01/C18/C23 浮层 | 共享底层 Dialog / Overlay；业务容器和状态策略不同 |

不要为了形式上的“原子化”把每段文字都做成独立组件；也不要把一个几百行、内置所有业务状态的万能 Card 当成组件库。

### 6.3 材料包的组与文件行

C12 的可见清单如下。文件名保留参考含义，大小写等细节在放大参考图后校准。它们是演示数据，不代表本项目应生成真正有效的许可材料。

| 分组 | 文件示例 | 展示信息 |
|---|---|---|
| Permit forms | Building Permit Application B-1 | 4 pages · generated |
| Permit forms | Electrical Permit Application E-2 | 3 pages · generated |
| Permit forms | Contractor Licence and Insurance | 2 pages · on file |
| Design set | Site Plan v3 | 2 pages · verified |
| Design set | Electrical Plan v3 | 4 pages · fixed Sep 23 |
| Design set | Structural Calculation v2 | 6 pages · restamped Sep 23 |
| Utility | Interconnection Application | 5 pages · acknowledged Sep 12 |
| Utility | Single Line Diagram v2 | 1 page · verified |
| Utility | Equipment Certification | 18 pages · verified |
| Utility | Battery Specification Sheet | 3 pages · uploaded Sep 23 |

本表用于展示覆盖，实际记录放到 fixtures；分组标题数量、总文件数、总页数应通过同一份数据计算。若为了视觉对照保留某张图的汇总快照，则将它单独命名为 reference snapshot，不让快照与可交互流程混用。

### 6.4 需要补充、但不冒充图中已给出的状态

| 对象 | 补充状态 |
|---|---|
| 按钮 / 选择器 / 菜单 | hover、focus-visible、disabled、长文本、键盘操作 |
| 列表 / 表格 / 文件组 | 空数据、无搜索结果、加载、请求失败、重试 |
| 图片 / 头像 | 缺失、加载失败、替代文本 |
| 上传 | 超出限制、错误类型、重复文件、处理中、失败、重试、移除 |
| 修复 | 提交中、待审批、拒绝、失败、超时、重新检查 |
| 提交 | 前置条件不足、发送中、明确失败、结果待确认、防重复 |
| 通知 | 待发送、模拟已发送、模拟失败；不影响已经成功的提交结果 |
| 所有动效 | 减少动态效果、快速连点中断、组件卸载后的清理 |

所有补充项在清单中标记为 `required-extension` 或 `implementation-proposal`。用户未要求的完整通知中心、账户系统、报表系统、移动端重设计不应悄悄纳入首版。

---

## 7. 组件接口与代码规则

### 7.1 组件只接收数据与回调

基础与通用组合组件接收数据、状态和操作回调，不负责决定业务成功与否。

```text
展示组件：读取参数 → 显示界面 → 发出用户操作
业务层：处理操作 → 请求 / 模拟请求 → 更新状态 → 重新传入参数
```

通用上传组件不能写死服务器地址；修复弹窗不能内置某家模型服务；按钮不能通过固定延时偷偷把业务改成成功。

### 7.2 公共接口规则

- 用明确的 TypeScript 类型表达必填项、可选项、变体和业务状态。
- 常见受控属性使用 `value` / `onValueChange`、`open` / `onOpenChange` 等成对命名。
- 支持受控与非受控模式时，写明规则；未提供该能力时不要在文档中宣称支持。
- 不用一批可矛盾的布尔参数表示同一维度状态。
- 对外允许必要的 `className`、HTML 属性、事件和 ref 使用方式，但不绕过交互底层的语义。
- 公共组件不得读取固定路由、固定项目 ID 或应用级 store。
- 文案、日期、币种与数字格式由业务层或格式化参数提供。
- 明确 loading 时如何处理点击、键盘和焦点；防止重复触发。
- 稳定的列表项 ID 同时用于数据更新与 React key；不使用数组索引追踪可排序业务项。

### 7.3 参数示例

以下仅用于表达接口方向，不是完整实现：

```ts
export type BadgeTone =
  | "neutral"
  | "brand"
  | "success"
  | "warning"
  | "danger"
  | "info";

export interface ScoreGaugeProps {
  value: number | null; // null 明确表示无数据
  min?: number;
  max?: number;
  label: string;
  tone?: BadgeTone;
  variant?: "arc" | "ticks";
  animate?: boolean;
  formatValue?: (value: number) => string;
}
```

仪表需处理 `max <= min`、负数、超范围、非有限数字和无数据情形。无数据不能自动当成零分；`NaN` 不能传入 SVG 几何计算。

不要把半圆评分简单写死为 `87`，也不要让刻度、读数和辅助统计各自使用不一致的数据来源。

---

### 7.4 重点组件的接口边界

| 组件 | 必需的外部数据 / 回调 | 不应内置 |
|---|---|---|
| AppShell | 导航数据、当前项、侧栏状态、主内容插槽 | 固定业务路由 |
| ProjectCard | 项目展示对象、打开回调、菜单操作 | 请求接口、全局选中项目 store |
| FilterBar | 条件、候选项、计数、onChange | 固定过滤结果数组 |
| DocumentRow | 文件对象、预览 / 更多操作 | 真实文件上传地址 |
| ScoreGauge | value / min / max、label、variant、formatValue | 写死的 87/94/96、独立计分公式 |
| ComplianceFindingsList | findings、selectedId、onSelect | 根据颜色推测问题级别 |
| AIFixDialog | open、目标文件、变更、选项、状态、onConfirm / onCancel | 模型密钥、真实邮件发送 |
| SubmitConfirmationDialog | 当前包摘要、目标、费用、确认项、工作流状态 | 直接扣费、固定延时成功 |

特殊要求：图纸局部预览可以用图片，但红色标注、选中状态、文件名和操作按钮应为可响应的数据驱动覆盖层。坐标用归一化值或与原图尺寸相关的变换，不能在缩放后仍使用固定屏幕像素。

### 7.5 应用页面组织建议

建议演示路由如下；这些路径是工程提案，不声称它们与原产品完全相同：

```text
/overview
/projects
/projects/:projectId/overview
/projects/:projectId/documents
/projects/:projectId/compliance
/projects/:projectId/permit
/projects/:projectId/submission-result
```

Requirement、Inspection、Timeline 等在图中仅部分显示，可先完成相关组件和清楚标识的演示页面，不凭导航名称虚构一整套未经用户确认的产品。列表与详情来回切换要保留过滤状态。通用组件包不能依赖这些路由。

---

## 8. 交互与动效实现规范

### 8.1 技术分工

| 场景 | 实现方式 | 关键验收点 |
|---|---|---|
| 颜色、边框、阴影反馈 | CSS transition | 默认、悬停、聚焦、按压不冲突 |
| 图标轻微反馈 | CSS；复杂协调才用 Motion | 不影响可点击区域与键盘聚焦 |
| 胶囊选中背景滑动 | Motion 共享布局 | 同页多组组件的标识隔离，不串动画 |
| 侧栏折叠 | 布局变化 + 内容过渡 | 图标、文字与主内容区不跳错位 |
| 列表 / 网格切换 | React 布局 + Motion | 使用稳定 ID；保留过滤和选择状态 |
| 文件分组折叠 | 交互底层 + 高度 / 透明度过渡 | 动态内容可见，收起后不残留可聚焦项 |
| 弹窗进出 | Base UI Dialog + CSS 或 Motion | 退出完成前的挂载、遮罩、焦点和滚动锁正确 |
| 仪表与进度变化 | SVG / CSS + Motion 数值 | 数值驱动，动画不能改变业务结果 |
| 修复前后对比 | 数据切换 + 差异高亮 | 修改后数据真实更新，不只是换色 |
| 提交中 | CSS spinner + 工作流状态 | 请求结束时正确停止；结果未知不伪装失败或成功 |
| 成功反馈 | 状态切换 + SVG / 淡入 | 只在成功响应后触发，不抢焦点 |

Motion 的布局与共享元素能力参考 [官方说明][motion-layout]；与 Base UI 的集成应参考 [集成文档][motion-base-ui]，不可直接复制不匹配的旧版 Radix 属性。

### 8.2 动画初始参数

以下是 **待校准建议值，不是原视频测量结果**：

| 动作 | 初始时长 |
|---|---|
| 按钮、图标微反馈 | 120–160 ms |
| 标签、菜单、提示切换 | 180–240 ms |
| 弹窗、面板进入退出 | 220–320 ms |
| 仪表首次展示 | 500–800 ms |

在 `docs/motion-spec.md` 记录每种效果的触发事件、变化属性、起止值、时长、缓动和中断行为。

### 8.3 动效约束

- CSS 与 Motion 不得同时控制同一元素的同一动画属性。
- 禁止无依据的全页飞入、过度弹跳、持续闪光或重复入场。
- 选择、提交和表单操作不能等待纯装饰动画结束后才生效。
- 连续快速点击应有正确的中断或合并行为，不能累积延时任务。
- 无真实百分比时显示不确定进度；不得假装已经知道真实完成比例。
- 不用重度模糊、大面积持续阴影或整个页面的频繁测量换取装饰效果。
- 共享布局、弹窗与 Portal 需要在多个实例共存时测试。

### 8.4 减少动态效果

同时处理 Motion 与 CSS 的减少动态效果设置。

优先使用 `MotionConfig` / `useReducedMotion` 统一策略；自定义 SVG 数值、循环动画和 CSS shimmer 仍需单独检查。[Motion 可访问性说明][motion-accessibility]

降低位移、缩放、闪动与循环装饰，保留必要状态提示。不能因为关闭动画就让用户看不到“处理中”或“已成功”。

---

## 9. 业务状态与工作流

### 9.1 AI 修复

```text
查看问题
  → 打开修复确认
  → 调整确认选项
  → 应用修复中
  → 已修复 / 等待审批 / 明确失败 / 结果待确认
  → 更新问题、文档版本、评分与活动记录
```

若包含设计师审批，必须区分“已提出变更”“待审批”和“已生效”。选择了请求审批，不能直接把界面当作最终文件已经获批。

修复成功后由同一份业务状态驱动问题列表、详情、评分与文件版本更新；不要让每张卡片独立维护一份互相矛盾的数据。

### 9.2 提交流程

```text
准备提交 → 打开确认 → 校验必要选项 → 提交中
                                      ├─ 成功
                                      ├─ 明确失败
                                      └─ 结果待确认
```

推荐的状态类型方向：

```ts
export type SubmissionState =
  | { status: "ready" }
  | { status: "confirming" }
  | { status: "submitting"; requestId: string }
  | { status: "success"; receiptId: string }
  | { status: "error"; message: string }
  | { status: "unknown"; requestId: string };
```

| 状态 | 允许操作 | 禁止或限制 |
|---|---|---|
| ready | 查看材料、打开确认 | 条件不足时不能开始提交 |
| confirming | 修改选项、取消、确认 | 必要确认未满足时不能提交 |
| submitting | 查看进度；根据策略关闭视觉层或留在当前页 | 禁止重复提交；关闭弹窗不等于取消服务器操作 |
| success | 查看结果、下载模拟回执、打开模拟追踪 | 不应再次触发同一提交 |
| error | 查看明确失败原因、修正、在安全条件下重试 | 不丢失确认输入，不清空用户数据 |
| unknown | 查询结果、保留请求编号 | 不直接当作成功，也不允许无条件重复支付或提交 |

如未来接入真实提交服务，需要服务端配合请求标识、幂等和结果查询；前端禁用按钮不能替代服务端防重机制。本轮只定义接口边界与模拟场景。

### 9.3 状态放置

简单局部状态使用 `useState`；多事件工作流使用 `useReducer` 集中更新规则。[React reducer 说明][react-reducer]

跨组件共享的数据放到最近的公共业务层，不要为了少传两个参数就引入全局状态库。只有实际复杂度证明需要时，再单独评估更复杂方案。

---

### 9.4 不同业务维度独立建模

```ts
// 建议的数据建模起点，不代表源产品完整枚举。
type ProjectStage =
  | "under-review" | "delayed" | "missing-docs"
  | "interconnection" | "inspection" | "approved";
type ProjectHealth = "on-track" | "at-risk";
type DocumentStatus = "verified" | "needs-review" | "checking";
type FindingSeverity = "pass" | "minor" | "critical";
type ResolutionStatus = "open" | "proposed" | "awaiting-approval" | "fixed";
type ConnectionStatus = "connected" | "disconnected" | "checking";
```

项目可以同时处于审查阶段且存在风险；文件可以已被 AI 检查但仍需人工审查；提交成功不等于许可审批完成。不要用一个 `status` 布尔值或单一枚举表达全部含义。

通过业务层的统一选择器生成：需求完成数、文档分类数量、材料包文件与页数、最终检查状态、可否提交和状态标签。不同页面展示同一个项目时使用相同实体，不在每张卡片各写一份不同数据。

图中 78% 项目进度、91% 置信度、87% 合规检查、94% 打包卡片和 96% 最终检查并非同一个数值。保留不同指标的含义；不同图中的示例数据用独立快照区分，不仅凭静态图断言其时间顺序。没有真实算法时采用明确命名的演示评分输入，不能从这些数值反向编造算法。

---

## 10. 模拟数据与可操作演示

### 10.1 模拟数据要求

将项目、文档、问题、成员、活动与提交结果放在独立 fixtures 中，使用稳定 ID 和固定时间，测试不依赖当前日期或无种子的随机数。

模拟数据至少覆盖：正常项目、不同项目状态、低分或严重问题、长标题、缺失图片、空列表和失败场景。

演示数据相互一致。例如项目文件数量、分组计数、筛选结果与汇总卡片应从同一份数据计算。

### 10.2 两类演示数据

**Reference stories：** 尽量保持某一张参考图的值和外观，用于组件视觉比对；每个场景名称说明对应图号与区域。

**Workflow fixtures：** 用自洽的关系数据运行整个流程；列表、详情、文档、问题、打包和提交结果都从同一组实体派生。不能为了同时复制各图快照的数字，让同一时刻的多个页面自相矛盾。

在完整工作流中，文件变化使旧的最终检查结果失效；重新检查通过后才能进入准备提交状态。模拟通知失败不应把已提交成功的材料包改回未提交。

### 10.3 网络行为

需要异步演示时使用 MSW 模拟网络边界，使成功、失败、延迟与结果未知可以重复触发。[MSW 文档][msw]

模拟开关必须显式控制；构建真实生产应用时不得无意启用 mock worker。

模拟上传可展示进度，但必须标注模拟；仅传入本地文件不代表它已经上传到服务器。文件类型、数量与大小限制须来自参数或演示配置。

### 10.4 不允许死按钮

每个可见操作都必须：执行对应动作、进入明确的演示流程，或以禁用状态给出原因。

仅 `console.log`、无响应点击、返回空文件的“下载”按钮不算完成。若无真实回执，应生成明确标记的演示文件，或如实禁用。

在用户未授权真实外部行为时，“通知业主”“提交并支付”“发送设计师”等只能模拟，不能连接真实服务。

### 10.5 错误、重试与结果未知

所有模拟请求至少区分 `validation`、`network`、`server`、`permission`、`timeout` 和 `unknown`；界面文案不能只显示“Something went wrong”。错误对象应带稳定 `code`、面向用户的 `message`、是否可重试和原始 `requestId`（如有）。

重试前保留用户输入、已选文件和确认项；提交 / 支付类动作必须用稳定幂等键模拟，重复点击不能生成第二个回执。`unknown` 只能进入查询或人工处理状态，不能自动改写为成功或失败。

上传、修复、检查和提交的模拟延迟、失败概率与结果由 fixture 或 MSW handler 显式控制，测试不得依赖真实时间、随机数或网络。

---

## 11. Storybook、可访问性与测试

### 11.1 Storybook 要求

每个交付组件至少包含基础示例、适用变体、关键状态和边界内容。每个重要动作可以直接操作，参数说明与实际接口一致。

Stories 与演示应用共享源码、设计变量和模拟数据规则。不能另写一套专供截图好看的组件。

Storybook 的 React/Vite 集成与 Vitest 插件分别参考 [框架文档][storybook-vite]、[测试文档][storybook-vitest]。

### 11.2 六个首轮样板的验收重点

| 组件 | 必须验证 |
|---|---|
| Button | 变体、尺寸、禁用、加载、键盘操作、不重复触发 |
| Badge | 各语义、长标签、数字、图标与文字对齐 |
| Tabs | 切换内容、键盘导航、多实例共享布局隔离 |
| Dialog | 打开关闭、Esc、焦点进入与恢复、遮罩和退出动画 |
| ProjectCard | 多状态、长地址、缺图、进度边界、菜单与主入口不冲突 |
| ScoreGauge | 0、中间值、最大值、无数据、非法值、动画与减少动态效果 |

### 11.3 可访问性底线

- 按钮、链接、输入框使用正确语义；图标按钮有可访问名称。
- 每个输入项有明确标签；错误文字与对应字段建立关联。
- 弹窗有标题，进入时焦点合理，关闭后焦点返回触发来源；触发来源消失时有合理回退。
- 浮层中的可点击元素、Esc 行为、Tab 顺序和背景滚动符合预期。
- 不只用颜色表达严重程度、完成与失败。
- 键盘焦点不能被默认样式删除。
- 加载、提交结果与错误适当提供状态通知，避免每帧动画读数造成反复播报。
- 大按钮、小图标和表格行的可点击范围必须可实际操作。

采用 Base UI 作为底层并不免除组合后的人工与自动检查责任。[Base UI 说明][base-ui]

### 11.4 三类验收

| 类型 | 验证内容 |
|---|---|
| 视觉 | 字体、尺寸、颜色、间距、阴影、布局、截断与溢出 |
| 交互 | 搜索筛选、页签、折叠、菜单、弹窗、上传、键盘与聚焦 |
| 流程 | 修复后数据一致、重复点击保护、失败输入保留、结果未知处理 |

### 11.5 截图回归

第一步是 **指定参考图中的组件区域与实际浏览器截图的校准**；对视频明确出现的动效另做核验。经过人工确认的浏览器截图，才成为之后的回归基准。

新生成的快照不等于已经还原正确；不得为了让测试通过而自动接受所有差异。

固定浏览器、操作系统或容器环境、视口、缩放、字体、数据、时间、图片加载条件与动画状态。不同平台渲染可能不同，应维护合适的基准。[Playwright 视觉对比说明][playwright-snapshots]

静态截图测试固定或关闭动画，并等待字体、图片与布局稳定；动效验收另用交互测试和浏览器录屏检查，不用关闭后的截图宣称动画已验证。

### 11.6 参考覆盖测试

在 `docs/component-inventory.md` 为 101 个参考 ID 保留行；同一组件可关联多个参考 ID。验收前检查：ID 不重复、没有删除参考条目、每条有实现路径、Story 或明确说明。

每次报告分别统计 `implemented / visual-verified / interaction-tested / motion-verified`。写出未确认项，不能把“代码文件存在”当成“视觉与动效均通过”。

对照图 01/02/03 分组创建 Stories；工程补充状态放在单独的扩展分组。这样可以逐图验收，而无需在完整应用中到处寻找某个小状态。

### 11.7 建议命令契约

新仓库应提供以下脚本，名称可因既有工程调整，但文档必须与实际一致：

```text
pnpm dev               启动完整演示应用
pnpm storybook         启动组件展示
pnpm typecheck         类型检查
pnpm lint              代码检查
pnpm test              非交互式组件 / 逻辑测试
pnpm test:e2e          完整流程测试
pnpm test:visual       截图回归测试
pnpm build             构建组件包与演示应用
pnpm build-storybook   构建静态组件展示
pnpm test:consumer     独立消费项目验证
```

这是要求 Codex 建立的脚本接口，不表示脚本已经存在。不得用空命令或总是返回成功的脚本伪装验收。

### 11.8 质量门禁与环境记录

每次阶段交付至少记录以下信息：

| 门禁 | 通过条件 | 未满足时的状态 |
|---|---|---|
| 依赖 | `pnpm install --frozen-lockfile` 成功且锁文件未被隐式改写 | `blocked` |
| 类型 / 代码质量 | `typecheck`、`lint` 返回真实退出码 0 | `failed` |
| 单元 / 交互 | 适用测试通过；不适用必须写原因 | `failed` 或 `not-applicable` |
| 浏览器 | 在固定浏览器、视口和字体下完成手动或 Playwright 检查 | `not-run` / `blocked` |
| 视觉 | 人工确认基准后才更新快照；差异有说明 | `visual-pending` |
| 素材 | `manifest.json` 的大小、哈希与媒体元数据匹配 | `blocked` |

报告中固定记录 Node、pnpm、浏览器版本、操作系统、视口、DPR、减少动态效果设置、Git 提交和执行命令。任何 `not-run`、`failed` 或 `blocked` 都必须保留原因与下一步，不得由“构建成功”覆盖。

---

## 12. 分阶段实施计划

### P0 · 检查工程与建立依据

交付：工程检查、依赖决策、三张图的 101 条参考映射、组件状态清单、设计变量草案。先核对参考图为用户提供的 Permitly 参考；实现产物使用 infission 品牌，不得引入其他主题图片。

退出条件：能够明确区分已确认参考、推测、补充设计和素材缺失；没有覆盖用户已有代码。

### P1 · 六个样板与开发基础

交付：组件包、演示应用、Storybook、基础测试，以及 `Button`、`Badge`、`Tabs`、`Dialog`、`ProjectCard`、`ScoreGauge`。

退出条件：六个样板具备主要状态；开发与构建运行成功；完成浏览器检查；待校准差异有记录。

**默认首次任务到这里结束。** 样板可以暂用明确标记的演示数据，但不得声称已经完整复刻视频。

### P2 · 第一条完整业务流程

打通：

```text
项目列表 → 项目详情 → 查看问题 → 修复确认 → 模拟修复 → 状态与数据同步更新
```

交付：需要的导航、筛选、详情、问题面板和模拟接口。

退出条件：正常、失败、等待审批或其他适用分支可操作；页面间数据一致；交互与流程测试覆盖主要分支。

### P3 · 文档中心与仪表盘模块

交付：文档分组、搜索筛选、文件行、上传演示、文档分析面板，以及统计、流程、风险、评分等模块。

退出条件：数据变化会更新相关统计；无数据、缺图、失败、长内容可用；关键模块有 Stories。

### P4 · 打包与提交流程

交付：材料分组、最终检查、目标机构、提交前选项、确认弹窗、处理中、成功、失败和结果待确认。

退出条件：不重复提交，不伪造成功，模拟与真实行为边界清楚；结果页与提交数据一致。

### P5 · 全量复核、动效校准与库交付

交付：全量清单闭环、三张图的参考条目逐项复核，视频动效另行核验、动效校准、可访问性检查、视觉回归与独立消费验证。

退出条件：清单中没有无说明的缺失；构建产物可安装；实际运行结果与交付报告一致。

各阶段只实现其必要依赖，避免为了“建立组件库”一次性引入大量暂时不用的组件与工具。

---

## 13. 组件包构建与独立复用

第一阶段允许工作区内直接开发和复用；正式交付时必须验证安装后的产物，而不只是源码别名可用。

发布形态要求：

- 清楚的公共导出入口与必要的子路径。
- TypeScript 类型声明；Vite 构建之外配置实际可用的声明生成方式。
- 可显式导入的编译 CSS 与可覆盖的主题变量。
- React / React DOM 依赖与外置策略明确，不把重复 React 运行时打进包。
- ESM 作为默认目标；只有确有消费者需要时增加其他格式。
- 正确处理 CSS 副作用，避免生产构建裁掉必要样式。
- 无演示照片、mock worker、Storybook 依赖、项目业务 store 或私密配置混入通用发布包。
- 不依赖消费项目的源码别名、路由和 Tailwind 扫描设置。

Vite 提供库模式与依赖外置配置；实际配置参考 [构建说明][vite-build]。

独立消费验证必须通过打包产物或工作区等价产物安装，而不是直接将源码路径映射回仓库。

测试一个不启用 Tailwind 的最小 React 消费项目，至少能渲染按钮、标签、页签、弹窗与仪表；同时测试该组件库不破坏宿主原有按钮与文字样式。

第一版不默认发布到公共包仓库；对外发布属于单独操作，需要用户授权。

### 13.1 对外安装契约（必须在 P1/P5 验收）

本组件库的第一消费者目标是“已有 React 项目”。组件包必须能通过打包产物安装，而不是只在本仓库的源码别名下工作。推荐先交付一个包，避免过早拆成多个包：

```text
infisson_ui
├─ 组件入口：infisson_ui
├─ 样式入口：infisson_ui/styles.css
└─ 变量入口：infisson_ui/tokens.css（确实需要单独覆盖时提供）
```

安装契约至少包含：

- `package.json` 提供 `exports`、`types`、`module` / `import` 和 CSS `sideEffects` 声明；所有公开导出都能从包名或明确子路径导入。
- React 与 React DOM 作为 `peerDependencies`，不把第二份 React 打进产物；具体支持范围和 Node / 浏览器矩阵写入 README 并在 CI 中验证。
- 消费者不需要安装 Tailwind，也不需要把组件包源码加入 Tailwind 扫描路径；组件 CSS 在包内编译，主题通过命名空间 CSS 变量覆盖。
- 组件样式使用 `inf-` 类名前缀或等价隔离策略；不修改宿主 `body`、标题、原生按钮和表单默认样式。Portal、弹窗遮罩、z-index 和 CSS 变量继承要在消费项目中验证。
- 模块初始化不读取 `window`、`document` 或应用路由；SSR / 预渲染项目可以安全导入，客户端专属行为在挂载后执行。
- 包中不包含 Storybook、mock worker、演示图片 / 视频、业务 fixture、私密配置和 playground 路由。
- 对外 API 采用语义化版本；删除或改变公共接口前先经过弃用周期。每个公共组件都有迁移说明和最小示例。

### 13.2 独立消费验收矩阵

发布候选版本必须在临时目录完成以下验证：

1. 使用 `pnpm pack` 生成 tarball，在不启用 Tailwind 的最小 React + Vite 项目中安装并渲染 `Button`、`Badge`、`Tabs`、`Dialog`、`ScoreGauge`。
2. 在一个 SSR / 预渲染场景中完成导入、构建和水合检查；至少覆盖一个 Next.js 或同等环境。
3. 在宿主项目已有按钮、标题、表单、Portal 和全局 CSS 的情况下检查样式不被污染。
4. 使用键盘、减少动态效果和窄桌面视口验证公共组件；失败时保留可复现的消费项目。
5. 检查 `dist` 中不存在 `references/`、`apps/`、`.storybook/`、mock 数据或源码别名路径。

### 13.3 其他项目的接入方式

“安装组件库”提供稳定的模块和样式接口；它不会根据任意已有页面自动推断并重写产品 UI。迁移其他项目时按以下顺序推进：

```text
安装 infisson_ui
  → 引入 styles.css
  → 在页面边界接入 tokens / 主题变量
  → 用公共组件替换局部按钮、标签、页签、弹窗和表单
  → 再接入通用组合组件
  → 最后迁移业务工作流和数据适配器
```

业务组件只在数据模型和流程语义稳定后发布为独立入口；`ProjectCard`、合规审查和提交流程不能反向成为通用 UI 包的隐式依赖。若未来需要自动迁移旧页面，另行设计 codemod 或适配层，不把它混入组件包运行时。

### 13.4 GitHub 开源交付模式

目标交付形态是一个公开 GitHub 仓库和一个可安装的 npm 包。仓库负责源码、问题讨论、贡献协作、文档与版本发布；npm 负责被其他项目下载和安装。GitHub Packages 可以作为组织内部或私有分发渠道，不能取代面向公开消费者的安装说明。

公开仓库至少包含：

```text
README.md             安装、导入、主题覆盖、浏览器支持、示例
LICENSE               明确开源授权
CONTRIBUTING.md       本地开发、提交、PR 和测试约定
CODE_OF_CONDUCT.md    社区行为规范
SECURITY.md           漏洞报告方式
CHANGELOG.md          版本变化和迁移说明
.github/workflows/    CI、构建、消费项目、发布工作流
packages/ui/          可发布源码
tests/consumer-smoke/ 独立安装验证
apps/playground/      组件演示，不进入 npm 包
```

README 至少提供如下可复制的安装与调用示例（包名是暂定工作名，发布前确认 npm scope 和 GitHub 组织名）：

```bash
pnpm add infisson_ui
```

```tsx
import { Button, Badge } from "infisson_ui";
import "infisson_ui/styles.css";

export function Example() {
  return (
    <div data-infission>
      <Badge tone="success">Ready</Badge>
      <Button variant="brand">Open project</Button>
    </div>
  );
}
```

发布工作流必须先执行类型检查、lint、单元 / 交互测试、构建、独立消费测试和包内容检查，再由版本标签触发 npm 发布。发布动作应使用受保护的 GitHub Environment、最小权限和可信发布机制；任何发布失败都不能创建成功版本说明。源码仓库与 npm 包版本保持一致，使用语义化版本和变更日志。

参考素材中的原始 Permitly 图片和视频只留在开发参考目录，不进入公开 npm 包；如果公开 GitHub 仓库不具备这些素材的再发布授权，应将它们从公开仓库移到受控存储，并保留不可公开的本地参考清单。

---

## 14. 完成标准与交付报告

### 14.1 每个组件的完成标准

- [ ] 有明确的数据 / 参数接口与正确的层级归属。
- [ ] 有可追溯参考或明确的补充设计标记。
- [ ] 使用统一设计变量，没有无理由复制样式。
- [ ] 默认、关键变体与适用边界状态已实现。
- [ ] 实际交互可操作，不是截图或空事件。
- [ ] 动效可中断，减少动态效果模式可用。
- [ ] 有 Storybook 示例与适用测试。
- [ ] 有 `docs/components/<component>.zh-en.md` 中英文双语帮助文件，包含安装 / 导入、完整 Props 表、可复制调用示例、状态与边界、无障碍行为、主题变量、至少一张参考配图或 Mermaid 图。
- [ ] 帮助文件中的调用方式已与包名 `infisson_ui`、公共导出和实际构建产物核对。
- [ ] 图片静态证据、视频已核对动效和推测行为分别记录；未确认的视频细节不能标成完成。
- [ ] 完成真实浏览器检查；未检查部分已注明。
- [ ] 已更新组件清单、状态与已知差异。

### 14.2 每次阶段交付报告

```text
1. 本轮目标与实际完成范围。
2. 新增 / 修改的关键文件。
3. 已实现组件、状态、交互与动效。
4. 已核对的参考图区域 / 参考帧，以及未确认的原视频细节。
5. 实际执行的命令、通过 / 失败结果。
6. 浏览器检查结果与相关截图 / 录屏路径。
7. 未执行检查及原因。
8. 未完成项、已知差异、下一阶段的明确任务。
```

“文件已生成”“构建通过”“交互测试通过”“视觉已核对”“全部清单完成”是不同结论，不能互相替代。

如果环境缺少浏览器、依赖下载或素材权限，应准确报告；不得凭代码阅读宣称完成视觉验收。

### 14.3 文档与素材一致性

交付前运行一次一致性检查：本轮交付物和参考文件中列出的仓库路径均存在；参考 ID 为 A01–A37、B01–B28、C01–C36 且无重复；`docs/component-inventory.md` 与第 6 节的组件名和来源一致；`references/manifest.json` 与实际媒体一致。缺失文件、哈希不符、参考 ID 变更或绝对路径残留均视为交付阻塞。

---

## 15. 可以直接发给 Codex 的首轮任务

```text
请先完整阅读仓库根目录的 INFISSION_CODEX_IMPLEMENTATION_SPEC.md，
以及现有 AGENTS.md 和项目配置，然后按文档执行 P0 与 P1。

目标是依据三张原始 Permitly 参考图建立 infission 可复用 React 组件库及开发验证环境，
不是继续生成设计图，也不是把组件展板拼成三个静态长网页。

首先检查现有仓库、包管理器、依赖版本和 references 中的素材。
已有工程不要擅自重建、覆盖或大规模迁移。
新工程按规范选择相互兼容的版本，并保留锁文件。

本轮完成：
1. 核对三张原始 Permitly 参考图，保留 101 个参考 ID，并将实现品牌统一为 infission，建立组件与状态清单、依赖决策和设计变量。
2. 通用组件包、演示应用、Storybook 与基础测试。
3. Button、Badge、Tabs、Dialog、ProjectCard、ScoreGauge。
4. 每个组件的关键变体、交互、必要动效与边界示例。
5. 实际执行类型检查、构建、适用测试与浏览器检查。

静态外观与范围按用户指定的三张原始 Permitly 参考图实现，产品品牌文案统一使用 infission；原视频用于补充动效和页面关系。
视频未确认的细节与补充设计要分别标记，禁止冒充精确还原。
素材缺失时先完成可独立推进的工程基础，并记录视觉核验阻塞。

ProjectCard 属于业务组件，放在演示应用的 features 中；
其他通用组件保持不依赖 infission 业务。

不接入真实 AI、支付、提交、邮件或存储服务。
不自动发布组件包，不加入本阶段无关的大量依赖。

本轮不铺开其他页面，不执行 P2–P5。
完成后按文档第 14 节报告结果，明确未执行的检查与剩余差异。
```

---

## 16. 仓库长期指令：AGENTS.md 建议内容

本文件是完整开发规范，不要整份复制为 `AGENTS.md`。详细清单通过显式读取本文获取，长期指令只保留入口和关键约束。可以在仓库根目录保留较短的长期指令，明确要求按当前任务读取相关章节。

Codex 支持读取项目中的 `AGENTS.md`；其发现范围与覆盖规则参考 [官方说明][codex-agents]。已有指令需要合并，不得覆盖删除。

下面是供新仓库使用的内容示例：

```markdown
# 项目工作规范

详细规范位于 INFISSION_CODEX_IMPLEMENTATION_SPEC.md。
修改组件、交互、动效、测试或构建前，读取与当前任务相关的章节。
首次任务读取完整规范，默认只执行 P0 与 P1。

## 目标
项目固定为 infission。依据指定的三张原始 Permitly 参考图建立可复用组件库、Storybook 与演示应用。
不生成其他主题的图，不把组件展板的标题编号当成产品内容。

## 工程约束
- 保留既有工程、用户修改、包管理器与锁文件。
- 通用组件不得依赖演示业务、接口地址、路由或应用级状态。
- 使用统一设计变量与统一交互底层，不混入第二套成品 UI 方案。
- Storybook 和演示应用使用同一份组件源码。
- 无授权不连接真实外部服务、不支付、不发送通知、不发布包。

## 参考与验收
- 仅使用指定的三张原始 Permitly 参考图作为静态基线；产品实现统一使用 infission 品牌，视频用于补充动效；参考冲突先记录。
- 实现状态、来源状态和测试状态分别记录。
- 每次修改更新适用的 Stories、测试与组件清单。
- 执行实际可用的检查，不用空脚本假装通过。
- 未执行检查、缺失素材和视觉差异必须如实报告。
```

---

## 17. 官方技术参考

以下官方资料用于查证依赖能力与实施细节，整理日期为 **2026-09-30**。项目实施约束以本文为准；依赖 API 与安装参数以实施时对应版本的官方文档为准。

| 主题 | 官方资料 |
|---|---|
| React 状态组织 | [Extracting State Logic into a Reducer][react-reducer] |
| Vite 构建与库模式 | [Building for Production][vite-build] |
| shadcn/ui 组件源码方式 | [Introduction][shadcn] |
| shadcn/ui 与 Vite | [Vite installation][shadcn-vite] |
| Base UI | [About Base UI][base-ui] |
| Tailwind 主题变量 | [Theme variables][tailwind-theme] |
| Motion 安装 | [Motion for React installation][motion-install] |
| Motion 布局动画 | [Layout animations][motion-layout] |
| Motion 与 Base UI | [Animate Base UI components][motion-base-ui] |
| Motion 可访问性 | [Accessibility][motion-accessibility] |
| Lucide React | [Lucide for React][lucide] |
| Storybook React / Vite | [Framework integration][storybook-vite] |
| Storybook / Vitest | [Vitest addon][storybook-vitest] |
| Playwright 截图验收 | [Visual comparisons][playwright-snapshots] |
| MSW | [Introduction][msw] |
| TanStack Table | [Introduction][tanstack-table] |
| Codex 项目指令 | [Custom instructions with AGENTS.md][codex-agents] |

[react-reducer]: https://react.dev/learn/extracting-state-logic-into-a-reducer
[vite-build]: https://vite.dev/guide/build#library-mode
[shadcn]: https://ui.shadcn.com/docs
[shadcn-vite]: https://ui.shadcn.com/docs/installation/vite
[base-ui]: https://base-ui.com/react/overview/about
[tailwind-theme]: https://tailwindcss.com/docs/theme
[motion-install]: https://motion.dev/docs/react-installation
[motion-layout]: https://motion.dev/docs/react-layout-animations
[motion-base-ui]: https://motion.dev/docs/base-ui
[motion-accessibility]: https://motion.dev/docs/react-accessibility
[lucide]: https://lucide.dev/guide/react
[storybook-vite]: https://storybook.js.org/docs/get-started/frameworks/react-vite
[storybook-vitest]: https://storybook.js.org/docs/writing-tests/integrations/vitest-addon
[playwright-snapshots]: https://playwright.dev/docs/test-snapshots
[msw]: https://mswjs.io/docs/
[tanstack-table]: https://tanstack.com/table/v8/docs/introduction
[codex-agents]: https://developers.openai.com/codex/guides/agents-md


---

## 18. 本次文件包说明

本次交付包含开发文档、参考素材和正在按 A/B/C 分区扩展的 `infisson_ui` React 工程；组件完成度仍以清单、测试、帮助文件和真实检查记录为准。

- `INFISSION_CODEX_IMPLEMENTATION_SPEC.md`：本规范，包含技术方案、101 条图示参考映射、动效、流程、实施顺序和验收。
- `AGENTS.md`：供新仓库使用的精简项目指令；已有仓库只合并，不覆盖用户原有指令。
- `docs/component-inventory.md`：由第 6 节生成的 101 条映射待执行检查表，初始实现和验收状态均为未开始。
- `docs/spec-review.md`：本次深度评估、修订理由、风险与后续建议。
- `references/infission/`：三张用户提供的原始 Permitly 参考图，按 01/02/03 唯一命名；实现时作为 infission 静态基线。
- `references/source/`：用户提供的高清原视频，供开发时核对动效。
- `references/reference-map.md`：素材、截图 / 截帧与参考 ID 的证据记录入口。
- `references/manifest.json`：素材文件名、尺寸、时长、大小和 SHA-256，便于防止误用其他同名文件。
- `docs/components/`：每个已完成组件的中英文帮助文件，包含 Props、调用、状态、无障碍、主题和配图。

单独下载本 Markdown 时，技术方案和清单仍可阅读；图片与视频相对路径需配合完整包或本地补齐的素材使用。包中没有字体文件、真实 API 密钥、真实支付或真实通知配置。

