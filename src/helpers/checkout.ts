export const createOrderId = () => {
  const date = new Date()

  let year = date.getFullYear().toString();
  year = year.substring(year.length - 2, year.length);
  let month = (date.getMonth() + 1).toString().padStart(2, '0');
  let day = date.getDate().toString().padStart(2, '0');
  let hours = date.getHours().toString().padStart(2, '0')
  let minutes = date.getMinutes().toString().padStart(2, '0')
  let seconds = date.getSeconds().toString().padStart(2, '0')
  let milliseconds = date.getMilliseconds().toString().padStart(3, '0')

  return `${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}`
}