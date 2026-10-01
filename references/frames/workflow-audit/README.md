# Workflow video audit / 工作流视频审计

这些 JPEG 从 `references/source/SaveTwitter.Net_4umFJcgPnteHPkhA_(1200p).mp4` 导出，仅用于记录页面关系和交互线索。它们不是新增原始参考图，也不替代 `references/infission/03_workflows_submission_feedback.png`。These JPEGs are derived from the supplied MP4 for interaction evidence only; they are not new source designs and do not replace the static reference image.

## Source / 来源

- Source video: `references/source/SaveTwitter.Net_4umFJcgPnteHPkhA_(1200p).mp4`
- Probe: H.264, 1600×1200, 60 fps, 23.316667 s, 5,582,965 bytes.
- Extraction: `ffmpeg -i <source> -vf "fps=1,scale=400:-1" second-%02d.jpg`.
- Timestamp convention: `second-01.jpg` is approximately 00:00.000; each following image is sampled one second later. Sampling is approximate at scene boundaries; it does not assert exact animation duration.

The audit below was made against the MP4 source itself. The JPEGs are retained as local, reproducible checkpoints; they must not be treated as additional design references. / 下表只针对 MP4 原视频核对，JPEG 仅作为可复现的本地检查点，不是新增设计参考图。

Evidence levels / 证据等级:

- `video-confirmed`: the named state or page relationship is visible in the source at the approximate timestamp.
- `implementation-proposal`: the static state is visible, but the one-second sampling does not establish exact timing, easing, focus return, or intermediate frames.
- `not-verified`: no claim is made because the source does not show the behavior clearly.

## Selected frames / 关键帧

| Frame | Approx. time | Observation / 观察 | Evidence |
|---|---:|---|---|
| [00_dashboard.jpg](00_dashboard.jpg) | 00:00 | Dashboard / 仪表盘 initial view | `video-confirmed` |
| [03_projects.jpg](03_projects.jpg) | 00:03 | Projects grid appears / 项目网格 | `video-confirmed` |
| [05_project-detail.jpg](05_project-detail.jpg) | 00:05 | Project overview / 项目概览 | `video-confirmed` |
| [08_documents.jpg](08_documents.jpg) | 00:08 | Documents center / 文档中心 | `video-confirmed` |
| [11_compliance-review.jpg](11_compliance-review.jpg) | 00:11 | Compliance review / 合规审查 | `video-confirmed` |
| [12_ai-fix-dialog.jpg](12_ai-fix-dialog.jpg) | 00:12 | AI fix dialog opens / AI 修复弹窗出现 | `video-confirmed` |
| [15_review-fixed.jpg](15_review-fixed.jpg) | 00:15 | Fixed review state / 修复后审查结果 | `video-confirmed` |
| [16_package-ready.jpg](16_package-ready.jpg) | 00:16 | Package ready page / 准备提交页 | `video-confirmed` |
| [17_submit-confirmation.jpg](17_submit-confirmation.jpg) | 00:17 | Submission confirmation dialog / 提交确认弹窗 | `video-confirmed` |
| [19_submit-confirmation-action.jpg](19_submit-confirmation-action.jpg) | 00:19 | Confirmation action state / 确认操作状态 | `video-confirmed` |
| [20_package-after-submit.jpg](20_package-after-submit.jpg) | 00:20 | Package page after action / 操作后的打包页 | `video-confirmed` |
| [22_fade.jpg](22_fade.jpg) | 00:22 | Fade or transition frame / 过渡帧 | `video-confirmed` |
| [23_dashboard-loop.jpg](23_dashboard-loop.jpg) | 00:23 | Return to dashboard / 回到仪表盘 | `video-confirmed` |

The sampled sequence supports the component mapping as follows: C01–C09 around 00:12, C10–C17 around 00:16, C18–C22 around 00:17–00:19, C26–C30 around 00:20–00:21, and C31–C36 as static status labels. C23–C25 remain `implementation-proposal` for transition timing and the exact pending-button frame. / 抽样序列对应：C01–C09 约 00:12，C10–C17 约 00:16，C18–C22 约 00:17–00:19，C26–C30 约 00:20–00:21，C31–C36 为静态状态标签。C23–C25 的过渡时长与提交中按钮中间帧仍为 `implementation-proposal`。

## Implementation notes / 实现备注

- The frame sequence supports the component states in C01–C22 and C26–C36. / 帧序列支持 C01–C22、C26–C36 的页面关系和状态。
- The dedicated spinner / loading overlay in C23–C25 is visible in the static reference and is implemented as an accessible `SubmissionProgressOverlay`; the coarse one-second sample does not prove its exact duration or every intermediate frame. Its motion evidence remains `implementation-proposal` until a finer manual frame audit. / C23–C25 的 loading 遮罩在静态图中可见，已实现为可访问的 `SubmissionProgressOverlay`；一秒采样不足以证明准确时长和全部中间帧，因此动效证据仍为 `implementation-proposal`。
- The video includes original Permitly source branding. The implementation uses infisson copy and does not alter the supplied media. / 视频保留 Permitly 原始品牌，代码使用 infisson 文案，不篡改素材。
