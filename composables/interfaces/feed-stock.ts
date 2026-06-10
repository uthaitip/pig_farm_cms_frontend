export interface FeedStock {
  _id:             string
  feedTypeId:      string
  currentQuantity: number
  createdAt:       Date
  updatedAt:       Date
  __v:             number
  includeFeedType: IncludeFeedType
  minimumQuantity?: number
  note?:           null
}

export interface IncludeFeedType {
  _id:             string
  feedCode:        string
  feedName:        string
  category:        string
  unit:            string
  minimumQuantity: number
  description:     null
  createdAt:       Date
  updatedAt:       Date
  __v:             number
}
