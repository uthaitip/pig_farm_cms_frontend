export class ModalOption {
  title: String = "ทำรายการแจ้งเตือนสำเร็จ";
  titleClass: String = "text-primary text-lg";
  icon: String = "check-circle";
  iconSize: String = "h-20 w-20";
  iconColor: String = "text-primary";
  btnSubmitText: String = "ตกลง";
  btnCancelText: String = "";
  onSubmit: Function = () => {};
  onReject: Function = () => {};
  onHide: Function = () => {};
  onShow: Function = () => {};

  modalSize: String = "max-w-md";

  constructor(params: Partial<ModalOption>) {
    Object.assign(this, params);
  }
}
