import type {
	GregorianDateParts,
	IcsEventOverrides,
	LunarDateNotification,
} from '@lunar-dates/lunar-dates.type';
import { generateIcsCalendar, type IcsAlarm, type IcsEvent } from 'ts-ics';
import {
	DEFAULT_CALENDAR_NAME,
	ICS_ALARM_TIMEZONE,
	ICS_ALARM_TZ_OFFSET,
	ICS_EVENT_DEFAULTS,
} from './constants';
import type {
	GenerateLunarCalendarIcsOptions,
	ResolvedIcsEventOptions,
} from './ics.type';

const toGregorianDate = (parts: GregorianDateParts): Date => {
	const [year, month, day] = parts;
	return new Date(Date.UTC(year, month - 1, day));
};

const subtractCalendarDays = (
	parts: GregorianDateParts,
	days: number,
): GregorianDateParts => {
	const date = toGregorianDate(parts);
	date.setUTCDate(date.getUTCDate() - days);
	return [date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate()];
};

const resolveIcsEventOptions = (
	overrides?: IcsEventOverrides,
): ResolvedIcsEventOptions => {
	return {
		location: overrides?.location,
		alarmDaysBefore:
			overrides?.alarmDaysBefore ?? ICS_EVENT_DEFAULTS.alarmDaysBefore,
		alarmHour: overrides?.alarmHour ?? ICS_EVENT_DEFAULTS.alarmHour,
		alarmMinute: overrides?.alarmMinute ?? ICS_EVENT_DEFAULTS.alarmMinute,
		timeTransparent:
			overrides?.timeTransparent ?? ICS_EVENT_DEFAULTS.timeTransparent,
		visibility: overrides?.visibility ?? ICS_EVENT_DEFAULTS.visibility,
	};
};

const alarmDateTimeUtc = (
	alarmDate: GregorianDateParts,
	hour: number,
	minute: number,
): Date => {
	const utcHour = hour - 8;
	return new Date(
		Date.UTC(alarmDate[0], alarmDate[1] - 1, alarmDate[2], utcHour, minute, 0),
	);
};

const buildDefaultAlarm = (
	eventDate: GregorianDateParts,
	options: ResolvedIcsEventOptions,
): IcsAlarm => {
	const alarmDate = subtractCalendarDays(eventDate, options.alarmDaysBefore);
	const triggerDate = alarmDateTimeUtc(
		alarmDate,
		options.alarmHour,
		options.alarmMinute,
	);

	return {
		action: 'DISPLAY',
		trigger: {
			type: 'absolute',
			value: {
				date: triggerDate,
				type: 'DATE-TIME',
				local: {
					date: triggerDate,
					timezone: ICS_ALARM_TIMEZONE,
					tzoffset: ICS_ALARM_TZ_OFFSET,
				},
			},
		},
	};
};

const slugifyTitle = (title: string): string => {
	return title
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');
};

const buildEventUid = (notification: LunarDateNotification): string => {
	const [year, month, day] = notification.date;

	if (notification.type === 'custom') {
		const titleSlug = slugifyTitle(notification.title);
		return `lunar-custom-${titleSlug}-${year}-${month}-${day}@lunar-calendar-event-generator`;
	}

	return `lunar-${notification.type}-${year}-${month}-${day}@lunar-calendar-event-generator`;
};

const notificationToIcsEvent = (
	notification: LunarDateNotification,
): IcsEvent => {
	const [year, month, day] = notification.date;
	const start = toGregorianDate(notification.date);
	const end = new Date(Date.UTC(year, month - 1, day + 1));
	const options = resolveIcsEventOptions(notification.icsOverrides);

	return {
		uid: buildEventUid(notification),
		summary: notification.summary,
		description: notification.description,
		start: { date: start, type: 'DATE' },
		end: { date: end, type: 'DATE' },
		stamp: { date: new Date() },
		timeTransparent: options.timeTransparent,
		class: options.visibility,
		alarms: [buildDefaultAlarm(notification.date, options)],
		...(options.location ? { location: options.location } : {}),
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

export {
	generateLunarCalendarIcs,
	notificationToIcsEvent,
	resolveIcsEventOptions,
};
