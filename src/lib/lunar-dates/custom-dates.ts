import { Lunar, Solar } from 'lunar-javascript';
import { solarToDateParts } from './conversion';
import type {
	CustomDateInput,
	CustomYearRange,
	GregorianDateParts,
	IcsEventOverrides,
	LunarDateNotification,
	LunarMonthDay,
} from './lunar-dates.type';

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

const lunarToGregorianParts = (
	lunarYear: number,
	lunarMonth: number,
	lunarDay: number,
): GregorianDateParts => {
	// TODO: refactor this as we are not handling the error in the catch block
	try {
		let solar = null;
		console.log({ solar, lunarYear, lunarMonth, lunarDay });
		if (lunarMonth < 0) {
			solar = Lunar.fromYmd(lunarYear, -lunarMonth, lunarDay).getSolar();
		}
		solar = Lunar.fromYmd(lunarYear, lunarMonth, lunarDay).getSolar();
		return solarToDateParts(solar);
	} catch {
		return solarToDateParts(Lunar.fromYmd(lunarYear, Math.abs(lunarMonth), lunarDay - 1).getSolar());
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

	for (let i = 0; i <= numberOfYears; i++) {
		const lunarYear = startYear + i;
		const date = lunarToGregorianParts(lunarYear, lunarMonth, lunarDay);
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
