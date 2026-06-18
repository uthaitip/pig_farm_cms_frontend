export interface IDashboardFeedStock {
  feedCode:   string
  feedName:   string
  category:   string
  currentQty: number
  unit:        string
}

export interface IDashboardSummary {
  totalPigCount:     number
  activeBatchCount:  number
  totalBatchCount:   number
  incomeThisMonth:   number
  expenseThisMonth:  number
  profitThisMonth:   number
  feedStocks:        IDashboardFeedStock[]
}
