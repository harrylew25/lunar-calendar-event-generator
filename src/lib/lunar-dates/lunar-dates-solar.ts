import { CALENDAR_DEFAULTS, SOLAR_MONTH } from '@lunar-dates/constants';
import type { LunarStart, SolarStartInput } from '@lunar-dates/lunar-dates.type';
import { Solar } from 'lunar-javascript';

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

const isSolarStartMode = (options: SolarStartInput & Partial<LunarStart>): boolean => {
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

export {
	resolveLunarStartFromSolarMonth,
	resolveStartFromOptions,
	validateSolarMonth
};
