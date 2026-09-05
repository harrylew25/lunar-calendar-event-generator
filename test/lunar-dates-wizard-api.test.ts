import { describe, expect, test } from 'bun:test';
import { collectCustomNotifications, resolveLunarMonthDay } from '@lunar-dates';
import type { LunarDateNotification } from '@lunar-dates/lunar-dates.type';
import { expectedLunarMonthDayFromSolar } from '@test/helpers/lunar-oracle';

describe('resolveLunarMonthDay', () => {
	test('solar 1992-02-18 resolves to lunar month 1 day 15', () => {
		expect(
			resolveLunarMonthDay({
				kind: 'solar',
				solarYear: 1992,
				solarMonth: 2,
				solarDay: 18,
				title: '正月十五',
			}),
		).toEqual(expectedLunarMonthDayFromSolar(1992, 2, 18));
	});

	test('lunar input returns month and day unchanged', () => {
		expect(
			resolveLunarMonthDay({
				kind: 'lunar',
				lunarMonth: 5,
				lunarDay: 5,
				title: '五月初五',
			}),
		).toEqual({ lunarMonth: 5, lunarDay: 5 });
	});
});

describe('collectCustomNotifications — cart-only', () => {
	test('returns only custom notifications with no chuyi or shiwu milestones', () => {
		const result = collectCustomNotifications(
			[{ kind: 'lunar', lunarMonth: 1, lunarDay: 15, title: '正月十五' }],
			{ startYear: 2020, numberOfYears: 0 },
		);

		expect(result.length).toBeGreaterThan(0);
		expect(
			result.every((n: LunarDateNotification) => n.type === 'custom'),
		).toBe(true);
		expect(
			result.some(
				(n: LunarDateNotification) => n.type === 'chuyi' || n.type === 'shiwu',
			),
		).toBe(false);
	});

	test('numberOfYears 2 produces three inclusive occurrences', () => {
		const result = collectCustomNotifications(
			[
				{
					kind: 'lunar',
					lunarMonth: 1,
					lunarDay: 15,
					title: '正月十五 reminder',
				},
			],
			{ startYear: 2020, numberOfYears: 2 },
		);

		expect(result).toHaveLength(3);
		expect(result.map((n: LunarDateNotification) => n.date)).toEqual([
			[2020, 2, 8],
			[2021, 2, 26],
			[2022, 2, 15],
		]);
	});

	test('title maps to summary on expanded notifications', () => {
		const result = collectCustomNotifications(
			[{ kind: 'lunar', lunarMonth: 1, lunarDay: 15, title: 'My Event' }],
			{ startYear: 2020, numberOfYears: 0 },
		);

		expect(result[0]).toMatchObject({
			type: 'custom',
			title: 'My Event',
			summary: 'My Event',
		});
	});
});
