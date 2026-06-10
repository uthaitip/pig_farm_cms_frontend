<template>
  <div>
    <!-- Modal Loading -->
    <UIBaseModal :id="id" title="" width="max-w-xs" bg="bg-transparent" :show-footer="false" :show-header="false"
      z-index="z-[54]" z-index-backdrop="z-[53]" :closable="false" @on-created="(m) => (modalLoading = m)">
      <div role="status" class="w-full grid h-[200px]">
        <div role="status" class="flex justify-center">
          <svg aria-hidden="true" class="w-16 h-16 text-gray-200 animate-spin dark:text-gray-600 fill-primary"
            viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor" />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill" />
          </svg>
          <span class="sr-only">Loading...</span>
        </div>
        <div class="pt-1 flex justify-center">
          <span class="text-gray-200 text-center text-xl">{{ sLoadingValuesState?.options?.text ?? '' }}</span>
        </div>
      </div>
    </UIBaseModal>
  </div>
</template>

<script lang="ts">
import { Modal } from "flowbite";

export default {
  props: {
    id: { type: String, default: "baseModalLoading" }
  },
  setup() {
    const sLoadingValuesState = useState<any>(
      "globalBaseLoadingValues",
      () => ({ show: false })
    );

    useState<ILoading>("globalBaseLoading", () => ({
      show: (options: any = {}) => {
        sLoadingValuesState.value = { show: true, options: options };
      },
      hide: () => {
        sLoadingValuesState.value = { show: false };
      },
    }));

    return { sLoadingValuesState };
  },
  mounted() {
    watchEffect(() => {
      if (this.currentState.show != this.sLoadingValuesState?.show) {
        if (this.sLoadingValuesState?.show == true) {
          this.onShow();
        } else {
          this.onHide();
        }
        this.currentState = { ...this.sLoadingValuesState };
      }
    });
  },
  data() {
    return {
      modalLoading: {} as Modal,
      text: "",
      currentState: {} as ILoading,
    };
  },
  methods: {
    onShow() {
      this.modalLoading.show();
    },
    onHide() {
      this.sLoadingValuesState = { show: false }
      this.modalLoading.hide();
    },
  },
  computed: {},
};
</script>