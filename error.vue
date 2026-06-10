<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center space-y-4">
      <h1 class="text-4xl font-bold text-appblack">{{ error?.statusCode }}</h1>
      <p class="text-appgray">{{ error?.message || 'เกิดข้อผิดพลาด' }}</p>
      <button class="bg-primary-500 text-white px-6 py-2 rounded-lg" @click="clearError({ redirect: '/' })">
        กลับหน้าหลัก
      </button>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    error: { type: Object as () => { statusCode: number; message?: string } | null, default: null },
  },
}
</script>
