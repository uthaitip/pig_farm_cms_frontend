export type InputFieldType = "text" | "number" | "datepicker" | "radio" | "checkbox" | "dropdown" | "file" | "textarea" | "topic";
export type InputFieldWidth = "full" | "half" | string;

export interface IInputField {
  key?: string;
  label?: string;
  value?: any;
  disabled?: boolean;
  readonly?: boolean;
  type?: InputFieldType;
  placeholder?: string;
  required?: boolean;
  checked?: boolean;
  children?: IOptionData[];
  width?: InputFieldWidth;
  suffixIcon?: string;
  prefixIcon?: string;
  maxLength?: number;
  formatOnBlur?: boolean;

  /*
    type="number"
  */
 step?: number,
 min?: number | Date | String,
 max?: number | Date | String,

  /*
    label and input เรียงจากซ้ายไปขวา
  */
  isLeftToRight?: boolean;
  /*
    ใช้ useForm หรือ <Form> ของ vee-validate
  */
  useForm?: boolean;
  /*
    ใช้เปิด-ปิดการแก้ไขรายละเอียดไฟล์ สำหรับ type=file
  */
  canEditDescFile?: boolean;
  /*
    ใช้สำหรับระบุสกุลไฟล์ที่รองรับ เช่น `.csv, image/*, .jpg, .jpeg, .png` สำหรับ type=file
  */
  acceptFile?: string;

  /*
    ใช้กำหนด option IMask(https://imask.js.org/) สำหรับ type=text 
  */
  maskOption?: Object;

 /*
    style children
  */
  classPosition?: string;
}

export interface IOptionData {
  label?: string;
  key?: string;
  value?: any;
  textClass?: any;
  disabled?: boolean;
}
