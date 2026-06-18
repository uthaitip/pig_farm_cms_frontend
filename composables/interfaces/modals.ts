
import { Modal } from "flowbite";

export interface ILoading {
  show: Function;
  hide: Function;
}

export interface IModal {
  modal: Modal;
  show: Function;
  hide: Function;
}

export interface IModalRef {
  show: (row?: any) => void
  hide: () => void
  setError: (msg: string) => void
}
