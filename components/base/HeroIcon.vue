<template>
  <component
    :is="getIcon(name, type)"
    :class="
      !!classList.length
        ? classList
        : `${size} ${color} `
    "
  />
</template>

<script lang="ts">
export default {
  props: {
    name:      { type: String, required: true },
    color:     { type: String, default: () => 'text-primary' },
    size:      { type: String, default: () => 'h-6 w-6' },
    type:      { type: String, default: () => 'outline' },
    classList: { type: [Array, String, Object], default: () => [] },
  },
}
</script>