import { apiBffMe } from '~/composables/api-bff'

export default defineNuxtRouteMiddleware(async (to) => {
  const token       = useCookie('token')
  const profile     = useProfile()
  const publicPages = ['/login']

  if (!token.value && !publicPages.includes(to.path)) return navigateTo('/login')
  if (token.value  && to.path === '/login')           return navigateTo('/')

  if (token.value && !profile.value) {
    try {
      const config = useRuntimeConfig()
      const res = await $fetch<any>(`${config.public.apiBff}${apiBffMe}`, {
        headers: { Authorization: `Bearer ${token.value}` },
      })
      profile.value = res?.data ?? res
    } catch {
      token.value = null
      return navigateTo('/login')
    }
  }
})
