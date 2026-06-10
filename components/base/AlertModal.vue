<template>
  <div>
    <div
      :id="id"
      tabindex="-1"
      aria-hidden="true"
      class="fixed top-0 left-0 right-0 z-[51] hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
    >
      <div class="relative w-full max-h-full" :class="[modalOptions.modalSize]">
        <div class="relative bg-white rounded-lg shadow">
          <div class="p-12 space-y-6">
            <div class="flex items-center justify-center">
              <UIBaseHeroIcon
                v-if="!!modalOptions.icon"
                :name="modalOptions.icon?.toString()"
                :color="modalOptions.iconColor?.toString()"
                :size="modalOptions.iconSize?.toString()"
              />
            </div>
            <div class="flex items-center justify-center">
              <span :class="modalOptions.titleClass" v-html="modalOptions.title" />
            </div>
            <div
              class="grid mt-10 gap-2"
              :class="[modalOptions.btnCancelText !== '' ? 'grid-cols-2' : 'grid-cols-1 px-8']"
            >
              <button
                v-if="modalOptions.btnCancelText && modalOptions.btnCancelText !== ''"
                type="button"
                class="text-primary border border-primary bg-white hover:bg-gray-100 font-medium rounded-lg text-sm w-full px-4 py-2.5 text-center"
                @click="onReject"
              >
                {{ modalOptions.btnCancelText }}
              </button>
              <button
                type="button"
                class="text-white bg-primary hover:bg-primary-800 font-medium rounded-lg text-sm w-full px-4 py-2.5 text-center"
                @click="onSubmit"
              >
                {{ modalOptions.btnSubmitText }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      :id="`alert_modal_backdrop`"
      class="hidden bg-gray-900 bg-opacity-50 fixed inset-0 z-[50]"
    />
  </div>
</template>

<script lang="ts">
import { Modal, type ModalOptions } from 'flowbite'
import { ModalOption } from '~/composables/models/modal-option'

export default {
  props: {
    id: {
      type: String,
      default: () => `BaseAlertModal_${Date.now()}`,
    },
  },

  setup() {
    const sAlertState = useState<IModal>('globalAlertModal')
    return { sAlertState }
  },

  data() {
    return {
      modal: {} as Modal,
      options: {} as ModalOptions,
      latestBackdropId: '',
      modalOptions: new ModalOption({}),
    }
  },

  mounted() {
    this.setDataOption()
    this.setDataModal()
  },

  methods: {
    onSubmit() {
      this.modalOptions?.onSubmit?.()
      this.modal.hide()
    },

    onReject() {
      this.modalOptions?.onReject?.()
      this.modal.hide()
    },

    setDataModal() {
      const $targetEl = document.getElementById(this.id)
      this.modal = new Modal($targetEl, this.options)

      this.sAlertState = {
        modal: this.modal,
        show: (config: any = {}) => {
          this.modalOptions = new ModalOption({ ...config })
          this.modal.show()
        },
        hide: () => {
          this.modal.hide()
        },
      }
    },

    setDataOption() {
      this.options = {
        placement: 'center',
        backdrop: 'dynamic',
        backdropClasses: 'bg-gray-900 bg-opacity-50 fixed inset-0 z-[45]',
        closable: false,
        onHide: () => {
          const ebackdrop = document.getElementById(this.latestBackdropId)
          ebackdrop?.remove()
          this.modalOptions?.onHide?.()
        },
        onShow: () => {
          document.querySelectorAll(`[id^="alert_modal_backdrop_"]`).forEach(el => el.remove())

          const eBody = document.getElementsByTagName('body')
          const ebackdrop = document.getElementById(`alert_modal_backdrop`)

          if (eBody?.length && ebackdrop) {
            this.latestBackdropId = `alert_modal_backdrop_${this.id}`
            const clone = ebackdrop.cloneNode(true) as HTMLElement
            clone.setAttribute('id', this.latestBackdropId)
            clone.classList.remove('hidden')
            eBody[0].append(clone)
          }

          this.modalOptions?.onShow?.()
        },
        onToggle: () => {},
      }
    },
  },
}
</script>
