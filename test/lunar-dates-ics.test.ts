import { describe, expect, test } from 'bun:test';
import {
	generateLunarCalendarIcs,
	notificationToIcsEvent,
} from '@lib/ics/index';
import { getLunarDateNotifications } from '@lunar-dates/index';
import type {
	GregorianDateParts,
	LunarDateNotification,
} from '@lunar-dates/lunar-dates.type';
import { generateIcsEvent } from 'ts-ics';
import { subtractCalendarDays } from './helpers/ics-oracle';
import { expectedChuyiSolarParts } from './helpers/lunar-oracle';

const padYmd = ([year, month, day]: GregorianDateParts): string => {
	return `${year}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}`;
};

const nextGregorianDay = ([
	year,
	month,
	day,
]: GregorianDateParts): GregorianDateParts => {
	const next = new Date(Date.UTC(year, month - 1, day + 1));
	return [next.getUTCFullYear(), next.getUTCMonth() + 1, next.getUTCDate()];
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

describe('notificationToIcsEvent — Gregorian DTSTART', () => {
	test('maps notification.date to all-day DTSTART from oracle Gregorian date', () => {
		const oracleDate = expectedChuyiSolarParts(2020, 4);
		const notification = chuyiNotification(oracleDate);
		const event = notificationToIcsEvent(notification);
		const icsEventString = generateIcsEvent(event);

		expect(icsEventString).toContain(
			`DTSTART;VALUE=DATE:${padYmd(oracleDate)}`,
		);
		expect(icsEventString).not.toContain('T000000');
	});
});

describe('notificationToIcsEvent — exclusive end date', () => {
	test('sets DTEND to the day after DTSTART for all-day events', () => {
		const oracleDate = expectedChuyiSolarParts(2020, 4);
		const notification = chuyiNotification(oracleDate);
		const event = notificationToIcsEvent(notification);
		const icsEventString = generateIcsEvent(event);
		const paddedEndDate = padYmd(nextGregorianDay(oracleDate));

		expect(icsEventString).toContain(`DTEND;VALUE=DATE:${paddedEndDate}`);
	});
});

describe('notificationToIcsEvent — all-day DATE timezone', () => {
	test('keeps calendar day as UTC midnight DATE values', () => {
		const date: GregorianDateParts = [2026, 5, 17];
		const notification = chuyiNotification(date);
		const event = notificationToIcsEvent(notification);
		const icsEventString = generateIcsEvent(event);

		expect(event.end).toBeDefined();
		if (!event.end) {
			return;
		}

		expect(event.start.date.toISOString()).toBe('2026-05-17T00:00:00.000Z');
		expect(event.end.date.toISOString()).toBe('2026-05-18T00:00:00.000Z');
		expect(icsEventString).toContain('DTSTART;VALUE=DATE:20260517');
		expect(icsEventString).toContain('DTEND;VALUE=DATE:20260518');
		expect(icsEventString).not.toContain('T000000');
	});
});

describe('notificationToIcsEvent — deterministic UID', () => {
	test('derives stable uid from type and Gregorian date parts', () => {
		const notification = chuyiNotification([2020, 4, 23]);
		const first = notificationToIcsEvent(notification);
		const second = notificationToIcsEvent(notification);

		expect(first.uid).toBe(
			'lunar-chuyi-2020-4-23@lunar-calendar-event-generator',
		);
		expect(second.uid).toBe(first.uid);
	});

	test('two custom events on same day with different titles get distinct UIDs', () => {
		const date: LunarDateNotification['date'] = [2020, 10, 1];
		const notifications: LunarDateNotification[] = [
			{
				date,
				type: 'custom',
				title: 'Event Alpha',
				summary: 'Event Alpha',
				description: '',
			},
			{
				date,
				type: 'custom',
				title: 'Event Beta',
				summary: 'Event Beta',
				description: '',
			},
		];
		const uids = notifications.map(
			(notification) => notificationToIcsEvent(notification).uid,
		);

		expect(new Set(uids).size).toBe(2);
	});
});

describe('notificationToIcsEvent — default event attributes', () => {
	test('includes VALARM one day before at 9:00 AM Kuala Lumpur', () => {
		const eventDate: GregorianDateParts = [2020, 4, 23];
		const notification = chuyiNotification(eventDate);
		const icsEventString = generateIcsEvent(
			notificationToIcsEvent(notification),
		);
		const alarmDate = subtractCalendarDays(eventDate, 1);

		expect(icsEventString).toContain('BEGIN:VALARM');
		expect(icsEventString).toContain('ACTION:DISPLAY');
		expect(icsEventString).toContain(`TRIGGER:${padYmd(alarmDate)}T010000Z`);
	});

	test('sets TRANSPARENT and PUBLIC by default', () => {
		const notification = chuyiNotification([2020, 4, 23]);
		const icsEventString = generateIcsEvent(
			notificationToIcsEvent(notification),
		);

		expect(icsEventString).toContain('TRANSP:TRANSPARENT');
		expect(icsEventString).toContain('CLASS:PUBLIC');
	});

	test('omits RRULE and LOCATION by default', () => {
		const notification = chuyiNotification([2020, 4, 23]);
		const icsEventString = generateIcsEvent(
			notificationToIcsEvent(notification),
		);

		expect(icsEventString).not.toContain('RRULE:');
		expect(icsEventString).not.toContain('LOCATION:');
	});

	test('applies custom location and alarmDaysBefore overrides', () => {
		const eventDate: GregorianDateParts = [2020, 10, 1];
		const notification: LunarDateNotification = {
			date: eventDate,
			type: 'custom',
			title: 'Temple visit',
			summary: 'Temple visit',
			description: '',
			icsOverrides: {
				location: 'Temple',
				alarmDaysBefore: 2,
			},
		};
		const icsEventString = generateIcsEvent(
			notificationToIcsEvent(notification),
		);
		const alarmDate = subtractCalendarDays(eventDate, 2);

		expect(icsEventString).toContain('LOCATION:Temple');
		expect(icsEventString).toContain(`TRIGGER:${padYmd(alarmDate)}T010000Z`);
	});
});

describe('generateLunarCalendarIcs', () => {
	test('wraps events in a VCALENDAR with metadata', () => {
		const notification = chuyiNotification([2020, 4, 23]);
		const ics = generateLunarCalendarIcs([notification]);

		expect(ics).toContain('BEGIN:VCALENDAR');
		expect(ics).toContain('VERSION:2.0');
		expect(ics).toContain('PRODID:-//Lunar Calendar Event Generator//EN');
		expect(ics).toContain('X-WR-CALNAME:Lunar 1st & 15th Milestones');
		expect(ics).toContain('BEGIN:VEVENT');
		expect(ics).toContain('END:VCALENDAR');
	});

	test('uses a custom calendar name when provided', () => {
		const notification = chuyiNotification([2020, 4, 23]);
		const ics = generateLunarCalendarIcs([notification], {
			calendarName: 'My Lunar Rituals',
		});

		expect(ics).toContain('X-WR-CALNAME:My Lunar Rituals');
		expect(ics).not.toContain('X-WR-CALNAME:Lunar 1st & 15th Milestones');
	});
});

describe('generateLunarCalendarIcs — integration', () => {
	test('preserves Gregorian dates from getLunarDateNotifications', () => {
		const notifications = getLunarDateNotifications({
			startYear: 2020,
			startMonth: 4,
			numberOfYears: 0,
		});
		const ics = generateLunarCalendarIcs(notifications);
		const expectedChuyi = expectedChuyiSolarParts(2020, 4);

		expect(ics).toContain(`DTSTART;VALUE=DATE:${padYmd(expectedChuyi)}`);
		expect((ics.match(/BEGIN:VEVENT/g) ?? []).length).toBe(
			notifications.length,
		);
	});

	test('preserves chuyi DATE start and exclusive end end-to-end', () => {
		const notifications = getLunarDateNotifications({
			startYear: 2020,
			startMonth: 4,
			numberOfYears: 0,
		});
		const chuyi = notifications.find((notification) => {
			return notification.type === 'chuyi';
		});

		expect(chuyi).toBeDefined();
		if (!chuyi) {
			return;
		}

		const ics = generateLunarCalendarIcs(notifications);
		const startYmd = padYmd(chuyi.date);
		const endYmd = padYmd(nextGregorianDay(chuyi.date));

		expect(ics).toContain(`DTSTART;VALUE=DATE:${startYmd}`);
		expect(ics).toContain(`DTEND;VALUE=DATE:${endYmd}`);
	});

	test('includes VALARM on auto and custom events end-to-end', () => {
		const notifications = getLunarDateNotifications({
			startYear: 2020,
			startMonth: 4,
			numberOfYears: 0,
			customDates: [
				{
					kind: 'lunar',
					lunarMonth: 1,
					lunarDay: 15,
					title: '正月十五',
				},
			],
		});
		const ics = generateLunarCalendarIcs(notifications);
		const alarmCount = (ics.match(/BEGIN:VALARM/g) ?? []).length;

		expect(alarmCount).toBe(notifications.length);
	});
});
