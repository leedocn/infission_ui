# 动效规格 / Motion Specification

**证据规则 / Evidence rule:** 图片只证明静态结果；视频只证明已观察的时刻。未做逐帧审计时，不写成精确还原。

## 已实现的动效 / Implemented motion

| 行为 / Behavior | 当前实现 / Current implementation | 证据状态 / Evidence |
|---|---|---|
| 控件悬停与按压 / Hover and press | Native buttons and links expose hover/focus/active feedback; selected states update immediately. | source + tests; visual review open |
| 侧栏与筛选 / Sidebar and filters | Collapse, tabs, filters, workspace menu, and view controls update local state and labels. | browser smoke + tests |
| 进度与仪表 / Progress and gauges | Score and compliance gauges support clamped keyboard/pointer updates where `interactive` is enabled; progress bars transition their fill. | source + tests; timing not video-audited |
| 弹窗 / Dialogs | Native dialog open/close, backdrop, close button, and Escape; workflow dialog/progress overlay animate entry. | C01–C03 video observation + tests |
| 上传 / Dropzone | Drag-over state is visible; dropped or selected files are passed to the host callback. | source + tests; visual review open |
| 提交反馈 / Submission feedback | Spinner, progress fill, success banner, and status transitions are local demo states. | C25–C36 inventory evidence |

CSS uses `--inf-motion-fast: 140ms` and `--inf-motion-standard: 220ms`; workflow spinner/progress use component-local values. These are implementation values, not claims about source-video frame timing.

## 清单状态 / Inventory status

- C01–C06, C08–C22, and C25–C36 are marked `video-confirmed` where the inventory records an observed video moment. C07 is marked `image-confirmed` for the motion column.
- C23–C24 are marked `implementation-proposal`; no exact video behavior is claimed.
- Most A/B entries remain `not-verified` for motion and `visual-pending` for static review. `not-applicable` is used only for display-only markers.

## 无障碍与待办 / Accessibility and open work

`prefers-reduced-motion: reduce` removes workflow entry animations/spinner motion and global transitions. Focus-visible styles and native keyboard semantics are required. Remaining work is a manual keyboard/screen-reader pass, contrast audit, and per-component comparison with the supplied videos; do not add timing claims without reproducible evidence.
