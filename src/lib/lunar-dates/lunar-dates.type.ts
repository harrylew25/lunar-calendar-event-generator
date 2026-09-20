import type { FestivalId, MonthRule } from './constants';

type LunarDateType = 'chuyi' | 'shiwu' | 'custom';

type MonthlyEventId = Exclude<LunarDateType, 'custom'>;

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

type CustomCartRule = {
	kind: 'custom';
	lunarMonth: number;
	lunarDay: number;
	title: string;
	description?: string;
} & IcsEventOverrides;

type MonthlyCartRule = {
	kind: 'monthly';
	monthlyId: MonthlyEventId;
} & IcsEventOverrides;

type CatalogCartRule = {
	kind: 'catalog';
	catalogId: FestivalId;
} & IcsEventOverrides;

type CartRule = CustomCartRule | MonthlyCartRule | CatalogCartRule;

export type {
	CartRule,
	CatalogCartRule,
	CustomCartRule,
	CustomDateInput,
	CustomYearRange,
	GregorianDateParts,
	IcsEventOverrides,
	IcsEventVisibility,
	IcsTimeTransparent,
	LunarCustomDateInput,
	LunarDateNotification,
	LunarDateType,
	LunarMonthDay,
	LunarStart,
	MonthlyCartRule,
	MonthlyEventId,
	MonthRule,
	SolarCustomDateInput,
};
