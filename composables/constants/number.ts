export function formatNumberRemoveComma(value: any = "", defaultValue: string = "0"): string {
  return value?.toString()?.replaceAll(",", "") ?? defaultValue;
}

export function formatNumberComma(value?: any, toFixed: number = 0, defaultValue: string = "0", isToFixAuto: boolean = false): string {
  if (value === null || value === undefined || value?.toString() === "") return defaultValue;

  const valueStr = formatNumberRemoveComma(value) ?? "";
  const valueNum = Number(valueStr);

  if (isNaN(valueNum)) return value;

  let autoTofix = toFixed;
  if (isToFixAuto) {
    const split = valueStr.split(".");
    autoTofix = split?.length > 1 ? split[1].length : 0;
    if (split?.length > 1 && autoTofix == 0) return `${valueNum.toLocaleString()}.`;
  } else if (toFixed > 0) {
    const split = valueStr.split(".");
    autoTofix = split?.length > 1 ? split[1].length : 0;
    autoTofix = autoTofix > toFixed ? toFixed : autoTofix;
    if (split?.length > 1 && autoTofix == 0) return `${valueNum.toLocaleString()}.`;
  }

  return valueNum.toLocaleString(undefined, {
    minimumFractionDigits: autoTofix,
    maximumFractionDigits: autoTofix,
  });
}

export function formatNumberByString(value: any, defaultValue: any = 0, toFixed: number = 0): number {
  if (value == null || value == undefined || value == "") return defaultValue;

  let valueNum = Number(formatNumberRemoveComma(value));
  if (isNaN(valueNum)) return defaultValue;

  if (!!toFixed) {
    valueNum = Number(formatNumberRemoveComma(valueNum.toLocaleString(undefined, {
      minimumFractionDigits: toFixed,
      maximumFractionDigits: toFixed,
    })));
  }

  return valueNum;
}

export const numberDecimalOnly = (value: string): string => {
  return value
    .replace(/[^0-9.]/g, "")
    .replace(/(\..*)\./g, "$1");
};
