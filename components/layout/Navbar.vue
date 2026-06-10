<template>
  <nav class="fixed top-0 left-0 right-0 z-30 bg-white border-b border-appborder lg:pl-64 no-print">
    <div class="flex items-center justify-between px-4 py-3">
      <!-- Mobile menu toggle -->
      <button
        class="lg:hidden p-2 text-appgray rounded-lg hover:bg-gray-100"
        @click="$emit('toggle-sidebar')"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <!-- Right: user info -->
      <div class="ml-auto flex items-center gap-3 relative" data-dropdown>
        <button
          class="flex items-center gap-2 text-sm focus:outline-none"
          @click="showDropdown = !showDropdown"
        >
          <div class="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center font-semibold text-xs">
            {{ initials }}
          </div>
          <div class="text-left hidden sm:block">
            <div class="text-sm font-semibold text-appblack leading-none">{{ profile?.fullName ?? '-' }}</div>
            <div class="text-xs text-appgray mt-0.5">{{ profile?.role?.name ?? 'ผู้ใช้งาน' }}</div>
          </div>
          <svg class="w-4 h-4 text-appgray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <!-- Dropdown -->
        <div
          v-if="showDropdown"
          class="absolute right-0 top-full mt-2 w-48 bg-white border border-appborder rounded-xl shadow-lg z-50"
        >
          <div class="px-4 py-3 border-b border-gray-100">
            <p class="text-xs font-semibold text-appblack truncate">{{ profile?.fullName ?? '-' }}</p>
            <p class="text-xs text-appgray truncate">{{ profile?.email ?? '' }}</p>
          </div>
          <ul class="py-1">
            <li>
              <NuxtLink to="/profile"
                class="flex items-center gap-2 px-4 py-2 text-sm text-appblack hover:bg-gray-50"
                @click="showDropdown = false"
              >
                <svg class="w-4 h-4 text-appgray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                แก้ไขโปรไฟล์
              </NuxtLink>
            </li>
            <li class="border-t border-gray-100 mt-1 pt-1">
              <button
                class="w-full flex items-center gap-2 px-4 py-2 text-sm text-apperror hover:bg-gray-50"
                @click="onLogout"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                ออกจากระบบ
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
export default {
  emits: ['toggle-sidebar'],

  setup() {
    const profile = useProfile()
    return { profile }
  },

  data() {
    return { showDropdown: false }
  },

  computed: {
    initials(): string {
      const name = (this.profile as any)?.fullName ?? ''
      return name.slice(0, 2) || 'U'
    },
  },

  mounted() {
    document.addEventListener('click', (e) => {
      if (!(e.target as HTMLElement).closest('[data-dropdown]')) {
        this.showDropdown = false
      }
    })
  },

  methods: {
    onLogout() {
      useCookie('token').value        = null
      useCookie('refreshToken').value = null
      useProfile().value              = null
      navigateTo('/login')
    },
  },
}
</script>
