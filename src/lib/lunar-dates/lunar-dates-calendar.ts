import { LunarMonth, Solar } from 'lunar-javascript';
import { LUNAR_MILESTONE_DAYS } from './constants';

const SHIWU_DAY_OFFSET =
	LUNAR_MILESTONE_DAYS.shiwu - LUNAR_MILESTONE_DAYS.chuyi;

type LunarMonthInstance = ReturnType<typeof LunarMonth.fromYm>;

const solarToDateParts = (solar: Solar): number[] => {
	return [solar.getYear(), solar.getMonth(), solar.getDay()];
};

const getChuyiShiwuFromLunarMonth = (
	lunarMonth: NonNullable<LunarMonthInstance>,
): [number[], number[]] => {
	const chuyi = Solar.fromJulianDay(lunarMonth.getFirstJulianDay());
	const shiwu = chuyi.next(SHIWU_DAY_OFFSET);

	return [solarToDateParts(chuyi), solarToDateParts(shiwu)];
};

const getFirstAndFifteenDay = (
	year: number,
	lunarMonth: number,
): [number[], number[]] | null => {
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
