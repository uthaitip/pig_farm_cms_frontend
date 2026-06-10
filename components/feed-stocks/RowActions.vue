<template>
  <div class="flex items-center justify-center gap-3">
    <button title="รับเข้า" class="text-appsuccess hover:text-green-600" @click="$emit('in', data)">
      <UIBaseHeroIcon name="arrow-down-tray" size="h-5 w-5" color="text-appsuccess" />
    </button>
    <button title="เบิกใช้" class="text-appwarn hover:text-orange-600" @click="$emit('out', data)">
      <UIBaseHeroIcon name="arrow-up-tray" size="h-5 w-5" color="text-appwarn" />
    </button>
    <button title="ประวัติ" class="text-appgray hover:text-gray-600" @click="$emit('history', data)">
      <UIBaseHeroIcon name="clock" size="h-5 w-5" color="text-appgray" />
    </button>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    data: { type: Object, required: true },
  },
  emits: ['in', 'out', 'history'],
}
</script>
