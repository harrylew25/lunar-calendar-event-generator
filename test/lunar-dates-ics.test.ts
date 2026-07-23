import { describe, expect, test } from 'bun:test';
import { generateIcsEvent } from 'ts-ics';
import type { LunarDateNotification } from '@lunar-dates/lunar-dates.type';
import { getLunarDateNotifications } from '@lunar-dates/lunar-dates';
import { notificationToIcsEvent, generateLunarCalendarIcs } from '@lib/lunar-dates-ics';
import { expectedChuyiSolarParts } from './helpers/lunar-oracle';

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
		const [year, month, day] = oracleDate;
		const paddedDate = `${year}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}`;

		expect(icsEventString).toContain(`DTSTART;VALUE=DATE:${paddedDate}`);
		expect(icsEventString).not.toContain('T000000');
	});
});

describe('notificationToIcsEvent — exclusive end date', () => {
	test('sets DTEND to the day after DTSTART for all-day events', () => {
		const oracleDate = expectedChuyiSolarParts(2020, 4);
		const notification = chuyiNotification(oracleDate);
		const event = notificationToIcsEvent(notification);
		const icsEventString = generateIcsEvent(event);
		const [year, month, day] = oracleDate;
		const nextDay = new Date(year, month - 1, day + 1);
		const paddedEndDate = `${nextDay.getFullYear()}${String(nextDay.getMonth() + 1).padStart(2, '0')}${String(nextDay.getDate()).padStart(2, '0')}`;

		expect(icsEventString).toContain(`DTEND;VALUE=DATE:${paddedEndDate}`);
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
		const [year, month, day] = expectedChuyi;
		const paddedDate = `${year}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}`;

		expect(ics).toContain(`DTSTART;VALUE=DATE:${paddedDate}`);
		expect((ics.match(/BEGIN:VEVENT/g) ?? []).length).toBe(
			notifications.length,
		);
	});
});
