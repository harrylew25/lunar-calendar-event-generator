import { LunarYear } from 'lunar-javascript';
import {
	CALENDAR_DEFAULTS,
	LUNAR_MILESTONE_DAYS,
	monthRules,
} from './constants';
import {
	getChuyiShiwuFromLunarMonth,
	resolveStartFromOptions,
} from './conversion';
import { collectCustomNotifications } from './custom-dates';
import type {
	GregorianDateParts,
	LunarDateNotification,
	LunarDateNotificationsOptions,
	LunarDateType,
	LunarMonthInstance,
	MonthRule,
	MonthsInYear,
} from './lunar-dates.type';

const LUNAR_DAY_LABELS: Record<
	Exclude<LunarDateType, 'custom'>,
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

type MilestoneDateType = Exclude<LunarDateType, 'custom'>;

const createLunarDateNotification = (
	date: GregorianDateParts,
	type: MilestoneDateType,
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

const getFirstYearMonthIndex = (
	monthsInYear: MonthsInYear,
	startMonth: number,
): number => {
	return monthsInYear.findIndex((month) => month.getMonth() === startMonth);
};

const collectYearNotifications = (
	yearObj: LunarYear,
	fromMonthIndex: number,
	sink: LunarDateNotification[],
): void => {
	const monthsInYear = yearObj.getMonthsInYear();

	for (let i = fromMonthIndex; i < monthsInYear.length; i++) {
		const lunarMonth = monthsInYear[i];
		if (!lunarMonth) {
			continue;
		}

		const rule = getMonthRule(lunarMonth.getMonth());
		if (!rule) {
			continue;
		}

		const pair = createMonthNotifications(lunarMonth, rule);
		sink.push(...pair);
	}
};

const compareByGregorianDate = (
	a: LunarDateNotification,
	b: LunarDateNotification,
): number => {
	const [aYear, aMonth, aDay] = a.date;
	const [bYear, bMonth, bDay] = b.date;

	if (aYear !== bYear) {
		return aYear - bYear;
	}
	if (aMonth !== bMonth) {
		return aMonth - bMonth;
	}
	return aDay - bDay;
};

const getLunarDateNotifications = (
	options: LunarDateNotificationsOptions = {},
): LunarDateNotification[] => {
	const { startYear, startMonth } = resolveStartFromOptions(options, {
		startYear: CALENDAR_DEFAULTS.startYear,
		startMonth: CALENDAR_DEFAULTS.startMonth,
	});
	const numberOfYears =
		options.numberOfYears ?? CALENDAR_DEFAULTS.numberOfYears;
	const notifications: LunarDateNotification[] = [];
	const baseYear = LunarYear.fromYear(startYear);
	const firstYearFromIndex = getFirstYearMonthIndex(
		baseYear.getMonthsInYear(),
		startMonth,
	);

	for (let i = 0; i <= numberOfYears; i++) {
		const yearObj = baseYear.next(i);
		const fromIndex = i === 0 ? firstYearFromIndex : 0;

		if (fromIndex === -1) {
			continue;
		}

		collectYearNotifications(yearObj, fromIndex, notifications);
	}

	if (options.customDates?.length) {
		notifications.push(
			...collectCustomNotifications(options.customDates, {
				startYear,
				numberOfYears,
			}),
		);
		notifications.sort(compareByGregorianDate);
	}

	return notifications;
};

export {
	createLunarDateNotification,
	createMonthNotifications,
	getLunarDateNotifications,
	getMonthRule,
};
