import "infisson_ui/styles.css";
import "../src/preview.css";

const preview = {
  parameters: {
    controls: { expanded: true },
    layout: "centered",
    backgrounds: {
      default: "paper",
      values: [{ name: "paper", value: "#f5f6f8" }, { name: "ink", value: "#111214" }],
    },
  },
};

export default preview;
