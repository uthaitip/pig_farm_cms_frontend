export const SUPPLY_CATEGORY_LABEL: Record<string, string> = {
  FEED:     'อาหาร',
  MEDICINE: 'ยา',
  VACCINE:  'วัคซีน',
}

export const SUPPLY_CATEGORY_CLASS: Record<string, string> = {
  FEED:     'bg-green-100 text-green-700',
  MEDICINE: 'bg-blue-100 text-blue-700',
  VACCINE:  'bg-purple-100 text-purple-700',
}

export function supplyCategoryLabel(cat: string): string {
  return SUPPLY_CATEGORY_LABEL[cat] ?? cat
}

export function supplyCategoryClass(cat: string): string {
  return SUPPLY_CATEGORY_CLASS[cat] ?? 'bg-gray-100 text-gray-600'
}
