export default defineNuxtPlugin(async () => {
  const token        = useCookie('token',        { maxAge: 60 * 60 * 24 * 30 })
  const refreshToken = useCookie('refreshToken', { maxAge: 60 * 60 * 24 * 30 })
  const profile      = useProfile()
  const config       = useRuntimeConfig()

  if (!token.value && !refreshToken.value) return

  const fetchMe = async (accessToken: string) => {
    const res = await $fetch<any>(`${config.public.apiCms}${apiSvcAuthMe}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    profile.value = res?.data ?? res
  }

  // Try with current token
  if (token.value) {
    try {
      await fetchMe(token.value)
      return
    } catch (err: any) {
      const status = err?.response?.status ?? err?.status
      if (status !== 401) {
        // Non-auth error (network etc.) — don't clear session
        return
      }
    }
  }

  // Token expired or missing — try refresh
  if (refreshToken.value) {
    try {
      const res = await $fetch<any>(`${config.public.apiCms}/auth/refresh`, {
        method: 'POST',
        body: { refreshToken: refreshToken.value },
      })
      const newToken = res?.data?.token ?? res?.token
      if (newToken) {
        token.value = newToken
        await fetchMe(newToken)
        return
      }
    } catch {}
  }

  // Both failed — clear everything
  token.value        = null
  refreshToken.value = null
  profile.value      = null
})
