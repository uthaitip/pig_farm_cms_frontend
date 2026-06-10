<template>
    <div @click="toggleVisibility"
        :class="isActive ? 'border-appsuccess border-2' : 'border-gray-200 '"
        class="row-span-2 py-auto p-4  bg-white' border  rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <div class="flex items-center justify-between ">
           
            <div class=" flex items-center">
                <div class="flex items-center ">
                    <div
                        class="flex items-center justify-center relative w-[300px] h-[150px] overflow-hidden p-4 dark:bg-gray-600">
                        <UIBaseSvgIcon :name="dataList.icon" class="w-full h-full text-primary p-4" />
                    </div>
                </div>
                <div class="items-center">
                    <div class=" text-primary text-xl">{{ dataList.topic }}</div>
                    <div>
                        <div class="flex-col item-center ">
                            <div class="text-primary text-lg">{{ dataList.subtitle }}</div>
                            <div class="text-gray-400 text-lg">{{ dataList.text }}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="isActive" class="mx-5">
                <i class="fi fi-br-check  w-[40%] text-3xl" :class="isActive ?'text-appsuccess' : ''"></i>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
export default {
    props: {
        dataList: { type: Object, default: {} },
        activeId: { type: String },
    },
    computed: {
    isActive() {
      return this.dataList.code === this.activeId; 
    },
  },
  methods: {
    toggleVisibility() {
      this.$emit('toggle-visibility', this.dataList); 
    },
  },

}
</script>
<style lang="">
    
</style>