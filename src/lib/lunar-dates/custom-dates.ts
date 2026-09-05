import { Lunar, LunarMonth, Solar } from 'lunar-javascript';
import { solarToDateParts } from './conversion';
import type {
	CustomDateInput,
	CustomYearRange,
	GregorianDateParts,
	IcsEventOverrides,
	LunarDateNotification,
	LunarMonthDay,
} from './lunar-dates.type';

// TODO: merge with exisitng date object types
export type LunarDateObj = {
	year: number;
	month: number;
	day: number;
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

const collectCustomNotifications = (
	customDates: CustomDateInput[],
	yearRange: CustomYearRange,
): LunarDateNotification[] => {
	return customDates.flatMap((input) => expandCustomDate(input, yearRange));
};

export { collectCustomNotifications, expandCustomDate, resolveLunarMonthDay };
