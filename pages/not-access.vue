<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center space-y-4">
      <UIBaseHeroIcon name="lock-closed" size="h-16 w-16" color="text-appgray" />
      <h1 class="text-2xl font-bold text-appblack">ไม่มีสิทธิ์เข้าถึง</h1>
      <NuxtLink to="/" class="inline-block bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600">กลับหน้าหลัก</NuxtLink>
    </div>
  </div>
</template>
<script lang="ts">
export default {
  setup() {
    definePageMeta({ layout: 'default' })
  },
}
</script>
