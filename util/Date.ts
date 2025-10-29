 
export const getDate = (date: DateLike) => {
  if (date && date instanceof Date) return date;
  if (typeof date === `string` && date.includes(`:`) && date.split(`:`).length === 2) {
    const dateStr = date
      .split(` `)
      .map(it => {
        if (it.includes(`:`)) return `${it}:00`;
        else return it;
      })
      .join(` `);
    return new Date(dateStr);
  }
  return new Date(date);
};

export const getSeason = () => {
  const now = new Date();
  const seasonIndex = Math.floor(now.getMonth() / 3)-1
  return ['WINTER', 'SPRING', 'SUMMER', 'FALL'][seasonIndex] as Season;
}

export const getDay=(date: Date)=>{
  const labels = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  return labels[date.getDay()];
}