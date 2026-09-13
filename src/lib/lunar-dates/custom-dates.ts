import { Lunar, LunarMonth, LunarYear, Solar } from 'lunar-javascript';
import { LUNAR_MILESTONE_DAYS, monthRules } from './constants';
import type {
	CustomDateInput,
	CustomYearRange,
	GregorianDateParts,
	IcsEventOverrides,
	LunarDateNotification,
	LunarMonthDay,
	MonthlyEventId,
	MonthRule,
} from './lunar-dates.type';

export type LunarDateObj = {
	year: number;
	month: number;
	day: number;
};

const LUNAR_DAY_LABELS: Record<
	MonthlyEventId,
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

const SHIWU_DAY_OFFSET =
	LUNAR_MILESTONE_DAYS.shiwu - LUNAR_MILESTONE_DAYS.chuyi;

const solarToDateParts = (solar: Solar): GregorianDateParts => [
	solar.getYear(),
	solar.getMonth(),
	solar.getDay(),
];

const getChuyiShiwuFromLunarMonth = (
	month: LunarMonth,
): [GregorianDateParts, GregorianDateParts] => {
	const chuyi = Solar.fromJulianDay(month.getFirstJulianDay());
	const shiwu = chuyi.next(SHIWU_DAY_OFFSET);

	return [solarToDateParts(chuyi), solarToDateParts(shiwu)];
};

const createLunarDateNotification = (
	date: GregorianDateParts,
	type: MonthlyEventId,
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

const resolveLunarMonthDay = (input: CustomDateInput): LunarMonthDay => {
	if (input.kind === 'lunar') {
		return { lunarMonth: input.lunarMonth, lunarDay: input.lunarDay };
	}

	const lunar = Solar.fromYmd(
		input.solarYear,
		input.solarMonth,
		input.solarDay,
	).getLunar();

	return { lunarMonth: lunar.getMonth(), lunarDay: lunar.getDay() };
};

const getSolarFromLunar = ({ year, month, day }: LunarDateObj) =>
	solarToDateParts(Lunar.fromYmd(year, month, day).getSolar());

const lunarToGregorianParts = ({
	year,
	month,
	day,
}: LunarDateObj): GregorianDateParts | null => {
	try {
		const daysInLunarMonth = LunarMonth.fromYm(year, month)?.getDayCount() ?? 0;
		const localDay = day >= daysInLunarMonth ? daysInLunarMonth : day;
		return getSolarFromLunar({ year, month, day: localDay });
	} catch {
		throw new Error(`Invalid lunar date - ${year}-${month}-${day}`);
	}
};

const pickIcsOverrides = (
	input: CustomDateInput,
): IcsEventOverrides | undefined => {
	const overrides: IcsEventOverrides = {
		location: input.location,
		alarmDaysBefore: input.alarmDaysBefore,
		alarmHour: input.alarmHour,
		alarmMinute: input.alarmMinute,
		timeTransparent: input.timeTransparent,
		visibility: input.visibility,
	};

	const hasOverride = Object.values(overrides).some(
		(value) => value !== undefined,
	);
	if (!hasOverride) {
		return undefined;
	}

	return overrides;
};

const createCustomNotification = (
	date: GregorianDateParts,
	input: CustomDateInput,
): LunarDateNotification => {
	return {
		date,
		type: 'custom',
		title: input.title,
		summary: input.title,
		description: input.description ?? '',
		icsOverrides: pickIcsOverrides(input),
	};
};

const expandCustomDate = (
	input: CustomDateInput,
	{ startYear, numberOfYears }: CustomYearRange,
): LunarDateNotification[] => {
	const { lunarMonth, lunarDay } = resolveLunarMonthDay(input);
	const notifications: LunarDateNotification[] = [];

	const isLeapMonthInStartYear =
		lunarMonth < 0 && LunarMonth.fromYm(startYear, lunarMonth)?.isLeap();

	for (let i = 0; i <= numberOfYears; i++) {
		const lunarYear = startYear + i;
		const monthForYear =
			isLeapMonthInStartYear && i === 0 ? lunarMonth : Math.abs(lunarMonth);

		const date = lunarToGregorianParts({
			year: lunarYear,
			month: monthForYear,
			day: lunarDay,
		});

		if (!date) {
			continue;
		}
		notifications.push(createCustomNotification(date, input));
	}

	return notifications;
};

const expandMonthlyEvents = (
	{ startYear, numberOfYears }: CustomYearRange,
	events: Record<MonthlyEventId, boolean>,
): LunarDateNotification[] => {
	if (!events.chuyi && !events.shiwu) {
		return [];
	}

	const notifications: LunarDateNotification[] = [];

	for (let i = 0; i <= numberOfYears; i++) {
		const monthsInYear = LunarYear.fromYear(startYear + i).getMonthsInYear();

		for (const month of monthsInYear) {
			const rule = monthRuleByValue.get(month.getMonth());
			if (!rule) {
				continue;
			}

			const [chuyiDate, shiwuDate] = getChuyiShiwuFromLunarMonth(month);
			if (events.chuyi) {
				notifications.push(
					createLunarDateNotification(chuyiDate, 'chuyi', rule),
				);
			}
			if (events.shiwu) {
				notifications.push(
					createLunarDateNotification(shiwuDate, 'shiwu', rule),
				);
			}
		}
	}

	return notifications;
};

const collectCustomNotifications = (
	customDates: CustomDateInput[],
	yearRange: CustomYearRange,
): LunarDateNotification[] => {
	return customDates.flatMap((input) => expandCustomDate(input, yearRange));
};

export {
	collectCustomNotifications,
	expandCustomDate,
	expandMonthlyEvents,
	resolveLunarMonthDay,
};
