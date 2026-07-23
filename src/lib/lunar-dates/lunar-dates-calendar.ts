import { LunarMonth, Solar } from 'lunar-javascript';
import { LUNAR_MILESTONE_DAYS } from './constants';
import type { GregorianDateParts, LunarMonthInstance } from './lunar-dates.type';

const SHIWU_DAY_OFFSET =
	LUNAR_MILESTONE_DAYS.shiwu - LUNAR_MILESTONE_DAYS.chuyi;

const solarToDateParts = (solar: Solar): GregorianDateParts => {
	return [solar.getYear(), solar.getMonth(), solar.getDay()];
};

const getChuyiShiwuFromLunarMonth = (
	lunarMonth: LunarMonthInstance,
): [GregorianDateParts, GregorianDateParts] => {
	const chuyi = Solar.fromJulianDay(lunarMonth.getFirstJulianDay());
	const shiwu = chuyi.next(SHIWU_DAY_OFFSET);

	return [solarToDateParts(chuyi), solarToDateParts(shiwu)];
};

const getFirstAndFifteenDay = (
	year: number,
	lunarMonth: number,
): [GregorianDateParts, GregorianDateParts] | null => {
	const month = LunarMonth.fromYm(year, lunarMonth);
	if (!month) {
		return null;
	}

	return getChuyiShiwuFromLunarMonth(month);
};

export {
	getChuyiShiwuFromLunarMonth,
	getFirstAndFifteenDay,
	solarToDateParts,
};
