import type { IcsEventOverrides } from '@lunar-dates/lunar-dates.type';

const DEFAULT_CALENDAR_NAME = 'Lunar 1st & 15th Milestones';

const ICS_ALARM_TIMEZONE = 'Asia/Kuala_Lumpur';

const ICS_ALARM_TZ_OFFSET = '+0800';

const ICS_EVENT_DEFAULTS = {
	alarmDaysBefore: 1,
	alarmHour: 9,
	alarmMinute: 0,
	timeTransparent: 'TRANSPARENT',
	visibility: 'PUBLIC',
} as const;

const ICS_KEYS = [
	'location',
	'alarmDaysBefore',
	'alarmHour',
	'alarmMinute',
	'timeTransparent',
	'visibility',
] as const satisfies readonly (keyof IcsEventOverrides)[];

export {
	DEFAULT_CALENDAR_NAME,
	ICS_ALARM_TIMEZONE,
	ICS_ALARM_TZ_OFFSET,
	ICS_EVENT_DEFAULTS,
	ICS_KEYS,
};
