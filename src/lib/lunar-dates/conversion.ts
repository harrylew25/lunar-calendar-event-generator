import { LunarMonth, Solar } from 'lunar-javascript';
import {
	CALENDAR_DEFAULTS,
	LUNAR_MILESTONE_DAYS,
	SOLAR_MONTH,
} from './constants';
import type {
	GregorianDateParts,
	LunarMonthInstance,
	LunarStart,
	SolarStartInput,
} from './lunar-dates.type';

const SHIWU_DAY_OFFSET =
	LUNAR_MILESTONE_DAYS.shiwu - LUNAR_MILESTONE_DAYS.chuyi;

const validateSolarMonth = (solarMonth: number): void => {
	if (solarMonth < SOLAR_MONTH.min || solarMonth > SOLAR_MONTH.max) {
		throw new Error(
			`Solar month must be between ${SOLAR_MONTH.min} and ${SOLAR_MONTH.max}, received ${solarMonth}`,
		);
	}
};

const resolveLunarStartFromSolarMonth = (
	solarYear: number,
	solarMonth: number,
): LunarStart => {
	validateSolarMonth(solarMonth);
	const lunar = Solar.fromYmd(
		solarYear,
		solarMonth,
		SOLAR_MONTH.firstDay,
	).getLunar();

	return {
		startYear: lunar.getYear(),
		startMonth: lunar.getMonth(),
	};
};

const isSolarStartMode = (
	options: SolarStartInput & Partial<LunarStart>,
): boolean => {
	const hasSolarInput =
		options.startSolarYear !== undefined ||
		options.startSolarMonth !== undefined;
	const hasLunarInput =
		options.startYear !== undefined || options.startMonth !== undefined;

	return hasSolarInput || !hasLunarInput;
};

const resolveStartFromOptions = (
	options: SolarStartInput & Partial<LunarStart>,
	defaultLunarStart: LunarStart,
): LunarStart => {
	if (isSolarStartMode(options)) {
		const solarYear = options.startSolarYear ?? CALENDAR_DEFAULTS.startYear;
		const solarMonth = options.startSolarMonth ?? CALENDAR_DEFAULTS.startMonth;
		return resolveLunarStartFromSolarMonth(solarYear, solarMonth);
	}

	return {
		startYear: options.startYear ?? defaultLunarStart.startYear,
		startMonth: options.startMonth ?? defaultLunarStart.startMonth,
	};
};

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

const resolveStartLunarYearFromGregorian = (gregorianYear: number): number => {
	return Solar.fromYmd(gregorianYear, 1, 1).getLunar().getYear();
};

export {
	getChuyiShiwuFromLunarMonth,
	getFirstAndFifteenDay,
	resolveLunarStartFromSolarMonth,
	resolveStartFromOptions,
	resolveStartLunarYearFromGregorian,
	solarToDateParts,
	validateSolarMonth,
};
