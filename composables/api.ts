// pig-farm-service endpoints (direct CMS)
export const CMS_API = {
  auth: {
    login:   '/auth/login',
    refresh: '/auth/refresh',
    me:      '/auth/me',
  },
  pigs:      { list: '/pigs',      byId: (id: string) => `/pigs/${id}` },
  pens:      { list: '/pens',      byId: (id: string) => `/pens/${id}` },
  feed:      { list: '/feed',      byId: (id: string) => `/feed/${id}` },
  buyers:    { list: '/buyers',    byId: (id: string) => `/buyers/${id}` },
  customers: { list: '/customers', byId: (id: string) => `/customers/${id}` },
  users:     {
    list:           '/users',
    byId:           (id: string) => `/users/${id}`,
    changePassword: (id: string) => `/users/${id}/password`,
  },
  roles:     { list: '/roles',   byId: (id: string) => `/roles/${id}` },
  menus:     { list: '/menus',   byId: (id: string) => `/menus/${id}` },
  masterHouseTypes: { list: '/master-house-types', byId: (id: string) => `/master-house-types/${id}` },
  houses:           { list: '/houses',             byId: (id: string) => `/houses/${id}` },
  pigBatches:       {
    list:         '/pig-batches',
    byId:         (id: string) => `/pig-batches/${id}`,
    transactions: '/pig-batches/transactions',
  },
  feedTypes: {
    list: '/feed-types',
    byId: (id: string) => `/feed-types/${id}`,
  },
  feedStocks: {
    list: '/feed-stocks',
    byId: (id: string) => `/feed-stocks/${id}`,
    in:          (id: string) => `/feed-stocks/${id}/in`,
    out:         (id: string) => `/feed-stocks/${id}/out`,
    adjust:      (id: string) => `/feed-stocks/${id}/adjust`,
    transactions: (id: string) => `/feed-stocks/${id}/transactions`,
  },
  sales: {
    list: '/sales',
    byId: (id: string) => `/sales/${id}`,
  },
dashboard: '/dashboard',
}

