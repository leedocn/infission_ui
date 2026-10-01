# 交互流程 / Interaction Flows

These flows describe the local demo contract. They are not integrations with a real service, payment provider, portal, storage system, or notification channel.

## 1. 应用壳 / App shell (A01–A10)

1. The sidebar starts expanded; **Collapse sidebar** changes the visible navigation state and exposes **Expand sidebar**.
2. Selecting a navigation item updates the local selection feedback; it does not change a server route.
3. The workspace button opens a menu. Selecting a fictional workspace closes the menu and updates the status text; Escape/outside click closes it.
4. Search accepts text and Enter or the submit button records the last local search. Notifications, profile actions, and the AI switch expose local open/close or toggle feedback.

## 2. 仪表盘与项目 / Dashboard and projects (A11–A37)

Buttons report local action feedback. Status filters, time range, chips, view toggle, and project tabs use selected state and host callbacks. Project cards and pipeline/table rows expose explicit open callbacks. Gauges and progress values clamp invalid input; display-only badges and counts do not pretend to be buttons.

## 3. 项目详情、文档与审查 / Detail, documents, review (B01–B28)

Breadcrumb/back and header actions call host callbacks. Tabs and category tabs support selected state and keyboard navigation. Document status and search controls update local values. Document groups expand/collapse; document rows can call preview/menu callbacks. The dropzone supports drag-over, file selection, accepted extensions, size messaging, and an error callback. Findings, sources, recommended actions, inspection schedule, and bottom actions expose host callbacks where supplied.

## 4. AI 修复 / AI fix (C01–C09)

The fix dialog opens from the workflow preview, has an accessible title/description, and closes by close button or Escape. Approval and re-check checkboxes are real native inputs. Cancel closes without applying; Apply fix enters a local applying state and invokes the supplied callback. No document is changed by this demo alone.

## 5. 打包提交 / Package submission (C10–C36)

The package panel shows completion, content groups, final check, target summary, and a before-submit checklist. Document checkboxes and preview buttons update/call host state. Preview is a callback. Submit is disabled until required checklist state permits it, then reports local pending/progress/success states. The confirmation dialog repeats the package summary and requires its confirmation checkbox; it does not charge money or file a real package.

## 错误、未知与无障碍 / Errors, unknown states, accessibility

- Empty data, missing metadata, rejected files, disabled actions, delayed progress, and failed/unknown host callbacks should be rendered as explicit local states; no local success text implies a remote success.
- Native buttons, checkboxes, tabs, selects, and dialogs provide keyboard semantics; visible focus and `aria-*` state describe selection, expansion, progress, and busy states.
- Reduced-motion users receive disabled or shortened transitions. Manual keyboard-only and screen-reader verification remains open in the acceptance record.
