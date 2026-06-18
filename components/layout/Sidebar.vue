<template>
  <aside id="logo-sidebar"
    class="fixed top-0 left-0 z-40 w-64 h-screen transition-transform bg-white border-r border-appborder flex flex-col no-print"
    :class="open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'" aria-label="Sidebar">
    <!-- Logo -->
    <div class="flex items-center gap-3 px-5 py-4 border-b border-appborder">
      <div class="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center text-white font-bold text-sm">P
      </div>
      <div>
        <div class="text-sm font-bold text-appblack">Pig Farm CMS</div>
        <div class="text-xs text-appgray">ระบบจัดการฟาร์มหมู</div>
      </div>
    </div>

    <!-- Menu -->
    <nav class="flex-1 overflow-y-auto px-3 py-4 space-y-1">
      <ul class="space-y-1 font-medium">
        <template v-for="menu in menuList" :key="menu._id ?? menu.path">
          <!-- Parent with children -->

          <template v-if="menu.children?.length">
            <li>
              <button
                class="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors hover:bg-gray-100"
                :class="isActiveParent(menu) ? 'text-primary-500 font-semibold bg-primary-50' : 'text-appgray'"
                @click="toggleMenu(menu._id)">
                <UIBaseHeroIcon
                  :name="menu.icon || 'folder-open'"
                  size="h-5 w-5"
                  :color="isActiveParent(menu) ? 'text-primary-500' : 'text-appgray'" />
                <span class="flex-1 text-left line-clamp-2">{{ menu.name }}</span>
                <svg class="w-4 h-4 transition-transform" :class="openMenus.includes(menu._id) ? 'rotate-90' : ''"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <ul v-show="openMenus.includes(menu._id)" class="pl-4 space-y-1 mt-1">
                <li v-for="child in menu.children" :key="child._id ?? child.path">
                  <NuxtLink :to="child.path"
                    class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors hover:bg-gray-100 text-appgray"
                    active-class="text-primary-500 font-semibold bg-primary-50" @click="$emit('close')">
                    <UIBaseHeroIcon
                      :name="child.icon || 'chevron-right'"
                      size="h-4 w-4"
                      :color="route.path === child.path ? 'text-primary-500' : 'text-appgray'" />
                    <span class="line-clamp-2 text-start">{{ child.name }}</span>
                  </NuxtLink>
                </li>
              </ul>
            </li>
          </template>

          <!-- Single menu -->
          <li v-else>
            <NuxtLink :to="menu.path"
              class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors hover:bg-gray-100 text-appgray"
              active-class="text-primary-500 font-semibold bg-primary-50" @click="$emit('close')">
              <UIBaseHeroIcon
                :name="menu.icon || 'document'"
                size="h-5 w-5"
                :color="route.path === menu.path ? 'text-primary-500' : 'text-appgray'" />
              <span class="line-clamp-2">{{ menu.name }}</span>
            </NuxtLink>
          </li>
        </template>
      </ul>

    </nav>
  </aside>
</template>

<script lang="ts">
export default {
  props: {
    open: { type: Boolean, default: false },
  },
  emits: ['close'],

  setup() {
    const profile = useProfile()
    const route   = useRoute()
    return { profile, route }
  },

  data() {
    return { openMenus: [] as string[] }
  },

  computed: {
    menuList(): any[] {
      const menus: any[] = (this.profile as any)?.roleId?.menuIds ?? []
      return menus
        .filter((m: any) => !m.parentId)
        .map((m: any) => ({
          ...m,
          children: menus
            .filter((c: any) => c.parentId && String(c.parentId) === String(m._id))
            .sort((a: any, b: any) => (a.sort ?? 0) - (b.sort ?? 0)),
        }))
        .sort((a: any, b: any) => (a.sort ?? 0) - (b.sort ?? 0))
    },
  },

  mounted() {
    const active = this.menuList.find((m: any) => this.isActiveParent(m))
    if (active) this.openMenus.push(active._id)
  },

  methods: {
    toggleMenu(id: string) {
      const idx = this.openMenus.indexOf(id)
      if (idx >= 0) this.openMenus.splice(idx, 1)
      else this.openMenus.push(id)
    },

    isActiveParent(menu: any): boolean {
      return menu.children?.some((c: any) => c.path === (this.route as any).path)
    },
  },
}
</script>
