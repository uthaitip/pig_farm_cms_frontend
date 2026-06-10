<template>
  <!-- Main modal -->
  <div :id="id" tabindex="-1" aria-hidden="true"
    class="fixed top-0 left-0 right-0 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
    :class="[zIndex ? zIndex : levelModal == 2 ? 'z-[49] items-center justify-center' : 'z-[47]']">
    <div class="relative w-full max-h-full" :class="[width]">
      <!-- Modal content -->
      <div class="relative rounded-lg dark:bg-gray-700" :class="[bg, { shadow: bg !== 'bg-transparent' }]">
        <!-- Modal header -->
        <div v-if="showHeader" class="p-4">
        <div
          class="flex items-center justify-between pb-4 border-b-[3px] border-b-primary rounded-t dark:border-gray-600"
        > 
          <div class="inline-flex items-center gap-2">
            <i v-if="!!icons" :class="[icons, 'text-primary', 'text-2xl', 'pt-2', 'px-2']"></i>
            <h3 class="text-xl font-semibold text-primary dark:text-white">
              {{ title }}
            </h3>
          </div>
          <div class="flex items-center space-x-2">
            <span v-if="titleRight != null" class="text-sm text-primary dark:text-white">
              <slot name="title-right">{{ titleRight }}</slot>
            </span>
            <button
              type="button"
              class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm dark:hover:bg-gray-600 dark:hover:text-white"
              @click="onHideModal"
            >
              <UIBaseHeroIcon name="x-mark" color="text-primary" size="h-6 w-6" />
            </button>
          </div>
      </div>
        </div>
        <!-- Modal body -->
        <div class="p-6 space-y-6">
          <slot></slot>
        </div>
        <!-- Modal footer -->
        <div v-if="showFooter" class="flex items-center justify-center p-6 space-x-2 rounded-b dark:border-gray-600">
          <button @click="onHideModal" type="button"
            class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-16 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">
            {{ btnCancelText }}
          </button>
          <button @click="onSubmit" type="button"
            class="text-white bg-primary hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-16 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            {{ btnSubmitText }}
          </button>
        </div>
      </div>
    </div>

    <div :id="`modal_backdrop_${id}`" class="hidden bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 "
      :class="[zIndexBackdrop ? zIndexBackdrop : 'z-[48]']">
    </div>
  </div>
</template>

<script lang="ts">
import { Modal, type ModalOptions } from "flowbite";

export default {
  props: {
    icons: { type: String },
    title: { type: String, required: true },
    titleRight :{ type: String, required: false },
    width: { type: String, default: "max-w-7xl" },
    showHeader: { type: Boolean, default: true },
    showFooter: { type: Boolean, default: true },
    id: {
      type: String,
      default: () => {
        const date = new Date();
        return `defaultMainModal_${date.getTime()}`;
      },
    },
    btnSubmitText: { type: String, default: "ตกลง" },
    btnCancelText: { type: String, default: "ยกเลิก" },
    onHide: { type: Function, default: () => { } },
    onShow: { type: Function, default: () => { } },
    levelModal: { type: Number, default: () => 1 },
    bg: { type: String, default: "bg-white" },
    closable: { type: Boolean, default: false },
    zIndex: { type: String },
    zIndexBackdrop: { type: String },
    forceHide: { type: Boolean, default: false },
  },
  setup() { },
  mounted() {
    this.setDataOptions();

    const $targetEl = document.getElementById(this.id);
    this.modal = new Modal($targetEl, this.options);

    this.$emit("onCreated", this.modal);
  },
  data() {
    return {
      backdropNo: "1",
      latestBackdropId: "",
      modal: {} as Modal,
      options: {} as ModalOptions,
    };
  },
  methods: {
    onSubmit() {
      this.modal.hide();
      this.$emit("onSubmit");
    },

    onHideModal() {
      this.modal.hide();
      this.$emit("onHide");
    },
    setDataOptions() {
      this.options = {
        placement: "center",
        backdrop: "dynamic",
        backdropClasses: `base-modal-backdrop backdrop-${this.id} bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-[45]`,
        closable: this.closable,
        onHide: () => {
          (document.activeElement as HTMLElement)?.blur();
          if ((!!this.zIndex && !!this.zIndexBackdrop) || this.levelModal == 2) {
            let backdropId = this.latestBackdropId;
            if (!this.latestBackdropId) backdropId = `modal_backdrop_${this.id}_${this.backdropNo}`

            const ebackdrop = document.getElementById(backdropId);
            if (!!ebackdrop) {
              ebackdrop.remove();
            }
          }

          if (!!this.forceHide) {
            const ebackdropDefault = document.getElementsByClassName('base-modal-backdrop');
            if (!!ebackdropDefault) {
              for (let ele of ebackdropDefault) {
                ele?.remove?.();
              }
            }
          }

          this.onHide();
        },
        onShow: () => {
          if ((!!this.zIndex && !!this.zIndexBackdrop) || this.levelModal == 2) {
            const eBody = document.getElementsByTagName("body");
            const ebackdrop = document.getElementById(`modal_backdrop_${this.id}`);
            if (!!eBody?.length && !!ebackdrop) {
              this.latestBackdropId = `modal_backdrop_${this.id}_${this.backdropNo}`;

              const ebackdropClone = ebackdrop.cloneNode(true);
              (ebackdropClone as HTMLElement)?.setAttribute("id", this.latestBackdropId);
              (ebackdropClone as HTMLElement)?.classList.remove("hidden");

              eBody[0].append(ebackdropClone);
            }
          }

          this.onShow();
        },
        onToggle: () => { },
      }
    }
  },
};
</script>
