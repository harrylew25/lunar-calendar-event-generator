import type { LunarMonth, LunarYear } from 'lunar-javascript';
import type { monthRules } from './constants';

type LunarDateType = 'chuyi' | 'shiwu' | 'custom';

type GregorianDateParts = readonly [year: number, month: number, day: number];

type IcsEventVisibility = 'PUBLIC' | 'PRIVATE' | 'CONFIDENTIAL';

type IcsTimeTransparent = 'TRANSPARENT' | 'OPAQUE';

type IcsEventOverrides = {
	location?: string;
	alarmDaysBefore?: number;
	alarmHour?: number;
	alarmMinute?: number;
	timeTransparent?: IcsTimeTransparent;
	visibility?: IcsEventVisibility;
};

type LunarDateNotification = {
	date: GregorianDateParts;
	type: LunarDateType;
	summary: string;
	description: string;
	title: string;
	icsOverrides?: IcsEventOverrides;
};

type LunarStart = {
	startYear: number;
	startMonth: number;
};

type SolarStartInput = {
	startSolarYear?: number;
	startSolarMonth?: number;
};

type CustomDateInputBase = {
	title: string;
	description?: string;
} & IcsEventOverrides;

type LunarCustomDateInput = CustomDateInputBase & {
	kind: 'lunar';
	lunarYear?: number;
	lunarMonth: number;
	lunarDay: number;
};

type SolarCustomDateInput = CustomDateInputBase & {
	kind: 'solar';
	solarYear: number;
	solarMonth: number;
	solarDay: number;
};

type CustomDateInput = LunarCustomDateInput | SolarCustomDateInput;

type LunarMonthDay = {
	lunarMonth: number;
	lunarDay: number;
};

type CustomYearRange = {
	startYear: number;
	numberOfYears: number;
};

type LunarDateNotificationsOptions = SolarStartInput &
	Partial<LunarStart> & {
		numberOfYears?: number;
		customDates?: CustomDateInput[];
	};

type GenerateLunarCalendarIcsOptions = {
	calendarName?: string;
};

type MonthRule = (typeof monthRules)[number];

type LunarMonthInstance = NonNullable<ReturnType<typeof LunarMonth.fromYm>>;

type MonthsInYear = ReturnType<LunarYear['getMonthsInYear']>;

export type {
	CustomDateInput,
	CustomYearRange,
	GenerateLunarCalendarIcsOptions,
	GregorianDateParts,
	IcsEventOverrides,
	IcsEventVisibility,
	IcsTimeTransparent,
	LunarCustomDateInput,
	LunarDateNotification,
	LunarDateNotificationsOptions,
	LunarDateType,
	LunarMonthDay,
	LunarMonthInstance,
	LunarStart,
	MonthRule,
	MonthsInYear,
	SolarCustomDateInput,
	SolarStartInput,
};
