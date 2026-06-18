<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
      <div class="text-center mb-6">
        <div class="text-5xl mb-2">🐷</div>
        <h2 class="text-2xl font-bold text-primary-500">Pig Farm CMS</h2>
        <p class="text-xs text-appgray mt-1">ระบบจัดการฟาร์มหมู</p>
      </div>
      <form class="space-y-4" @submit.prevent="onLogin">
        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-appblack">อีเมล <span class="text-apperror">*</span></label>
          <input v-model="form.email" type="email" required placeholder="example@email.com"
            class="border border-appborder rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-appblack">รหัสผ่าน <span class="text-apperror">*</span></label>
          <input v-model="form.password" type="password" required placeholder="••••••"
            class="border border-appborder rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
        </div>
        <button type="submit" :disabled="loading"
          class="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2 rounded-lg transition-colors disabled:opacity-50">
          {{ loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ' }}
        </button>
        <p v-if="error" class="text-center text-sm text-apperror">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script lang="ts">

export default {
  setup() {
    definePageMeta({ layout: 'default' })
    const config       = useRuntimeConfig()
    const token        = useCookie('token',        { maxAge: 60 * 60 * 24 * 30 })
    const refreshToken = useCookie('refreshToken', { maxAge: 60 * 60 * 24 * 30 })
    const profile      = useProfile()
    return { config, token, refreshToken, profile }
  },
  data() {
    return {
      loading: false,
      error:   '',
      form:    { email: '', password: '' },
    }
  },
  methods: {
    async onLogin() {
      this.loading = true
      this.error   = ''
      try {
        const res = await cmsPost<any>(apiSvcAuthLogin, this.form)
        const data = res?.data ?? res
        if (data?.token) {
          this.token        = data.token
          this.refreshToken = data.refreshToken ?? null
          const meRes = await $fetch<any>(`${this.config.public.apiCms}${apiSvcMe}`, {
            headers: { Authorization: `Bearer ${data.token}` },
          })
          this.profile = meRes?.data ?? meRes
          navigateTo('/dashboard')
        } else {
          this.error = data?.message ?? 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'
        }
      } catch {
        this.error = 'เกิดข้อผิดพลาด กรุณาลองใหม่'
      } finally {
        this.loading = false
      }
    },
  },
}
</script>
