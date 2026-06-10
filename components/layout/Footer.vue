<template>
  <footer class="bg-white border-t border-appborder px-6 py-3 text-center text-xs text-appgray no-print">
    © {{ year }} Pig Farm CMS — CMS API: port 8080 | BFF: port 3001
  </footer>
</template>
<script lang="ts">
export default {
  data() {
    return { year: new Date().getFullYear() }
  },
}
</script>
