import type { IInputField } from "./input-field";

export type InputFieldGridWidth = "full" | "half";

export interface IInputFieldGrid extends IInputField {
  flex?: InputFieldGridWidth;
  show?: boolean;
  index?: any;
}
