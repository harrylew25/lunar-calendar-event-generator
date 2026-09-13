import { describe, expect, test } from 'bun:test';
import { expandMonthlyEvents, type LunarDateNotification } from '@lunar-dates';
import {
	daysBetweenSolarParts,
	expectedChuyiSolarParts,
} from '@test/helpers/lunar-oracle';
import { LunarYear, Solar } from 'lunar-javascript';

const BOTH_FLAGS = { chuyi: true, shiwu: true } as const;
const CHUYI_ONLY = { chuyi: true, shiwu: false } as const;
const SHIWU_ONLY = { chuyi: false, shiwu: true } as const;
const NEITHER_FLAG = { chuyi: false, shiwu: false } as const;

describe('expandMonthlyEvents — flags', () => {
	test('returns empty when both flags are off', () => {
		expect(
			expandMonthlyEvents({ startYear: 2020, numberOfYears: 0 }, NEITHER_FLAG),
		).toEqual([]);
	});

	test('chuyi only emits type chuyi with 初一 summaries', () => {
		const notifications = expandMonthlyEvents(
			{ startYear: 2020, numberOfYears: 0 },
			CHUYI_ONLY,
		);
		const monthCount = LunarYear.fromYear(2020).getMonthsInYear().length;

		expect(notifications).toHaveLength(monthCount);
		expect(notifications.every((n) => n.type === 'chuyi')).toBe(true);
		expect(notifications.every((n) => n.summary.includes('初一'))).toBe(true);
		expect(notifications[0]?.title).toContain('Day 1');
	});

	test('shiwu only emits type shiwu with 十五 summaries', () => {
		const notifications = expandMonthlyEvents(
			{ startYear: 2020, numberOfYears: 0 },
			SHIWU_ONLY,
		);
		const monthCount = LunarYear.fromYear(2020).getMonthsInYear().length;

		expect(notifications).toHaveLength(monthCount);
		expect(notifications.every((n) => n.type === 'shiwu')).toBe(true);
		expect(notifications.every((n) => n.summary.includes('十五'))).toBe(true);
		expect(notifications[0]?.title).toContain('Day 15');
	});

	test('both flags emit two events per lunar month including leap 闰四月', () => {
		const notifications = expandMonthlyEvents(
			{ startYear: 2020, numberOfYears: 0 },
			BOTH_FLAGS,
		);
		const monthCount = LunarYear.fromYear(2020).getMonthsInYear().length;

		expect(notifications).toHaveLength(monthCount * 2);
		expect(
			notifications.some((notification) =>
				notification.summary.includes('闰四月'),
			),
		).toBe(true);
	});
});

describe('expandMonthlyEvents — years and pairs', () => {
	test('numberOfYears 2 is inclusive of three lunar years', () => {
		const oneYear = expandMonthlyEvents(
			{ startYear: 2020, numberOfYears: 0 },
			CHUYI_ONLY,
		);
		const threeYears = expandMonthlyEvents(
			{ startYear: 2020, numberOfYears: 2 },
			CHUYI_ONLY,
		);

		expect(threeYears.length).toBeGreaterThan(oneYear.length);
		expect(threeYears.length).toBe(
			LunarYear.fromYear(2020).getMonthsInYear().length +
				LunarYear.fromYear(2021).getMonthsInYear().length +
				LunarYear.fromYear(2022).getMonthsInYear().length,
		);
	});

	test('each shiwu date is 14 days after its chuyi pair', () => {
		const notifications = expandMonthlyEvents(
			{ startYear: 2020, numberOfYears: 0 },
			BOTH_FLAGS,
		);

		for (let i = 0; i < notifications.length; i += 2) {
			const chuyi = notifications[i];
			const shiwu = notifications[i + 1];
			if (!chuyi || !shiwu) {
				throw new Error('Expected chuyi/shiwu notification pair');
			}
			expect(chuyi.type).toBe('chuyi');
			expect(shiwu.type).toBe('shiwu');
			expect(daysBetweenSolarParts(chuyi.date, shiwu.date)).toBe(14);
		}
	});

	test('四月初一 matches library oracle', () => {
		const notifications = expandMonthlyEvents(
			{ startYear: 2020, numberOfYears: 0 },
			CHUYI_ONLY,
		);
		const april = expectedChuyiSolarParts(2020, 4);

		expect(
			notifications.some((n) => n.date.join('-') === april.join('-')),
		).toBe(true);
	});
});

describe('notification contract', () => {
	const isLunarDateNotification = (value: LunarDateNotification): boolean => {
		return (
			Array.isArray(value.date) &&
			value.date.length === 3 &&
			(value.type === 'chuyi' ||
				value.type === 'shiwu' ||
				value.type === 'custom') &&
			typeof value.title === 'string' &&
			typeof value.summary === 'string' &&
			typeof value.description === 'string'
		);
	};

	test('notifications include required fields with correct types', () => {
		const notifications = expandMonthlyEvents(
			{ startYear: 2020, numberOfYears: 0 },
			BOTH_FLAGS,
		);

		for (const notification of notifications) {
			expect(isLunarDateNotification(notification)).toBe(true);
		}
	});
});

describe('lunar-javascript smoke', () => {
	test('library reference date from README', () => {
		expect(Solar.fromYmd(1986, 5, 29).getLunar().getDayInChinese()).toBe(
			'廿一',
		);
	});
});
