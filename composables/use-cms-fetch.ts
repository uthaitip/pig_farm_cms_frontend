// เรียกตรง pig-farm-service (port 8080)

let _refreshing: Promise<string | null> | null = null

async function _tryRefresh(apiCms: string): Promise<string | null> {
  if (_refreshing) return _refreshing
  _refreshing = (async () => {
    const refreshToken = useCookie('refreshToken', { maxAge: 60 * 60 * 24 * 30 })
    if (!refreshToken.value) return null
    try {
      const res = await $fetch<any>(`${apiCms}/auth/refresh`, {
        method: 'POST',
        body: { refreshToken: refreshToken.value },
      })
      const newToken = res?.data?.token ?? res?.token
      if (newToken) {
        const token = useCookie('token', { maxAge: 60 * 60 * 24 * 30 })
        token.value = newToken
        return newToken
      }
    } catch {}
    return null
  })().finally(() => { _refreshing = null })
  return _refreshing
}

export async function cmsApiFetch<T>(url: string, options: Record<string, any> = {}): Promise<T> {
  const config = useRuntimeConfig()
  const token  = useCookie('token')

  const makeRequest = (accessToken: string | null | undefined) => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...options.headers,
    }
    return $fetch<T>(`${config.public.apiCms}${url}`, { ...options, headers })
  }

  try {
    return await makeRequest(token.value)
  } catch (err: any) {
    const status = err?.response?.status ?? err?.status ?? err?.statusCode
    if (status === 401) {
      const newToken = await _tryRefresh(config.public.apiCms)
      if (newToken) {
        try {
          return await makeRequest(newToken)
        } catch (retryErr: any) {
          const retryStatus = retryErr?.response?.status ?? retryErr?.status
          if (retryStatus === 401) {
            _clearAndRedirect()
          }
          throw retryErr
        }
      }
      _clearAndRedirect()
    }
    throw err
  }
}

function _clearAndRedirect() {
  const token        = useCookie('token')
  const refreshToken = useCookie('refreshToken')
  const profile      = useProfile()
  token.value        = null
  refreshToken.value = null
  profile.value      = null
  navigateTo('/login')
}

export const cmsGet    = <T>(url: string, params?: any) => cmsApiFetch<T>(url, { method: 'GET', params })
export const cmsPost   = <T>(url: string, body: any)   => cmsApiFetch<T>(url, { method: 'POST', body })
export const cmsPut    = <T>(url: string, body: any)   => cmsApiFetch<T>(url, { method: 'PUT', body })
export const cmsPatch  = <T>(url: string, body: any)   => cmsApiFetch<T>(url, { method: 'PATCH', body })
export const cmsDelete = <T>(url: string)              => cmsApiFetch<T>(url, { method: 'DELETE' })
