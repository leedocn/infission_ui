import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { Badge, Button, Dialog, ScoreGauge, TabPanel, Tabs, type TabItem } from "infisson_ui";
import "infisson_ui/styles.css";

const items: TabItem[] = [
  { id: "overview", label: "Overview" },
  { id: "documents", label: "Documents", count: 10 },
];

function App() {
  const [tab, setTab] = useState("overview");
  const [open, setOpen] = useState(false);
  return (
    <main data-infisson style={{ display: "grid", gap: 20, maxWidth: 720, margin: "40px auto", padding: 24 }}>
      <h1>infisson_ui consumer smoke</h1>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <Badge tone="success" dot>Ready</Badge>
        <Button onClick={() => setOpen(true)}>Open dialog</Button>
        <ScoreGauge value={87} label="Compliance" />
      </div>
      <Tabs id="smoke-tabs" items={items} value={tab} onValueChange={setTab} />
      <TabPanel tabId="smoke-tabs-overview-panel" labelledBy="smoke-tabs-overview" active={tab === "overview"}>Overview content</TabPanel>
      <TabPanel tabId="smoke-tabs-documents-panel" labelledBy="smoke-tabs-documents" active={tab === "documents"}>Documents content</TabPanel>
      <Dialog open={open} onOpenChange={setOpen} title="Smoke dialog" actions={<Button onClick={() => setOpen(false)}>Close</Button>}>Package consumer check</Dialog>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(<StrictMode><App /></StrictMode>);
