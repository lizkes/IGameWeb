const isToday = (date: Date): boolean => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

const dateFormat = (date: Date, ignore_today: boolean = true): string => {
  const inputTime = date.getTime();
  const is_before = Date.now() - inputTime > 0;
  const mistiming = Math.round(
    (is_before ? Date.now() - inputTime : inputTime - Date.now()) / 1000
  );

  if (ignore_today) {
    const arrr = ["年", "个月", "周", "天", "小时", "分钟", "秒"];
    const arrn = [31536000, 2592000, 604800, 86400, 3600, 60, 1];
    for (let i = 0; i < arrn.length; i += 1) {
      const inm = Math.floor(mistiming / arrn[i]);
      if (inm !== 0) {
        return `${inm + arrr[i]}${is_before ? "前" : "后"}`;
      }
    }
    return `${mistiming}秒${is_before ? "前" : "后"}`;
  } else {
    const arrr = ["年", "个月", "周", "天"];
    const arrn = [31536000, 2592000, 604800, 86400];
    for (let i = 0; i < arrn.length; i += 1) {
      const inm = Math.floor(mistiming / arrn[i]);
      if (inm > 0) {
        return `${inm + arrr[i]}${is_before ? "前" : "后"}`;
      }
    }
    if (isToday(date)) {
      return "今天";
    } else {
      return `${is_before ? "昨天" : "明天"}`;
    }
  }
};

const dateToDay = (date: Date): number => {
  const inputTime = date.getTime();
  const mistiming = Math.round((inputTime - Date.now()) / 1000);
  const day = Math.floor(mistiming / 86400);
  return day;
};

const toDate = (s: string): Date => {
  if (s.trim() === "") {
    return new Date(0);
  }

  let [date, time, ,] = s.split(" ");
  let [year, month, day] = date.split("-");
  let [hour, minute, secPlusMil] = time.split(":");
  let [second, millisecond] = secPlusMil.split(".");

  if (millisecond === undefined) {
    millisecond = "000";
  } else {
    millisecond = millisecond.slice(0, 3);
  }

  return new Date(
    Date.UTC(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hour),
      Number(minute),
      Number(second),
      Number(millisecond)
    )
  );
};

export { dateFormat, isToday, dateToDay, toDate };
