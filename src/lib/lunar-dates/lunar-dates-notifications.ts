import { LUNAR_MILESTONE_DAYS, monthRules } from './constants';
import { getChuyiShiwuFromLunarMonth } from './lunar-dates-calendar';
import type {
	GregorianDateParts,
	LunarDateNotification,
	LunarDateType,
	LunarMonthInstance,
	MonthRule,
} from './lunar-dates.type';

const LUNAR_DAY_LABELS: Record<
	LunarDateType,
	{ day: number; lunarLabel: string; eventLabel: string }
> = {
	chuyi: {
		day: LUNAR_MILESTONE_DAYS.chuyi,
		lunarLabel: '初一',
		eventLabel: 'Day 1 (New Moon)',
	},
	shiwu: {
		day: LUNAR_MILESTONE_DAYS.shiwu,
		lunarLabel: '十五',
		eventLabel: 'Day 15 (Full Moon)',
	},
};

const monthRuleByValue = new Map<number, MonthRule>(
	monthRules.map((rule) => [rule.value, rule]),
);

const getMonthRule = (monthValue: number): MonthRule | undefined => {
	return monthRuleByValue.get(monthValue);
};

const createLunarDateNotification = (
	date: GregorianDateParts,
	type: LunarDateType,
	rule: MonthRule,
): LunarDateNotification => {
	const { day, lunarLabel, eventLabel } = LUNAR_DAY_LABELS[type];

	return {
		date,
		type,
		title: `${rule.en} Day ${day}`,
		summary: `农历${rule.name}${lunarLabel} (${rule.en} Day ${day})`,
		description: `Lunar Calendar: ${rule.en}, ${eventLabel}`,
	};
};

const createMonthNotifications = (
	lunarMonth: LunarMonthInstance,
	rule: MonthRule,
): [LunarDateNotification, LunarDateNotification] => {
	const [chuyiDate, shiwuDate] = getChuyiShiwuFromLunarMonth(lunarMonth);

	return [
		createLunarDateNotification(chuyiDate, 'chuyi', rule),
		createLunarDateNotification(shiwuDate, 'shiwu', rule),
	];
};

export {
	createLunarDateNotification,
	createMonthNotifications,
	getMonthRule,
};
