import type { UseFetchOptions } from 'nuxt/app'
import { defu } from 'defu'

function useAppFetch<T>(url: any, options: UseFetchOptions<T> = {}, isClient: Boolean = false) {
  const userAuth      = useCookie('token')
  const sLoadingState = useState<ILoading>('globalBaseLoading')
  const config        = useRuntimeConfig()

  const baseUrl = url.startsWith('/bff/')
    ? config.public.apiBff
    : config.public.apiCms

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> ?? {}),
    ...(userAuth.value ? { Authorization: `Bearer ${userAuth.value}` } : {}),
  }

  const unique = new Date().getTime()

  const defaults: UseFetchOptions<T> = {
    baseURL: baseUrl?.toString(),
    key:     `${url}_${unique}`,
    headers: headers,
    onRequest() {},
    onRequestError() {},
    onResponse() {},
    onResponseError({ response }) {
      if (response.status === 401) {
        deleteAllCookies()
        setTimeout(() => navigateTo('/login'), 800)
      }
    },
  }

  const allOptions: any = defu(options, defaults)

  // ofetch serializes nested objects as "[object Object]" — JSON.stringify them so the server can parse correctly
  if (allOptions.params) {
    const serialized: Record<string, any> = {}
    for (const [k, v] of Object.entries(allOptions.params)) {
      serialized[k] = (v !== null && v !== undefined && typeof v === 'object') ? JSON.stringify(v) : v
    }
    allOptions.params = serialized
  }

  if (isClient) {
    return $fetch(url, allOptions)
      .then((response: any) => new Promise((resolve) => resolve(response)))
      .catch((error: any) =>
        new Promise((resolve) =>
          resolve({
            status: error?.data?.statusCode ?? error?.data?.status ?? 500,
            error:  error?.data ?? { message: 'Error' },
          }),
        ),
      )
  }

  return useFetch<T>(url, allOptions)
}

function deleteAllCookies() {
  const token = useCookie('token')
  token.value = null
}

// SSR (useFetch) ─────────────────────────────────────────────────────────────

export function useFetchGet<T>(url: string, options: UseFetchOptions<T> = {}) {
  return useAppFetch<T>(url, defu(options, { method: 'GET' } as UseFetchOptions<T>), false)
}

export function useFetchPost<T>(
  url: string,
  body: RequestInit['body'] | Record<string, any> = {},
  options: UseFetchOptions<T> = {},
) {
  return useAppFetch<T>(url, defu(options, { method: 'POST', body } as UseFetchOptions<T>), false)
}

export function useFetchPut<T>(
  url: string,
  body: RequestInit['body'] | Record<string, any> = {},
  options: UseFetchOptions<T> = {},
) {
  return useAppFetch<T>(url, defu(options, { method: 'PUT', body } as UseFetchOptions<T>), false)
}

export function useFetchDelete<T>(url: string, options: UseFetchOptions<T> = {}) {
  return useAppFetch<T>(url, defu(options, { method: 'DELETE' } as UseFetchOptions<T>), false)
}

// Client ($fetch) ─────────────────────────────────────────────────────────────

export function useFetchGetClient<T>(url: string, options: UseFetchOptions<T> = {}) {
  return useAppFetch<T>(url, defu(options, { method: 'GET' } as UseFetchOptions<T>), true)
}

export function useFetchPostClient<T>(
  url: string,
  body: RequestInit['body'] | Record<string, any> = {},
  options: UseFetchOptions<T> = {},
) {
  return useAppFetch<T>(url, defu(options, { method: 'POST', body } as UseFetchOptions<T>), true)
}

export function useFetchPutClient<T>(
  url: string,
  body: RequestInit['body'] | Record<string, any> = {},
  options: UseFetchOptions<T> = {},
) {
  return useAppFetch<T>(url, defu(options, { method: 'PUT', body } as UseFetchOptions<T>), true)
}

export function useFetchPatchClient<T>(
  url: string,
  body: RequestInit['body'] | Record<string, any> = {},
  options: UseFetchOptions<T> = {},
) {
  return useAppFetch<T>(url, defu(options, { method: 'PATCH', body } as UseFetchOptions<T>), true)
}

export function useFetchDeleteClient<T>(url: string, options: UseFetchOptions<T> = {}) {
  return useAppFetch<T>(url, defu(options, { method: 'DELETE' } as UseFetchOptions<T>), true)
}

