<template>
    <div :class="[
        currentItem.style,
        currentDisabled ? disabledStyle : currentActive ? activeStyle : '',
    ]" class="w-full h-full p-4 border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <div class="w-full h-full grid grid-cols-4 gap-2">
            <div class="col-span-1 px-2">
                <div class="w-full h-full flex items-center justify-start">
                    <i v-if="currentItem.icon" :class="currentItem.icon" class="text-xl"></i>
                    <UIBaseHeroIcon v-else-if="currentItem.heroIcon" :name="currentItem.heroIcon?.toString()" classList="w-full h-auto" />
                    <UIBaseSvgIcon v-else-if="currentItem.svgIcon" :name="currentItem.svgIcon?.toString()" class="w-6 h-6" />
                </div>
            </div>
            <div :class="[currentItem?.actions?.length ? 'col-span-2' : 'col-span-3']">
                <div class="w-full h-full pl-2 grid items-center text-left">
                    <div class="text-lg">{{ currentItem.title }}</div>
                    <div v-if="currentItem.details?.length" class="grid grid-cols-1 gap-y-1 pt-2">
                        <div class="grid grid-cols-2 gap-2" v-for="(item, index) in currentItem.details"
                            :key="`card_item_${index}`">
                            <div class="col-span-1 text-sm"> {{ item.title }} : </div>
                            <div class="col-span-1 text-sm text-right"> {{ item.value }} </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="currentItem?.actions?.length" class="col-span-1">
                <div class="w-full h-full p-2 grid items-center justify-center">
                    <template v-for="(item, index) in currentItem.actions" :key="`action_button_${index}`">
                        <button @click="item.onClick" :disabled="currentDisabled"
                            class="text-white bg-primary hover:bg-primary-600 text-sm rounded-lg sm:w-auto px-4 py-2.5 text-center disabled:bg-appdisabled disabled:text-appgray">
                            <span>{{ item.title }}</span>
                        </button>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
export default {
    props: {
        cardItem: { type: Object, required: true },
        active: { type: Boolean, default: () => false },
        activeStyle: { type: String, default: "!bg-appsuccess !text-white" },
        disabled: { type: Boolean, default: () => false },
        disabledStyle: { type: String, default: "!bg-appdisabled !text-appgray" },
    },
    mounted() {
        this.currentItem = new CardItem(this.cardItem);
        this.currentActive = this.active;
        this.currentDisabled = this.disabled;
    },
    data() {
        return {
            currentItem: {} as ICardItem,
            currentActive: false as boolean,
            currentDisabled: false as boolean,
        };
    },
    watch: {
        cardItem: function (n: Object) {
            if (!!n) {
                this.currentItem = new CardItem(n);
            }
        },
        active: function (n: Boolean) {
            this.currentActive = !!n;
        },
        disabled: function (n: Boolean) {
            this.currentDisabled = !!n;
        },
    }
}
</script>