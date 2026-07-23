import { Lunar } from 'lunar-javascript';
import { CALENDAR_DEFAULTS, DEFAULT_CALENDAR_NAME, LUNAR_MILESTONE_DAYS } from './constants';
import {
	getFirstAndFifteenDay,
	solarToDateParts,
} from './lunar-dates-calendar';
import { getLunarDateNotifications } from './lunar-dates-generator';
import { resolveLunarStartFromSolarMonth } from './lunar-dates-solar';

export type {
	GenerateLunarCalendarIcsOptions,
	GregorianDateParts,
	LunarDateNotification,
	LunarDateNotificationsOptions,
	LunarDateType,
	LunarStart,
	MonthRule,
	SolarStartInput,
} from './lunar-dates.type';

export {
	CALENDAR_DEFAULTS,
	DEFAULT_CALENDAR_NAME,
	LUNAR_MILESTONE_DAYS,
	getFirstAndFifteenDay,
	getLunarDateNotifications,
	resolveLunarStartFromSolarMonth,
	solarToDateParts,
};

const getLunarDate = (date: Date): string => {
	return Lunar.fromDate(date).toString();
};

export { getLunarDate };
