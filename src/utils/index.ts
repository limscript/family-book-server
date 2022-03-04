const dayjs = require('dayjs');

/**
 * 时间格式化
 * @param date
 * @param format
 * @returns
 */
export const formatDate = (
  date: Date | null,
  format: string = 'YYYY-MM-DD'
) => {
  return dayjs(date || new Date()).format(format);
};

/**
 * 日期相减
 * @param date
 * @param num
 * @param unit
 * @returns
 */
export const dateSubtract = (
  date: Date | null,
  num: number,
  unit: string = 'day',
) => {

  return dayjs(date || new Date()).subtract(num, unit).toDate()
}

/**
 * 日期相加
 * @param date
 * @param num
 * @param unit
 * @returns
 */
export const dateAdd = (
  date: Date | null,
  num: number,
  unit: string = 'day',
) => {

  return dayjs(date || new Date()).add(num, unit).format('YYYY-MM-DD')
}

/**
 * 日期差值
 * @param endDate
 * @param startDate
 * @param unit
 * @returns
 */
export const dateDiff = (endDate: Date | null, startDate: Date | null, unit: string = 'day') => {
  return dayjs(endDate || new Date()).diff(startDate || new Date(), unit)
}

export const dateArray = (len: number, startDate: Date, type: number) => {
  let array = [...Array(len + 1).keys()]
  if (type === 1) {
    array = array.map(item => dateAdd(startDate, item))
  } else {
    array = array.map(item => dayjs(startDate).startOf('year').add(item, 'month').format('YYYY-MM'))
  }
  return array
}
