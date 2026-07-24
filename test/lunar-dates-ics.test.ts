import { generateLunarCalendarIcs, notificationToIcsEvent } from '@lib/lunar-dates-ics';
import { getLunarDateNotifications } from '@lunar-dates/lunar-dates';
import type {
	GregorianDateParts,
	LunarDateNotification,
} from '@lunar-dates/lunar-dates.type';
import { describe, expect, test } from 'bun:test';
import { generateIcsEvent } from 'ts-ics';
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

		expect(icsEventString).toContain(`DTSTART;VALUE=DATE:${padYmd(oracleDate)}`);
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
});
