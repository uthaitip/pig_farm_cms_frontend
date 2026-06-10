export function defaultAlertSuccess(
  title: String = "ทำรายการสำเร็จ",
  options?: {
    onSubmit?: Function | Promise<any>
    onReject?: Function | Promise<any>
    onHide?: Function | Promise<any>
    onShow?: Function | Promise<any>
    btnSubmitText?: String
    btnCancelText?: String
    modalSize?: String
  }
): any {
  return {
    ...options,
    title,
    titleClass: "text-primary-500 text-xl mb-4 text-center",
    btnSubmitText: options?.btnSubmitText ?? "ตกลง",
    btnCancelText: options?.btnCancelText ?? "",
    iconSize: "w-20 h-20",
    iconColor: "text-white bg-primary-500 rounded-full",
  }
}

export function defaultAlertError(
  title: String = "ทำรายการไม่สำเร็จ",
  options?: {
    onSubmit?: Function | Promise<any>
    onReject?: Function | Promise<any>
    onHide?: Function | Promise<any>
    onShow?: Function | Promise<any>
    btnSubmitText?: String
    btnCancelText?: String
    modalSize?: String
  }
): any {
  return {
    ...options,
    title,
    titleClass: "text-apperror text-xl mb-4 text-center",
    btnSubmitText: options?.btnSubmitText ?? "ตกลง",
    btnCancelText: options?.btnCancelText ?? "",
    icon: "x-mark",
    iconSize: "w-20 h-20",
    iconColor: "text-white bg-red-800 rounded-full",
  }
}

export function defaultAlertConfirm(
  title: String = "ยืนยันการดำเนินการ",
  onSubmit: Function | Promise<any>,
  options?: {
    onReject?: Function | Promise<any>
    onHide?: Function | Promise<any>
    onShow?: Function | Promise<any>
    btnSubmitText?: String
    btnCancelText?: String
    modalSize?: String
    icon?: String
    iconSize?: String
  }
): any {
  return {
    title,
    titleClass: "text-red-600 text-xl mb-4 text-center",
    btnSubmitText: options?.btnSubmitText ?? "ตกลง",
    btnCancelText: options?.btnCancelText ?? "ยกเลิก",
    onSubmit,
    icon: "trash",
    iconSize: "w-20 h-20",
    iconColor: "text-white bg-red-600 rounded-full py-6 px-[1.6rem]",
    ...options,
  }
}

export function defaultAlertWarning(
  title: String = "คำเตือน",
  onSubmit: Function | Promise<any>,
  options?: {
    onReject?: Function | Promise<any>
    onHide?: Function | Promise<any>
    onShow?: Function | Promise<any>
    btnSubmitText?: String
    btnCancelText?: String
    modalSize?: String
  }
): any {
  return {
    ...options,
    title,
    titleClass: "text-[#E4A11B] text-xl mb-4 text-center",
    btnSubmitText: options?.btnSubmitText ?? "ตกลง",
    btnCancelText: options?.btnCancelText ?? "ยกเลิก",
    onSubmit,
    icon: "exclamation-circle",
    iconSize: "w-20 h-20",
    iconColor: "text-white bg-[#E4A11B] rounded-full py-6 px-[1.6rem]",
  }
}
