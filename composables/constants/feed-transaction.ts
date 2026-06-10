export const FEED_TX_LABEL: Record<string, string> = {
  IN:     'รับเข้า',
  OUT:    'เบิกใช้',
  ADJUST: 'ปรับยอด',
}

export const FEED_TX_CLASS: Record<string, string> = {
  IN:     'bg-green-100 text-green-700',
  OUT:    'bg-red-100 text-red-700',
  ADJUST: 'bg-yellow-100 text-yellow-700',
}

export const FEED_TX_QUANTITY_COLOR: Record<string, string> = {
  IN:     'text-appsuccess',
  OUT:    'text-apperror',
  ADJUST: 'text-appblack',
}

export function feedTxLabel(type: string): string {
  return FEED_TX_LABEL[type] ?? type
}

export function feedTxClass(type: string): string {
  return FEED_TX_CLASS[type] ?? 'bg-gray-100 text-gray-600'
}

export function feedTxQuantityColor(type: string): string {
  return FEED_TX_QUANTITY_COLOR[type] ?? 'text-appblack'
}
