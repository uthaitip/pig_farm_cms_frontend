export interface IPigBatchPen {
  _id: string
  penCode: string
  penName: string
  houseId: {
    _id: string
    houseCode: string
    houseName: string
  }
}

export interface IPigBatch {
  _id: string
  batchCode: string
  batchName: string | null
  penId: IPigBatchPen
  sourceType: 'BORN' | 'PURCHASED'
  receivedDate: string
  initialQuantity: number
  currentQuantity: number
  averageWeight: number | null
  status: 'ACTIVE' | 'CLOSED'
  description: string | null
  createdAt: string
  updatedAt: string
}

export interface IFormPigBatch {
  batchName: string | null
  penId: string | null
  sourceType: 'BORN' | 'PURCHASED' | ''
  receivedDate: string
  initialQuantity: number | string
  currentQuantity?: number | string
  averageWeight: number | string | null
  description: string | null
  status?: 'ACTIVE' | 'CLOSED'
}

export interface IPigBatchTransaction {
  _id: string
  batchId: string
  transactionType: 'RECEIVE' | 'MOVE_IN' | 'MOVE_OUT' | 'DEAD' | 'SOLD' | 'ADJUST'
  quantity: number
  transactionDate: string
  fromPenId: string | null
  toPenId: string | null
  remark: string | null
  employeeId: string | null
  createdAt: string
}
