<template>
  <div>
    <UILayoutNavbar class="no-print" @toggle-sidebar="sidebarOpen = !sidebarOpen" />
    <UILayoutSidebar class="no-print" :open="sidebarOpen" @close="sidebarOpen = false" />

    <!-- Mobile overlay -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 z-30 bg-black/40 lg:hidden"
      @click="sidebarOpen = false"
    />

    <div class="p-4 lg:ml-64 min-h-screen">
      <div class="p-4 mt-14">
        <slot />
      </div>
    </div>

    <div class="p-4 lg:ml-64 no-print">
      <UILayoutFooter />
    </div>

    <UIBaseLoading />
    <UIBaseAlertModal />
  </div>
</template>

<script lang="ts">
export default {
  data() {
    return { sidebarOpen: false }
  },
}
</script>
