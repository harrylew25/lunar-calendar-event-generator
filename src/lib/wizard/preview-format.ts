import type { GregorianDateParts } from '@lunar-dates/lunar-dates.type';
import { LunarMonth, Solar } from 'lunar-javascript';

type LunarDateObject = {
	solarDate: GregorianDateParts;
	lunarMonth: string;
	lunarDay: string;
	lunarYear: string;
	label: string;
	isLeapMonth: boolean;
	daysInMonth: number;
};

export const getLunarObjectFromDate = (
	date: GregorianDateParts,
): LunarDateObject => {
	const lunarDate = Solar.fromYmd(date[0], date[1], date[2]).getLunar();
	const isLeapMonth = LunarMonth.fromYm(date[0], date[1])?.isLeap() ?? false;
	const daysInMonth = LunarMonth.fromYm(date[0], date[1])?.getDayCount() ?? 0;
	const lunarMonth = lunarDate.getMonthInChinese();
	const lunarDay = lunarDate.getDayInChinese();
	const lunarYear = lunarDate.getYearInChinese();

	return {
		solarDate: date,
		lunarMonth,
		lunarDay,
		lunarYear,
		isLeapMonth,
		daysInMonth,
		label: `${lunarMonth}月${lunarDay}日`,
	};
};
