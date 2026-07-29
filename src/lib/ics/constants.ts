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

export {
	DEFAULT_CALENDAR_NAME,
	ICS_ALARM_TIMEZONE,
	ICS_ALARM_TZ_OFFSET,
	ICS_EVENT_DEFAULTS,
};
