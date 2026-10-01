# infisson_ui

Private, installable React components for the infission design system. The
package is distributed under Apache-2.0 and keeps React and React DOM as peer
dependencies.

```bash
# Build the private tarball from the repository, then install it in a consumer.
pnpm pack:library
pnpm add ./infisson_ui-0.1.0.tgz
```

```tsx
import { Button, ScoreGauge } from "infisson_ui";
import "infisson_ui/styles.css";

export function Example() {
  return (
    <>
      <Button variant="brand">Open project</Button>
      <ScoreGauge value={87} label="Compliance" />
    </>
  );
}
```

The generated package tarball includes compiled CSS and TypeScript declarations. The
source repository contains the complete bilingual component help under
`docs/components/`, including Props, states, accessibility, theming, and
reference evidence.

Override the semantic `--inf-*` variables on a local `[data-infisson]` scope to
apply a host theme; components do not write styles to `body`.
