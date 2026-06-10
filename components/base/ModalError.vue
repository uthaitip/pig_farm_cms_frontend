<template>
  <UIBaseModal id="modal-base-error" title="เกิดข้อผิดพลาด" width="max-w-sm" :show-footer="false"
    @on-created="(m: any) => (modal = m)">
    <div class="flex flex-col items-center gap-3 py-2">
      <UIBaseHeroIcon name="exclamation-circle" size="h-12 w-12" color="text-apperror" />
      <p class="text-sm text-center text-appblack">{{ message }}</p>
      <button type="button"
        class="mt-1 px-6 py-2 text-sm bg-apperror hover:opacity-80 text-white rounded-lg"
        @click="modal?.hide()">ตกลง</button>
    </div>
  </UIBaseModal>
</template>

<script lang="ts">
import type { Modal } from 'flowbite'

export default {
  data() {
    return {
      modal: null as Modal | null,
      message: '' as string,
    }
  },
  methods: {
    show(message: string) {
      this.message = message
      this.modal?.show()
    },
    hide() {
      this.modal?.hide()
    },
  },
}
</script>
