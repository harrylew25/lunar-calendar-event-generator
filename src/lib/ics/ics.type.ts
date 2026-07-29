import type {
	IcsEventVisibility,
	IcsTimeTransparent,
} from '@lunar-dates/lunar-dates.type';

type GenerateLunarCalendarIcsOptions = {
	calendarName?: string;
};

type ResolvedIcsEventOptions = {
	location?: string;
	alarmDaysBefore: number;
	alarmHour: number;
	alarmMinute: number;
	timeTransparent: IcsTimeTransparent;
	visibility: IcsEventVisibility;
};

export type { GenerateLunarCalendarIcsOptions, ResolvedIcsEventOptions };
