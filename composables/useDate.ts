import moment from "moment";

function formatDateDisplay(date: any, format: string = "DD-MM-YYYY") {
  if (!!date) {
    let dateStr = "";
    const parseDate = moment(date);
    dateStr = moment(parseDate).format(format);
    return dateStr ?? "";
  }
}

function formatDateDisplayTH(date: any, formatDM: string = "DD/MM", formatY: string = "/YYYY") {
  if (!!date) {
    let year = 0;
    let dateStr = "";
    let yearStr = "";

    const parseDate = moment(date);
    year = parseDate.year() + 543;
    dateStr = moment(parseDate).format(formatDM);
    yearStr = moment(year, "YYYY").format(formatY);

    dateStr = !!dateStr && dateStr != "Invalid date" ? dateStr : "";
    yearStr = !!yearStr && yearStr != "Invalid date" ? yearStr : "";
    return `${dateStr}${yearStr}`;
  }
}

function formatTimeDisplay(data: any) {
  if (!!data) {
    return moment(data).format('HH:mm:ss') ?? '';
  }
}

function formatDateTHToDate(date: any, formatTH: string = "DD/MM/YYYY") {
  if (!!date) {
    return moment(date, formatTH).subtract(543, 'y').toDate();
  }
}

function formatDateTHToFormatEN(date: any, formFormat: string, toFormat: string) {
  if (!!date && !!formFormat && !!toFormat) {
    return moment(date, formFormat).subtract(543, 'y').format(toFormat);
  }
}

function formatDateSave(date: any, format: string = "YYYY-MM-DD") {
  if (!!date) {
    let dateStr = "";
    dateStr = moment(date).format(format);
    return dateStr;
  }
}

function parseStringToDate(dateStr: string) {
  const mDate = moment(dateStr);
  return mDate.toDate();
}

function getAge(date: any) {
  const age = moment(moment()).diff(moment(date, "YYYY-MM-DD"), 'year');
  return isNaN(age) ? "" : age?.toString();
}

function formatWithTimezone(date = new Date(), offsetHours = 7) {
  const localTime = new Date(date.getTime() + offsetHours * 60 * 60 * 1000);
  const iso = localTime.toISOString().slice(0, 19);
  const offset = offsetHours >= 0
    ? `+${String(offsetHours).padStart(2, '0')}:00`
    : `${String(offsetHours).padStart(3, '0')}:00`;
  return `${iso}${offset}`;
}

function formatDateTimeDisplayTHStrict(
  date: any,
  inputFormat: string = "DD/MM/YYYY HH:mm",
  outputFormat: string = "DD/MM/YYYY"
) {
  if (!date) return "";
  const m = moment(date, inputFormat, true);
  if (!m.isValid()) return "";
  return m.add(543, "year").format(outputFormat);
}

export {
  getAge,
  formatDateDisplay,
  formatDateSave,
  formatDateDisplayTH,
  formatDateTHToDate,
  formatDateTHToFormatEN,
  parseStringToDate,
  formatTimeDisplay,
  formatWithTimezone,
  formatDateTimeDisplayTHStrict,
};
