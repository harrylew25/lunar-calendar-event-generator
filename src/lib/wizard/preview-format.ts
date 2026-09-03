import type { GregorianDateParts } from '@lunar-dates/lunar-dates.type';
import { Solar } from 'lunar-javascript';

type LunarDateObject = {
	solarDate: GregorianDateParts;
	lunarMonth: string;
	lunarDay: string;
	label: string;
};

export const getLunarObjectFromDate = (date: GregorianDateParts): LunarDateObject => {
	const lunarDate = Solar.fromYmd(date[0], date[1], date[2]).getLunar();
	const lunarMonth = lunarDate.getMonthInChinese();
	const lunarDay = lunarDate.getDayInChinese();
	return {
		solarDate: date,
		lunarMonth, lunarDay,
		label: `${lunarMonth}月${lunarDay}日`
	};
};
