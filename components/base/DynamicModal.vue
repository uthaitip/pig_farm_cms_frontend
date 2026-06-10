<template>
  <div>
    <div v-for="(modal, index) in modalList" :key="`dynamic-modal-${index}`">
      <component
        :is="markRaw(modal.name)"
        :id="modal.id"
        v-bind="{ selectedRole: {} }"
      ></component>

      <!-- <component
        :is="getComponent(modal)"
        :id="modal.id"
        v-bind="{ selectedRole: {} }"
      ></component> -->
    </div>
  </div>
</template>

<script lang="ts">
import { Modal, type ModalOptions } from "flowbite";
import { watch, resolveComponent, markRaw, shallowRef } from "vue";

export default {
  props: {},
  setup() {
    const sGlobalDynamicModalState = useState<Object[]>(
      "globalDynamicModal",
      () => []
    );

    return { sGlobalDynamicModalState };
  },
  mounted() {
    watch(this.sGlobalDynamicModalState, this.watchModalState);
  },
  data() {
    return {
      modalList: [] as any[],
      defaultOptions: {
        placement: "center",
        backdrop: "dynamic",
        backdropClasses:
          "bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-[46]",
        closable: true,
        onHide: () => {
          //   sGlobalDynamicModalState.value.onHide();
        },
        onShow: () => {
          //   sGlobalDynamicModalState.value.onShow();
        },
        onToggle: () => {},
      } as ModalOptions,
    };
  },
  computed: {},
  methods: {
    watchModalState(n: any[], o: any[]) {
      const exist = !!this.modalList.find(
        (e: any) => !!n.find((e2: any) => e.id == e2.id)
      );
      if (!exist) {
        this.modalList.push(n[0]);
      }
    },
    getComponent(data: any) {
      //   const component = resolveComponent(data.name);
      const component = shallowRef(data.name);
      return component;
    },
  },
};
</script>