<template>
    <div>
        <UIBaseModal :level-modal="2" id="baseModalShowImage" :title="sBaseModalValuesState?.options?.title ?? ''"
            :show-footer="false" @onCreated="(m: any) => modal = m" @on-hide="onHide">
            <div v-if="!!sBaseModalValuesState?.options?.srcFile && (sBaseModalValuesState?.options?.attachment?.type?.startsWith('image/') || sBaseModalValuesState?.options?.attachment?.meta?.contentType?.startsWith('image/'))"
                class="flex justify-center pb-4">
                <img :src="sBaseModalValuesState?.options?.srcFile"
                    class="max-w-full max-h-[80vh] object-contain self-center" />
            </div>
            <div v-if="sBaseModalValuesState?.options?.attachment?.meta?.contentType == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'"
                class="w-full flex justify-center text-appgray">
                ดาวน์โหลดไฟล์แล้ว (ไม่สามารถแสดงตัวอย่างได้)
            </div>
            <embed
                v-if="!!sBaseModalValuesState?.options?.srcFile && !(sBaseModalValuesState?.options?.attachment?.type?.startsWith('image/') || sBaseModalValuesState?.options?.attachment?.meta?.contentType?.startsWith('image/'))"
                :src="sBaseModalValuesState?.options?.srcFile" class="w-full h-[800px]" />

        </UIBaseModal>
    </div>
</template>

<script lang="ts">
import { Modal } from "flowbite";

export default {
    setup() {
        const sBaseModalValuesState = useState<any>(
            "globalBaseModalShowImageValues",
            () => ({ show: false })
        );

        useState<ILoading>("globalBaseModalShowImage", () => ({
            show: (options: any = {}) => {
                sBaseModalValuesState.value = { show: true, options: options };
            },
            hide: () => {
                sBaseModalValuesState.value = { show: false };
            },
        }));

        return { sBaseModalValuesState };
    },
    mounted() {
        watchEffect(() => {
            if (this.currentState.show != this.sBaseModalValuesState?.show) {
                if (this.sBaseModalValuesState?.show == true) {
                    this.onShow();
                } else {
                    this.onHide();
                }
                this.currentState = { ...this.sBaseModalValuesState };
            }
        });
    },
    data() {
        return {
            modal: {} as Modal,
            options: {} as { title?: string, srcFile?: string },
            currentState: {} as ILoading,
        };
    },
    methods: {
        onShow() {
            this.modal.show();
        },
        onHide() {
            this.sBaseModalValuesState = { show: false }
            this.modal.hide();
        },
    }
}
</script>