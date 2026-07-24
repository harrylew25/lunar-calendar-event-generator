import { generateIcsCalendar, type IcsEvent } from 'ts-ics';
import { DEFAULT_CALENDAR_NAME } from '@lunar-dates/constants';
import type {
	GenerateLunarCalendarIcsOptions,
	GregorianDateParts,
	LunarDateNotification,
} from '@lunar-dates/lunar-dates.type';

const toGregorianDate = (parts: GregorianDateParts): Date => {
	const [year, month, day] = parts;
	return new Date(Date.UTC(year, month - 1, day));
};

const notificationToIcsEvent = (
	notification: LunarDateNotification,
): IcsEvent => {
	const [year, month, day] = notification.date;
	const start = toGregorianDate(notification.date);
	const end = new Date(Date.UTC(year, month - 1, day + 1));

	return {
		uid: `lunar-${notification.type}-${year}-${month}-${day}@lunar-calendar-event-generator`,
		summary: notification.summary,
		description: notification.description,
		start: { date: start, type: 'DATE' },
		end: { date: end, type: 'DATE' },
		stamp: { date: new Date() },
	};
};

const generateLunarCalendarIcs = (
	notifications: LunarDateNotification[],
	options: GenerateLunarCalendarIcsOptions = {},
): string => {
	const calendarName = options.calendarName ?? DEFAULT_CALENDAR_NAME;

	return generateIcsCalendar({
		version: '2.0',
		prodId: '-//Lunar Calendar Event Generator//EN',
		name: calendarName,
		events: notifications.map(notificationToIcsEvent),
	});
};

export { generateLunarCalendarIcs, notificationToIcsEvent };
export type { GenerateLunarCalendarIcsOptions } from '@lunar-dates/lunar-dates.type';
