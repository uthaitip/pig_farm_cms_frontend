// pig-farm-service endpoints (direct — no BFF)

// Auth
export const apiSvcAuthLogin   = '/auth/login'
export const apiSvcAuthRefresh = '/auth/refresh'
export const apiSvcAuthMe      = '/auth/me'

// Pigs
export const apiSvcPigs     = '/pigs'
export const apiSvcPigsById = (id: string) => `/pigs/${id}`

// Pens
export const apiSvcPens     = '/pens'
export const apiSvcPensById = (id: string) => `/pens/${id}`

// Feed
export const apiSvcFeed     = '/feed'
export const apiSvcFeedById = (id: string) => `/feed/${id}`

// Buyers
export const apiSvcBuyers     = '/buyers'
export const apiSvcBuyersById = (id: string) => `/buyers/${id}`

// Customers
export const apiSvcCustomers     = '/customers'
export const apiSvcCustomersById = (id: string) => `/customers/${id}`

// Users
export const apiSvcUsers             = '/users'
export const apiSvcUsersById         = (id: string) => `/users/${id}`
export const apiSvcUsersPasswordById = (id: string) => `/users/${id}/password`

// Roles
export const apiSvcRoles     = '/roles'
export const apiSvcRolesById = (id: string) => `/roles/${id}`

// Menus
export const apiSvcMenus     = '/menus'
export const apiSvcMenusById = (id: string) => `/menus/${id}`

// House Types
export const apiSvcHouseTypes     = '/master-house-types'
export const apiSvcHouseTypesById = (id: string) => `/master-house-types/${id}`

// Houses
export const apiSvcHouses     = '/houses'
export const apiSvcHousesById = (id: string) => `/houses/${id}`

// Me (current user profile)
export const apiSvcMe = '/auth/me'

// Pig Batches
export const apiSvcPigBatches             = '/pig-batches'
export const apiSvcPigBatchesById         = (id: string) => `/pig-batches/${id}`
export const apiSvcPigBatchesTransactions = '/pig-batches/transactions'

// Feed Types
export const apiSvcFeedTypes     = '/feed-types'
export const apiSvcFeedTypesById = (id: string) => `/feed-types/${id}`

// Feed Stocks
export const apiSvcFeedStocks             = '/feed-stocks'
export const apiSvcFeedStocksById         = (id: string) => `/feed-stocks/${id}`
export const apiSvcFeedStocksIn           = (id: string) => `/feed-stocks/${id}/in`
export const apiSvcFeedStocksOut          = (id: string) => `/feed-stocks/${id}/out`
export const apiSvcFeedStocksAdjust       = (id: string) => `/feed-stocks/${id}/adjust`
export const apiSvcFeedStocksTransactions = (id: string) => `/feed-stocks/${id}/transactions`

// Sales
export const apiSvcSales     = '/sales'
export const apiSvcSalesById = (id: string) => `/sales/${id}`

// Dashboard
export const apiSvcDashboard = '/dashboard'

// Thai Addresses
export const apiSvcThaiProvinces    = '/thai-addresses'
export const apiSvcThaiDistricts    = '/thai-addresses/districts'
export const apiSvcThaiSubDistricts = '/thai-addresses/sub-districts'
