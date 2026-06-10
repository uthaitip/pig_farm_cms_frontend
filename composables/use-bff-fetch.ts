// เรียกผ่าน pig-farm-bff (port 3001)
export async function bffApiFetch<T>(url: string, options: Record<string, any> = {}): Promise<T> {
  const config = useRuntimeConfig()
  const token  = useCookie('token')

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token.value ? { Authorization: `Bearer ${token.value}` } : {}),
    ...options.headers,
  }

  return $fetch<T>(`${config.public.apiBff}${url}`, { ...options, headers }).catch((err) => {
    if (err?.status === 401) navigateTo('/login')
    return err
  })
}

export const bffGet    = <T>(url: string, params?: any) => bffApiFetch<T>(url, { method: 'GET', params })
export const bffPost   = <T>(url: string, body: any)   => bffApiFetch<T>(url, { method: 'POST', body })
export const bffPut    = <T>(url: string, body: any)   => bffApiFetch<T>(url, { method: 'PUT', body })
export const bffPatch  = <T>(url: string, body: any)   => bffApiFetch<T>(url, { method: 'PATCH', body })
export const bffDelete = <T>(url: string)              => bffApiFetch<T>(url, { method: 'DELETE' })
