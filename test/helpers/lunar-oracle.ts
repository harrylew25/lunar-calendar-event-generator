import { LunarMonth, Solar } from 'lunar-javascript';
import { SOLAR_MONTH } from '../../src/lib/lunar-dates/constants';

type LunarStart = {
	startYear: number;
	startMonth: number;
};

const expectedLunarStartFromSolarMonth = (
	solarYear: number,
	solarMonth: number,
): LunarStart => {
	const lunar = Solar.fromYmd(solarYear, solarMonth, SOLAR_MONTH.firstDay).getLunar();
	return {
		startYear: lunar.getYear(),
		startMonth: lunar.getMonth(),
	};
};

const expectedChuyiSolarParts = (
	lunarYear: number,
	lunarMonth: number,
): number[] => {
	const month = LunarMonth.fromYm(lunarYear, lunarMonth);
	if (!month) {
		throw new Error(`Invalid lunar month: ${lunarYear}-${lunarMonth}`);
	}

	const solar = Solar.fromJulianDay(month.getFirstJulianDay());
	return [solar.getYear(), solar.getMonth(), solar.getDay()];
};

const solarPartsToDate = (parts: number[]): Date => {
	return new Date(parts[0]!, parts[1]! - 1, parts[2]!);
};

const daysBetweenSolarParts = (from: number[], to: number[]): number => {
	const fromDate = solarPartsToDate(from);
	const toDate = solarPartsToDate(to);
	const millisecondsPerDay = 1000 * 60 * 60 * 24;
	return Math.round((toDate.getTime() - fromDate.getTime()) / millisecondsPerDay);
};

export {
	daysBetweenSolarParts,
	expectedChuyiSolarParts,
	expectedLunarStartFromSolarMonth,
};
