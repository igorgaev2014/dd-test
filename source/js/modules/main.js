function swapDate(string) {
  const
    date = new Date(string),
    month = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2);
  return [date.getFullYear(), month, day].join(".");
}

function convertDate(date) {
  const 
    days = [
      'Воскресенье',
      'Понедельник',
      'Вторник',
      'Среда',
      'Четверг',
      'Пятница',
      'Суббота'
    ],

    months = [
      'Января', 
      'Февраля', 
      'Марта', 
      'Апреля', 
      'Мая', 
      'Июня', 
      'Июля', 
      'Августа', 
      'Сентября', 
      'Октября', 
      'Ноября', 
      'Декабря'
    ],

    prefixes = ['1', '2', '3', '4', '5']

  return days[date.getDay()] + ', ' + prefixes[Math.floor(date.getDate() / 7)] + ' неделя ' + months[date.getMonth()] + ' ' + date.getFullYear() + ' года';
}

function getDayInfo(date) {
  return convertDate(new Date(swapDate(date)));
}

let date = prompt("Введите дату в формате 'MM.DD.YYYY'");
alert(getDayInfo(date));

console.log(getDayInfo("01.01.2022"));
console.log(getDayInfo("12.15.2021"));