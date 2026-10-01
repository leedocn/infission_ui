# infission 参考证据地图

本文件记录素材来源、参考 ID 分组和后续截图 / 截帧证据。静态图是 infission 组件的范围与外观基线；三张原始文件含 Permitly 品牌字样，代码实现和产品文案统一使用 infission。视频只补充已核对的动效与页面关系；从视频截出的帧不改变三张原始图的基线。

## 素材入口

| 资源 | 路径 | 证据用途 | 当前状态 |
|---|---|---|---|
| 图 01 | `references/infission/01_global_dashboard_projects.png` | A01–A37 infission 静态范围与外观（原图含 Permitly） | image-confirmed |
| 图 02 | `references/infission/02_detail_documents_compliance.png` | B01–B28 infission 静态范围与外观（原图含 Permitly） | image-confirmed |
| 图 03 | `references/infission/03_workflows_submission_feedback.png` | C01–C36 infission 静态范围与外观（原图含 Permitly） | image-confirmed |
| 原视频 | `references/source/SaveTwitter.Net_4umFJcgPnteHPkhA_(1200p).mp4` | 页面关系、动作顺序、动效线索 | not-verified |
| 视频审计帧 | `references/frames/workflow-audit/` | 仅由 workflow 代理维护；用于记录视频时间点，不是新增设计图 | in-progress |

为方便开发工具和子代理定位，四份素材也在 `references/` 根目录提供同内容副本；规范归档路径仍以上表的 `infission/` 和 `source/` 为准。

For convenient tooling and sub-agent access, copies of the four supplied assets are also available at the `references/` root. The canonical archive paths remain the `infission/` and `source/` paths in the table above.

文件尺寸、字节数与 SHA-256 见 [`manifest.json`](manifest.json)。

## 证据等级

- `image-confirmed`：在指定静态图中直接可见。
- `video-confirmed`：已记录视频时间点，并完成对应浏览器行为核对。
- `implementation-proposal`：为使组件可操作而补充的实现决策。
- `required-extension`：可访问性、错误、空状态或流程安全所需的扩展。
- `not-verified`：尚未完成相应核对，不能写成精准还原。

## 截帧 / 冲突记录模板

完成视频审计后，每条记录至少包含：

| 字段 | 示例 |
|---|---|
| `referenceId` | `C23` |
| `videoTime` | `00:12.400` |
| `framePath` | `references/frames/c23-submit-progress-012400.png` |
| `observation` | 遮罩出现，按钮进入 pending |
| `implementation` | `SubmissionProgressOverlay` |
| `status` | `video-confirmed` / `conflict` |
| `notes` | 时长仍待测量；不把播放时间当业务延迟 |

抽帧命令、播放器版本和时间戳要一并记录。自动抽帧结果需要人工确认后才能成为视觉基准；未确认的冲突保留在这里，不擅自覆盖静态图基线。
