import { InputField } from "./input-field";
import type { IInputFieldGrid } from "../interfaces/input-field-grid";

export class InputFieldGrid extends InputField implements IInputFieldGrid {
  constructor(params: Partial<IInputFieldGrid>) {
    super({
      flex: "half",
      show: true,
      ...params,
    });
    Object.assign(this, {
      flex: "half",
      show: true,
      ...params,
    });
  }
}
