<template>
    <div>
        <qrcode-vue :value="currentValue" :size="size" :level="currentLevel" :render-as="currentRenderAs" />
    </div>
</template>

<script lang="ts">
import QrcodeVue from 'qrcode.vue'
import type { Level, RenderAs } from 'qrcode.vue'

export default {
    components: { QrcodeVue },
    props: {
        value: { type: String, default: "" },
        level: { type: String, default: "L" },
        renderAs: { type: String, default: "svg" },
        size: { type: Number, default: 300 }
    },
    mounted() {
        this.currentValue = this.value;
        this.currentLevel = this.level as Level;
        this.currentRenderAs = this.renderAs as RenderAs;
    },
    data() {
        return {
            currentValue: "",
            currentLevel: "L" as Level,
            currentRenderAs: "svg" as RenderAs
        };
    },
    watch: {
        value: function (newValue: any) {
            this.currentValue = newValue;
        },
        level: function (newValue: any) {
            this.currentLevel = newValue;
        },
        renderAs: function (newValue: any) {
            this.currentRenderAs = newValue;
        },
    }

}
</script>