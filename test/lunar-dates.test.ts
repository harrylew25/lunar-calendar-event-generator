import { describe, expect, test } from 'bun:test';
import {
	getFirstAndFifteenDay,
	getLunarDateNotifications,
	type LunarDateNotification,
	resolveLunarStartFromSolarMonth,
} from '@lunar-dates';
import {
	daysBetweenSolarParts,
	expectedChuyiSolarParts,
	expectedLunarStartFromSolarMonth,
} from '@test/helpers/lunar-oracle';
import { LunarYear, Solar } from 'lunar-javascript';

describe('resolveLunarStartFromSolarMonth', () => {
	test('converts mid-year solar month using day 1 anchor', () => {
		const expected = expectedLunarStartFromSolarMonth(2020, 6);
		expect(resolveLunarStartFromSolarMonth(2020, 6)).toEqual(expected);
	});

	test('handles solar january that maps to prior lunar year', () => {
		const expected = expectedLunarStartFromSolarMonth(2026, 1);
		const result = resolveLunarStartFromSolarMonth(2026, 1);
		expect(result).toEqual(expected);
		expect(result.startYear).not.toBe(2026);
	});

	test('throws when solar month is out of range', () => {
		expect(() => resolveLunarStartFromSolarMonth(2020, 0)).toThrow(
			'Solar month must be between 1 and 12',
		);
		expect(() => resolveLunarStartFromSolarMonth(2020, 13)).toThrow(
			'Solar month must be between 1 and 12',
		);
	});
});

describe('getLunarDateNotifications — solar input', () => {
	test('first event is chuyi for resolved lunar month', () => {
		const notifications = getLunarDateNotifications({
			startSolarYear: 2020,
			startSolarMonth: 6,
			numberOfYears: 0,
		});

		expect(notifications[0]?.type).toBe('chuyi');
		expect(notifications[0]?.summary).toContain('初一');
	});

	test('first chuyi date matches library oracle', () => {
		const { startYear, startMonth } = expectedLunarStartFromSolarMonth(2020, 6);
		const notifications = getLunarDateNotifications({
			startSolarYear: 2020,
			startSolarMonth: 6,
			numberOfYears: 0,
		});

		expect(notifications[0]?.date).toEqual(
			expectedChuyiSolarParts(startYear, startMonth),
		);
	});

	test('solar input matches equivalent lunar input output', () => {
		const lunarStart = expectedLunarStartFromSolarMonth(2020, 6);
		const fromSolar = getLunarDateNotifications({
			startSolarYear: 2020,
			startSolarMonth: 6,
			numberOfYears: 0,
		});
		const fromLunar = getLunarDateNotifications({
			startYear: lunarStart.startYear,
			startMonth: lunarStart.startMonth,
			numberOfYears: 0,
		});

		expect(fromSolar).toEqual(fromLunar);
	});
});

describe('getLunarDateNotifications — orchestration', () => {
	test('numberOfYears 0 returns two events per lunar month in that year', () => {
		const notifications = getLunarDateNotifications({
			startYear: 2020,
			startMonth: 1,
			numberOfYears: 0,
		});
		const monthCount = LunarYear.fromYear(2020).getMonthsInYear().length;

		expect(notifications.length).toBe(monthCount * 2);
	});

	test('startMonth skips earlier months in the first year', () => {
		const notifications = getLunarDateNotifications({
			startYear: 2020,
			startMonth: 4,
			numberOfYears: 0,
		});

		expect(notifications[0]?.summary).toContain('农历四月初一');
	});

	test('includes leap month events for 2020 when starting from month 1', () => {
		const notifications = getLunarDateNotifications({
			startYear: 2020,
			startMonth: 1,
			numberOfYears: 0,
		});

		expect(
			notifications.some((notification) =>
				notification.summary.includes('闰四月'),
			),
		).toBe(true);
	});

	test('each shiwu date is 14 days after its chuyi pair', () => {
		const notifications = getLunarDateNotifications({
			startYear: 2020,
			startMonth: 1,
			numberOfYears: 0,
		});

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
});

describe('getFirstAndFifteenDay', () => {
	test('returns chuyi and shiwu solar parts from lunar month', () => {
		const [chuyi, shiwu] = getFirstAndFifteenDay(2020, 4)!;
		expect(chuyi).toEqual(expectedChuyiSolarParts(2020, 4));
		expect(daysBetweenSolarParts(chuyi, shiwu)).toBe(14);
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
		const notifications = getLunarDateNotifications({
			startYear: 2020,
			startMonth: 4,
			numberOfYears: 0,
		});

		for (const notification of notifications) {
			expect(isLunarDateNotification(notification)).toBe(true);
		}
	});

	test('titles reflect chuyi and shiwu day labels', () => {
		const notifications = getLunarDateNotifications({
			startYear: 2020,
			startMonth: 4,
			numberOfYears: 0,
		});

		expect(notifications[0]?.title).toContain('Day 1');
		expect(notifications[1]?.title).toContain('Day 15');
	});
});

describe('lunar-javascript smoke', () => {
	test('library reference date from README', () => {
		expect(Solar.fromYmd(1986, 5, 29).getLunar().getDayInChinese()).toBe(
			'廿一',
		);
	});
});
