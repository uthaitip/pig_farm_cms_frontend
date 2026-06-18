import moment from 'moment'

export const MONTHS_TH = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม',     'เมษายน',
  'พฤษภาคม', 'มิถุนายน',  'กรกฎาคม',   'สิงหาคม',
  'กันยายน',  'ตุลาคม',    'พฤศจิกายน', 'ธันวาคม',
]

export const MONTHS_SHORT_TH = [
  'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.',
  'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.',
  'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.',
]

export function formatDateDisplay(date: any, format: string = 'DD-MM-YYYY'): string {
  if (!date) return ''
  const parsed = moment(date)
  const result = parsed.format(format)
  return result === 'Invalid date' ? '' : result
}

export function formatDateDisplayTH(date: any, formatDM: string = 'DD/MM', formatY: string = '/YYYY'): string {
  if (!date) return ''
  const parsed = moment(date)
  if (!parsed.isValid()) return ''
  const year    = parsed.year() + 543
  const datePart = parsed.format(formatDM)
  const yearPart = moment(year, 'YYYY').format(formatY)
  const d = datePart !== 'Invalid date' ? datePart : ''
  const y = yearPart !== 'Invalid date' ? yearPart : ''
  return `${d}${y}`
}

export function formatDateSave(date: any, format: string = 'YYYY-MM-DD'): string {
  if (!date) return ''
  const result = moment(date).format(format)
  return result === 'Invalid date' ? '' : result
}

export function formatTimeDisplay(date: any): string {
  if (!date) return ''
  const result = moment(date).format('HH:mm:ss')
  return result === 'Invalid date' ? '' : result
}

export function formatDateTHToDate(date: any, formatTH: string = 'DD/MM/YYYY'): Date | undefined {
  if (!date) return undefined
  return moment(date, formatTH).subtract(543, 'y').toDate()
}

export function formatDateTHToFormatEN(date: any, fromFormat: string, toFormat: string): string {
  if (!date || !fromFormat || !toFormat) return ''
  return moment(date, fromFormat).subtract(543, 'y').format(toFormat)
}

export function parseStringToDate(dateStr: string): Date {
  return moment(dateStr).toDate()
}

export function getAge(date: any): string {
  const age = moment().diff(moment(date, 'YYYY-MM-DD'), 'year')
  return isNaN(age) ? '' : age.toString()
}

export function formatWithTimezone(date: Date = new Date(), offsetHours: number = 7): string {
  const localTime = new Date(date.getTime() + offsetHours * 60 * 60 * 1000)
  const iso    = localTime.toISOString().slice(0, 19)
  const offset = offsetHours >= 0
    ? `+${String(offsetHours).padStart(2, '0')}:00`
    : `${String(offsetHours).padStart(3, '0')}:00`
  return `${iso}${offset}`
}

export function formatDateTimeDisplayTHStrict(
  date: any,
  inputFormat:  string = 'DD/MM/YYYY HH:mm',
  outputFormat: string = 'DD/MM/YYYY',
): string {
  if (!date) return ''
  const m = moment(date, inputFormat, true)
  if (!m.isValid()) return ''
  return m.add(543, 'year').format(outputFormat)
}

export function formatMonthNameTH(date: any, short: boolean = false): string {
  if (!date) return ''
  const m = moment(date)
  if (!m.isValid()) return ''
  return short ? MONTHS_SHORT_TH[m.month()] : MONTHS_TH[m.month()]
}

export function formatDateFullTH(date: any): string {
  if (!date) return ''
  const m = moment(date)
  if (!m.isValid()) return ''
  const day   = m.date()
  const month = MONTHS_TH[m.month()]
  const year  = m.year() + 543
  return `${day} ${month} ${year}`
}
