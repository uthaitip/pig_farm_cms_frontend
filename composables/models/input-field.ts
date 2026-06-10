import type { IInputField, IOptionData } from "../interfaces/input-field";

export class InputField implements IInputField {
  constructor(params: Partial<IInputField>) {
    Object.assign(this, {
      key: "",
      label: "",
      value: "",
      disabled: false,
      readonly: false,
      type: "text",
      placeholder: "",
      required: false,
      checked: false,
      width: "full",
      maxLength: 256,
      isLeftToRight: false,
      useForm: true,
      canEditDescFile: false,
      
      ...params,
      children: params.children?.map((e: any) => new OptionData(e)) ?? [],
    });
  }
}

export class OptionData implements IOptionData {
  constructor(params: Partial<IOptionData>) {
    Object.assign(this, {
      textClass: "text-appblack",
      ...params
    });
  }
}
