export const API = {
  auth: {
    login:   '/auth/login',
    refresh: '/auth/refresh',
    me:      '/auth/me',
  },
  users: {
    list:   '/users',
    create: '/users',
    update: (id: string) => `/users/${id}`,
    delete: (id: string) => `/users/${id}`,
  },
}
