// BFF Service (pig-farm-bff) ---------------------------------------------------

export const apiBffDashboard = '/bff/dashboard'
export const apiBffMe        = '/bff/me'

// Feed Types
export const apiBffFeedTypes     = '/bff/feed-types'
export const apiBffFeedTypesById = (id: string) => `/bff/feed-types/${id}`

// Customers
export const apiBffCustomers     = '/bff/customers'
export const apiBffCustomersById = (id: string) => `/bff/customers/${id}`

// Sales
export const apiBffSales     = '/bff/sales'
export const apiBffSalesById = (id: string) => `/bff/sales/${id}`

// Pig Batches
export const apiBffPigBatches             = '/bff/pig-batches'
export const apiBffPigBatchesById         = (id: string) => `/bff/pig-batches/${id}`
export const apiBffPigBatchesTransactions = '/bff/pig-batches/transactions'
export const apiBffPigBatchesTxById       = (id: string) => `/bff/pig-batches/${id}/transactions`

// Users
export const apiBffUsers             = '/bff/users'
export const apiBffUsersById         = (id: string) => `/bff/users/${id}`
export const apiBffUsersPasswordById = (id: string) => `/bff/users/${id}/password`

// Pigs
export const apiBffPigs     = '/bff/pigs'
export const apiBffPigsById = (id: string) => `/bff/pigs/${id}`

// Roles
export const apiBffRoles     = '/bff/roles'
export const apiBffRolesById = (id: string) => `/bff/roles/${id}`

// Pens
export const apiBffPens     = '/bff/pens'
export const apiBffPensById = (id: string) => `/bff/pens/${id}`

// Houses
export const apiBffHouses      = '/bff/houses'
export const apiBffHousesById  = (id: string) => `/bff/houses/${id}`
export const apiBffHouseTypes     = '/bff/house-types'
export const apiBffHouseTypesById = (id: string) => `/bff/house-types/${id}`

// Feed Stocks
export const apiBffFeedStocks             = '/bff/feed-stocks'
export const apiBffFeedStocksById         = (id: string) => `/bff/feed-stocks/${id}`
export const apiBffFeedStocksIn           = (id: string) => `/bff/feed-stocks/${id}/in`
export const apiBffFeedStocksOut          = (id: string) => `/bff/feed-stocks/${id}/out`
export const apiBffFeedStocksAdjust       = (id: string) => `/bff/feed-stocks/${id}/adjust`
export const apiBffFeedStocksTransactions = (id: string) => `/bff/feed-stocks/${id}/transactions`
