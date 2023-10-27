import { useState } from "react";

import { Minus, Plus } from "../assets.svg.ts";

export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <>
      <button onClick={() => setCount(count + 1)} type="button">
        <Plus />
      </button>
      <span>Count: {count}</span>
      <button onClick={() => setCount(count - 1)} type="button">
        <Minus />
      </button>
    </>
  );
}
