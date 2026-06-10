<template>
  <div class="flex items-center justify-center gap-3">
    <button title="แก้ไข" class="text-primary-500 hover:text-primary-700" @click="$emit('edit', data)">
      <UIBaseHeroIcon name="pencil-square" size="h-5 w-5" color="text-primary-500" />
    </button>
    <button title="ลบ" class="text-apperror hover:text-red-700" @click="$emit('delete', data._id)">
      <UIBaseHeroIcon name="trash" size="h-5 w-5" color="text-apperror" />
    </button>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    data: { type: Object, required: true },
  },
  emits: ['edit', 'delete'],
}
</script>
