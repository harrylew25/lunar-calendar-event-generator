import { LunarYear } from 'lunar-javascript';
import { CALENDAR_DEFAULTS } from './constants';
import {
	createMonthNotifications,
	getMonthRule,
} from './lunar-dates-notifications';
import { resolveStartFromOptions } from './lunar-dates-solar';
import type {
	LunarDateNotification,
	LunarDateNotificationsOptions,
} from './lunar-dates.type';

type MonthsInYear = ReturnType<LunarYear['getMonthsInYear']>;

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

const getLunarDateNotifications = (
	options: LunarDateNotificationsOptions = {},
): LunarDateNotification[] => {
	const { startYear, startMonth } = resolveStartFromOptions(options, {
		startYear: CALENDAR_DEFAULTS.startYear,
		startMonth: CALENDAR_DEFAULTS.startMonth,
	});
	const numberOfYears = options.numberOfYears ?? CALENDAR_DEFAULTS.numberOfYears;
	const notifications: LunarDateNotification[] = [];
	const baseYear = LunarYear.fromYear(startYear);

	for (let i = 0; i <= numberOfYears; i++) {
		const yearObj = baseYear.next(i);
		const fromIndex =
			i === 0
				? getFirstYearMonthIndex(yearObj.getMonthsInYear(), startMonth)
				: 0;

		if (fromIndex === -1) {
			continue;
		}

		collectYearNotifications(yearObj, fromIndex, notifications);
	}

	return notifications;
};

export { getLunarDateNotifications };
