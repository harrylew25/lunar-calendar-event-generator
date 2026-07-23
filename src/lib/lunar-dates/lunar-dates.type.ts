import { LunarMonth, LunarYear } from 'lunar-javascript';
import { monthRules } from './constants';

type LunarDateType = 'chuyi' | 'shiwu';

type GregorianDateParts = readonly [year: number, month: number, day: number];

type LunarDateNotification = {
	date: GregorianDateParts;
	type: LunarDateType;
	summary: string;
	description: string;
	title: string;
};

type LunarStart = {
	startYear: number;
	startMonth: number;
};

type SolarStartInput = {
	startSolarYear?: number;
	startSolarMonth?: number;
};

type LunarDateNotificationsOptions = SolarStartInput &
	Partial<LunarStart> & {
		numberOfYears?: number;
	};

type GenerateLunarCalendarIcsOptions = {
	calendarName?: string;
};

type MonthRule = (typeof monthRules)[number];

type LunarMonthInstance = NonNullable<ReturnType<typeof LunarMonth.fromYm>>;

type MonthsInYear = ReturnType<LunarYear['getMonthsInYear']>;

export type {
	GenerateLunarCalendarIcsOptions,
	GregorianDateParts,
	LunarDateNotification,
	LunarDateNotificationsOptions,
	LunarDateType,
	LunarMonthInstance,
	LunarStart,
	MonthsInYear,
	MonthRule,
	SolarStartInput,
};
