import type { IcsEventOverrides } from '@lunar-dates/lunar-dates.type';
import { ICS_EVENT_DEFAULTS } from './constants';

type ReminderUnit = 'days' | 'weeks';

type ReminderForm = {
	amount: number;
	unit: ReminderUnit;
	hour: number;
	minute: number;
};

const WEEK_DAY_COUNTS = new Set([7, 14, 21, 28]);

const reminderFormToOverrides = (
	form: ReminderForm,
): Pick<IcsEventOverrides, 'alarmDaysBefore' | 'alarmHour' | 'alarmMinute'> => {
	const alarmDaysBefore = form.unit === 'weeks' ? form.amount * 7 : form.amount;

	return {
		alarmDaysBefore,
		alarmHour: form.hour,
		alarmMinute: form.minute,
	};
};

const overridesToReminderForm = (
	overrides?: Pick<
		IcsEventOverrides,
		'alarmDaysBefore' | 'alarmHour' | 'alarmMinute'
	>,
): ReminderForm => {
	const alarmDaysBefore =
		overrides?.alarmDaysBefore ?? ICS_EVENT_DEFAULTS.alarmDaysBefore;
	const hour = overrides?.alarmHour ?? ICS_EVENT_DEFAULTS.alarmHour;
	const minute = overrides?.alarmMinute ?? ICS_EVENT_DEFAULTS.alarmMinute;

	if (WEEK_DAY_COUNTS.has(alarmDaysBefore)) {
		return {
			amount: alarmDaysBefore / 7,
			unit: 'weeks',
			hour,
			minute,
		};
	}

	return {
		amount: alarmDaysBefore,
		unit: 'days',
		hour,
		minute,
	};
};

export type { ReminderForm, ReminderUnit };
export { overridesToReminderForm, reminderFormToOverrides };
