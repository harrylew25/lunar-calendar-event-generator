import { describe, expect, test } from 'bun:test';
import { overridesToReminderForm, reminderFormToOverrides } from '@ics';

describe('reminderFormToOverrides', () => {
	test('stores weeks as alarmDaysBefore times 7', () => {
		expect(
			reminderFormToOverrides({
				amount: 2,
				unit: 'weeks',
				hour: 9,
				minute: 0,
			}),
		).toEqual({
			alarmDaysBefore: 14,
			alarmHour: 9,
			alarmMinute: 0,
		});
	});

	test('stores days as alarmDaysBefore including 0 for on the day', () => {
		expect(
			reminderFormToOverrides({
				amount: 0,
				unit: 'days',
				hour: 18,
				minute: 15,
			}),
		).toEqual({
			alarmDaysBefore: 0,
			alarmHour: 18,
			alarmMinute: 15,
		});
	});
});

describe('overridesToReminderForm', () => {
	test('reopens 7, 14, 21, and 28 days as weeks', () => {
		expect(overridesToReminderForm({ alarmDaysBefore: 7 })).toEqual({
			amount: 1,
			unit: 'weeks',
			hour: 9,
			minute: 0,
		});
		expect(overridesToReminderForm({ alarmDaysBefore: 14 })).toEqual({
			amount: 2,
			unit: 'weeks',
			hour: 9,
			minute: 0,
		});
		expect(overridesToReminderForm({ alarmDaysBefore: 21 })).toEqual({
			amount: 3,
			unit: 'weeks',
			hour: 9,
			minute: 0,
		});
		expect(overridesToReminderForm({ alarmDaysBefore: 28 })).toEqual({
			amount: 4,
			unit: 'weeks',
			hour: 9,
			minute: 0,
		});
	});

	test('reopens other day counts as days and keeps hour and minute', () => {
		expect(
			overridesToReminderForm({
				alarmDaysBefore: 3,
				alarmHour: 21,
				alarmMinute: 45,
			}),
		).toEqual({
			amount: 3,
			unit: 'days',
			hour: 21,
			minute: 45,
		});
	});

	test('defaults to 1 day at 09:00 when overrides are missing', () => {
		expect(overridesToReminderForm({})).toEqual({
			amount: 1,
			unit: 'days',
			hour: 9,
			minute: 0,
		});
		expect(overridesToReminderForm()).toEqual({
			amount: 1,
			unit: 'days',
			hour: 9,
			minute: 0,
		});
	});
});
