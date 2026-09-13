import { describe, expect, test } from 'bun:test';
import { notificationsFromCart } from '@lunar-dates';
import { FESTIVALS } from '@lunar-dates/constants';
import type { CartRule } from '@lunar-dates/lunar-dates.type';

const THREE_YEARS = { startYear: 2020, numberOfYears: 2 } as const;
const YEAR_RANGE = { startYear: 2020, numberOfYears: 0 } as const;

const yuanxiao = FESTIVALS.find((festival) => festival.id === 'yuanxiao');
const duanwu = FESTIVALS.find((festival) => festival.id === 'duanwu');
const chuxi = FESTIVALS.find((festival) => festival.id === 'chuxi');

if (!yuanxiao || !duanwu || !chuxi) {
	throw new Error(
		'Expected festival catalog to include yuanxiao, duanwu, chuxi',
	);
}

describe('notificationsFromCart', () => {
	test('custom-only cart expands 正月十五 once per inclusive year', () => {
		const cart: CartRule[] = [
			{
				kind: 'custom',
				lunarMonth: 1,
				lunarDay: 15,
				title: '正月十五 reminder',
			},
		];
		const result = notificationsFromCart(cart, THREE_YEARS);

		expect(result).toHaveLength(3);
		expect(result.every((n) => n.type === 'custom')).toBe(true);
		expect(result.map((n) => n.date)).toEqual([
			[2020, 2, 8],
			[2021, 2, 26],
			[2022, 2, 15],
		]);
	});

	test('端午 catalog item expands once per year with no chuyi or shiwu', () => {
		const cart: CartRule[] = [{ kind: 'catalog', catalogId: duanwu.id }];
		const oneYear = notificationsFromCart(cart, YEAR_RANGE);
		const threeYears = notificationsFromCart(cart, THREE_YEARS);

		expect(oneYear).toHaveLength(1);
		expect(oneYear[0]).toMatchObject({
			type: 'custom',
			title: '端午节',
			date: [2020, 6, 25],
		});
		expect(threeYears.map((n) => n.date)).toEqual([
			[2020, 6, 25],
			[2021, 6, 14],
			[2022, 6, 3],
		]);
		expect(
			threeYears.some((n) => n.type === 'chuyi' || n.type === 'shiwu'),
		).toBe(false);
	});

	test('除夕 catalog item clamps day 30 on 29-day 腊月 2026', () => {
		const cart: CartRule[] = [{ kind: 'catalog', catalogId: chuxi.id }];
		const result = notificationsFromCart(cart, {
			startYear: 2026,
			numberOfYears: 0,
		});

		expect(result).toHaveLength(1);
		expect(result[0]?.date).toEqual([2027, 2, 5]);
		expect(result[0]?.title).toBe('除夕');
	});

	test('chuyi monthly event emits only type chuyi', () => {
		const result = notificationsFromCart(
			[{ kind: 'monthly', monthlyId: 'chuyi' }],
			YEAR_RANGE,
		);

		expect(result.length).toBeGreaterThan(0);
		expect(result.every((n) => n.type === 'chuyi')).toBe(true);
	});

	test('custom 正月十五 and 元宵 catalog item both land on the same Gregorian day', () => {
		const cart: CartRule[] = [
			{
				kind: 'custom',
				lunarMonth: 1,
				lunarDay: 15,
				title: 'Extra reminder',
			},
			{ kind: 'catalog', catalogId: yuanxiao.id },
		];
		const result = notificationsFromCart(cart, YEAR_RANGE);
		const onSameDay = result.filter(
			(n) => n.date[0] === 2020 && n.date[1] === 2 && n.date[2] === 8,
		);

		expect(onSameDay).toHaveLength(2);
		expect(
			onSameDay.some(
				(n) => n.type === 'custom' && n.title === 'Extra reminder',
			),
		).toBe(true);
		expect(onSameDay.some((n) => n.title === '元宵节')).toBe(true);
	});
});
