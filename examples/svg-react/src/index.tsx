import { createRoot } from "react-dom/client";

import { Counter } from "./components/Counter.tsx";

const root = createRoot(document.querySelector("#root")!);

root.render(
  <>
    <h1>ESAssets - SVG React example</h1>
    <div>
      <Counter />
    </div>
  </>,
);
