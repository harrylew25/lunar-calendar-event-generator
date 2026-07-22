import { monthRules } from './constants';

type LunarDateType = 'chuyi' | 'shiwu';

type LunarDateNotification = {
	date: number[];
	type: LunarDateType;
	summary: string;
	description: string;
	title: string;
};

type LunarDateNotificationsOptions = {
	startSolarYear?: number;
	startSolarMonth?: number;
	startYear?: number;
	startMonth?: number;
	numberOfYears?: number;
};

type MonthRule = (typeof monthRules)[number];

export type {
	LunarDateNotification,
	LunarDateNotificationsOptions,
	LunarDateType,
	MonthRule,
};
