<template>
    <div>
    <div
      class="flex items-center justify-between pb-4 border-b-[3px] border-b-primary rounded-t dark:border-gray-600 mb-4">
      <div class="flex items-center">
        <div v-if="showBtnBack" class="pt-2 rounded-[50%] bg-primary mr-4">
          <button type="button" class="px-2" @click="onClickBack">
            <UIBaseHeroIcon name="arrow-left" color="text-primary" size="h-6 w-6" class="text-white" />
          </button>
        </div>
        <h3 class="grid pt-2 text-xl font-semibold text-primary dark:text-white">
          <span>{{ title }} </span>
          <span class="text-sm font-normal text-appblack">
            {{  subtitle }}
          </span>
        </h3>

      </div>
      <div v-if="!!$slots['action-btn']">
        <template  v-if="$slots['action-btn']">
          <slot name="action-btn"></slot>
        </template>
      </div>
    </div>
    </div>
</template>

<script lang="ts">
export default {
    props: {
        title: { type: String, default: "" },
        subtitle: { type: String, default: "" },
        showBtnBack: { type: Boolean, default: true },
    },
    emits: ["onClickBack"],
    methods: {
        onClickBack() {
            this.$emit("onClickBack");
        }
    }
}
</script>