import { describe, expect, test } from 'bun:test';
import { notificationToIcsEvent } from '@ics';
import type {
	GregorianDateParts,
	LunarDateNotification,
} from '@lunar-dates/lunar-dates.type';
import { subtractCalendarDays } from '@test/helpers/ics-oracle';
import { generateIcsEvent } from 'ts-ics';

const padYmd = ([year, month, day]: GregorianDateParts): string => {
	return `${year}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}`;
};

const chuyiNotification = (
	date: LunarDateNotification['date'],
): LunarDateNotification => {
	return {
		date,
		type: 'chuyi',
		summary: '农历四月初一 (4th Month Day 1)',
		description: 'Lunar Calendar: 4th Month, Day 1 (New Moon)',
		title: '4th Month Day 1',
	};
};

describe('notificationToIcsEvent — ICS field overrides', () => {
	test('sets OPAQUE and PRIVATE from busy and visibility overrides', () => {
		const notification: LunarDateNotification = {
			...chuyiNotification([2020, 4, 23]),
			icsOverrides: {
				timeTransparent: 'OPAQUE',
				visibility: 'PRIVATE',
			},
		};
		const icsEventString = generateIcsEvent(
			notificationToIcsEvent(notification),
		);

		expect(icsEventString).toContain('TRANSP:OPAQUE');
		expect(icsEventString).toContain('CLASS:PRIVATE');
		expect(icsEventString).not.toContain('TRANSP:TRANSPARENT');
		expect(icsEventString).not.toContain('CLASS:PUBLIC');
	});

	test('omits LOCATION when the override location is empty', () => {
		const notification: LunarDateNotification = {
			...chuyiNotification([2020, 4, 23]),
			icsOverrides: {
				location: '',
			},
		};
		const icsEventString = generateIcsEvent(
			notificationToIcsEvent(notification),
		);

		expect(icsEventString).not.toContain('LOCATION:');
	});

	test('uses a 14-day alarm trigger for a 2-week reminder', () => {
		const eventDate: GregorianDateParts = [2020, 10, 1];
		const notification: LunarDateNotification = {
			date: eventDate,
			type: 'custom',
			title: 'Temple visit',
			summary: 'Temple visit',
			description: '',
			icsOverrides: {
				alarmDaysBefore: 14,
			},
		};
		const icsEventString = generateIcsEvent(
			notificationToIcsEvent(notification),
		);
		const alarmDate = subtractCalendarDays(eventDate, 14);

		expect(icsEventString).toContain(`TRIGGER:${padYmd(alarmDate)}T010000Z`);
	});
});
