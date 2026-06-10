export interface ISale {
  _id: string
  saleNo: string
  customerId: string | { _id: string; customerCode: string; customerName: string; phoneNumber?: string }
  saleDate: string
  totalQuantity: number
  totalAmount: number
  status: 'DRAFT' | 'COMPLETED' | 'CANCELLED'
  note: string | null
  createdAt: string
  updatedAt: string
}

export interface ISaleDetail {
  _id: string
  saleId: string
  batchId: string | { _id: string; batchCode: string; batchName: string | null }
  quantity: number
  averageWeight: number | null
  totalWeight: number | null
  pricePerKg: number | null
  amount: number
}

export interface IFormSaleDetail {
  batchId: string
  quantity: number | null
  averageWeight: number | null
  totalWeight: number | null
  pricePerKg: number | null
  amount: number | null
}

export interface IFormSale {
  customerId: string
  saleDate: string
  note: string
  details: IFormSaleDetail[]
}

export function emptySaleDetail(): IFormSaleDetail {
  return {
    batchId: '',
    quantity: null,
    averageWeight: null,
    totalWeight: null,
    pricePerKg: null,
    amount: null,
  }
}
