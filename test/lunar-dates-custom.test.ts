import { describe, expect, test } from 'bun:test';
import { getLunarDateNotifications } from '@lunar-dates';
import type {
	CustomDateInput,
	GregorianDateParts,
	LunarCustomDateInput,
	SolarCustomDateInput,
} from '@lunar-dates/lunar-dates.type';
import { expectedChuyiSolarParts } from '@test/helpers/lunar-oracle';

type SolarAnchor = Pick<
	SolarCustomDateInput,
	'solarYear' | 'solarMonth' | 'solarDay'
>;

type LunarMonthDay = Pick<LunarCustomDateInput, 'lunarMonth' | 'lunarDay'>;

const buildSolarCustomDate = (
	anchor: SolarAnchor,
	title: string,
	description?: string,
): CustomDateInput => ({
	kind: 'solar',
	...anchor,
	title,
	description,
});

const buildLunarCustomDate = (
	monthDay: LunarMonthDay,
	title: string,
): CustomDateInput => ({
	kind: 'lunar',
	...monthDay,
	title,
});

describe('getLunarDateNotifications — custom dates', () => {
	test('solar 1992-02-18 produces one custom notification for startYear', () => {
		const notifications = getLunarDateNotifications({
			startYear: 2020,
			startMonth: 1,
			numberOfYears: 0,
			customDates: [
				buildSolarCustomDate(
					{ solarYear: 1992, solarMonth: 2, solarDay: 18 },
					'正月十五 reminder',
					'From solar anchor 1992-02-18',
				),
			],
		});

		const custom = notifications.filter((n) => n.type === 'custom');
		expect(custom).toHaveLength(1);
		expect(custom[0]).toMatchObject({
			type: 'custom',
			title: '正月十五 reminder',
			summary: '正月十五 reminder',
			description: 'From solar anchor 1992-02-18',
			date: [2020, 2, 8],
		});
	});

	test('lunar 正月十五 repeats once per lunar year in range', () => {
		const notifications = getLunarDateNotifications({
			startYear: 2020,
			startMonth: 1,
			numberOfYears: 2,
			customDates: [
				buildLunarCustomDate(
					{ lunarMonth: 1, lunarDay: 15 },
					'正月十五 reminder',
				),
			],
		});

		const custom = notifications.filter((n) => n.type === 'custom');
		expect(custom).toHaveLength(3);
		expect(custom.map((n) => n.date)).toEqual([
			[2020, 2, 8],
			[2021, 2, 26],
			[2022, 2, 15],
		]);
	});

	test.each([
		{
			label: '正月十五',
			solar: { solarYear: 1992, solarMonth: 2, solarDay: 18 },
			lunar: { lunarMonth: 1, lunarDay: 15 },
		},
		{
			label: '五月初五',
			solar: { solarYear: 1992, solarMonth: 6, solarDay: 5 },
			lunar: { lunarMonth: 5, lunarDay: 5 },
		},
		{
			label: '九月初九',
			solar: { solarYear: 1992, solarMonth: 10, solarDay: 4 },
			lunar: { lunarMonth: 9, lunarDay: 9 },
		},
	])('$label — solar and lunar produce identical dates', ({ solar, lunar }) => {
		const base = { startYear: 2020, startMonth: 1, numberOfYears: 2 };
		const fromSolar = getLunarDateNotifications({
			...base,
			customDates: [buildSolarCustomDate(solar, 'A')],
		});
		const fromLunar = getLunarDateNotifications({
			...base,
			customDates: [buildLunarCustomDate(lunar, 'A')],
		});

		const solarDates = fromSolar
			.filter((n) => n.type === 'custom')
			.map((n) => n.date);
		const lunarDates = fromLunar
			.filter((n) => n.type === 'custom')
			.map((n) => n.date);
		expect(solarDates).toEqual(lunarDates);
	});

	test.each([
		{
			label: '五月初五',
			lunar: { lunarMonth: 5, lunarDay: 5 },
			expectedDates: [
				[2020, 6, 25],
				[2021, 6, 14],
				[2022, 6, 3],
			] satisfies GregorianDateParts[],
		},
		{
			label: '九月初九',
			lunar: { lunarMonth: 9, lunarDay: 9 },
			expectedDates: [
				[2020, 10, 25],
				[2021, 10, 14],
				[2022, 10, 4],
			] satisfies GregorianDateParts[],
		},
	])('$label repeats once per lunar year', ({ lunar, expectedDates }) => {
		const notifications = getLunarDateNotifications({
			startYear: 2020,
			startMonth: 1,
			numberOfYears: 2,
			customDates: [
				buildLunarCustomDate(lunar, `${lunar.lunarMonth} reminder`),
			],
		});

		const custom = notifications.filter((n) => n.type === 'custom');
		expect(custom).toHaveLength(expectedDates.length);
		expect(custom.map((n) => n.date)).toEqual(expectedDates);
	});

	test('custom event coexists with auto chuyi on same Gregorian day', () => {
		const chuyiDate = expectedChuyiSolarParts(2020, 4);
		const notifications = getLunarDateNotifications({
			startYear: 2020,
			startMonth: 1,
			numberOfYears: 0,
			customDates: [
				buildLunarCustomDate({ lunarMonth: 4, lunarDay: 1 }, 'Extra reminder'),
			],
		});

		const onSameDay = notifications.filter(
			(n) =>
				n.date[0] === chuyiDate[0] &&
				n.date[1] === chuyiDate[1] &&
				n.date[2] === chuyiDate[2],
		);
		expect(onSameDay.some((n) => n.type === 'chuyi')).toBe(true);
		expect(onSameDay.some((n) => n.type === 'custom')).toBe(true);
	});

	test.each([
		{ lunarMonth: 2, expectedDate: [2026, 4, 16] },
		{ lunarMonth: 4, expectedDate: [2026, 6, 14] },
		{ lunarMonth: 5, expectedDate: [2026, 7, 13] },
		{ lunarMonth: 7, expectedDate: [2026, 9, 10] },
		{ lunarMonth: 8, expectedDate: [2026, 10, 9] },
		{ lunarMonth: 12, expectedDate: [2027, 2, 5] },
	] satisfies {
		lunarMonth: number;
		expectedDate: GregorianDateParts;
	}[])('clamps day 30 to 29 for lunar 2026 month $lunarMonth', ({
		lunarMonth,
		expectedDate,
	}) => {
		const custom = getLunarDateNotifications({
			startYear: 2026,
			startMonth: 1,
			numberOfYears: 0,
			customDates: [buildLunarCustomDate({ lunarMonth, lunarDay: 30 }, '三十')],
		}).filter((n) => n.type === 'custom');

		expect(custom).toHaveLength(1);
		expect(custom[0]?.date).toEqual(expectedDate);
	});
});
