import { process } from "./svg-react.tsx";

/** @source ./icons/minus.svg */
export const Minus = process({
  type: "link",
  url: "/icons/minus.svg",
});

/** @source ./icons/plus.svg */
export const Plus = process({
  type: "link",
  url: "/icons/plus.svg",
});

export const MAP = {
  minus: Minus,
  plus: Plus,
} as const;

export type AssetKey = keyof typeof MAP;
