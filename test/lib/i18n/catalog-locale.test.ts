import { describe, expect, test } from 'bun:test';
import { generateLunarCalendarIcs } from '@ics';
import { notificationsFromCart } from '@lunar-dates';
import type { CartRule } from '@lunar-dates/lunar-dates.type';
import {
	festivalCartLabel,
	monthlyCartLabel,
	monthlySummary,
	previewLunarLine,
} from '@/lib/i18n/catalog-labels';

const YEAR = { startYear: 2020, numberOfYears: 0 } as const;

const cart: CartRule[] = [
	{ kind: 'catalog', catalogId: 'yuanxiao' },
	{ kind: 'solarTerm', solarTermId: 'jingzhe' },
	{ kind: 'monthly', monthlyId: 'chuyi' },
	{
		kind: 'custom',
		lunarMonth: 1,
		lunarDay: 15,
		title: 'Family dinner',
		description: 'Bring oranges',
		location: 'Home',
	},
];

describe('catalog locale', () => {
	test('english names the festival, solar term, and monthly summary', () => {
		const events = notificationsFromCart(cart, YEAR, 'en');

		expect(events.some((event) => event.title === 'Lantern Festival')).toBe(
			true,
		);
		expect(events.some((event) => event.title === 'Awakening of Insects')).toBe(
			true,
		);
		expect(
			events.find((event) => event.date.join('-') === '2020-1-25'),
		).toMatchObject({
			title: '1st',
			summary: 'Lunar January 1st',
		});
		expect(
			events.find((event) => event.title === 'Family dinner'),
		).toMatchObject({
			description: 'Bring oranges',
			icsOverrides: { location: 'Home' },
		});
	});

	test('traditional Chinese names the festival, solar term, and monthly summary', () => {
		const events = notificationsFromCart(cart, YEAR, 'zh-TW');

		expect(events.some((event) => event.title === '元宵節')).toBe(true);
		expect(events.some((event) => event.title === '驚蟄')).toBe(true);
		expect(
			events.find((event) => event.date.join('-') === '2020-1-25'),
		).toMatchObject({
			title: '初一',
			summary: '農曆正月初一',
		});
		expect(events.find((event) => event.title === 'Family dinner')?.title).toBe(
			'Family dinner',
		);
	});

	test('the ICS calendar name stays Lunar Calendar in every locale', () => {
		for (const locale of ['en', 'zh-CN', 'zh-TW'] as const) {
			const ics = generateLunarCalendarIcs(
				notificationsFromCart(cart, YEAR, locale),
			);
			expect(ics).toContain('X-WR-CALNAME:Lunar Calendar');
			expect(ics).toContain('PRODID:-//Lunar Calendar Event Generator//EN');
		}
	});

	test('cart lines, leap summaries, and preview lines follow the locale', () => {
		expect(monthlyCartLabel('chuyi', 'en')).toBe(
			'1st — every lunar month (incl. leap)',
		);
		expect(monthlyCartLabel('shiwu', 'en')).toBe(
			'15th — every lunar month (incl. leap)',
		);
		expect(monthlyCartLabel('chuyi', 'zh-CN')).toBe(
			'初一 — 每个农历月（含闰月）',
		);
		expect(monthlyCartLabel('chuyi', 'zh-TW')).toBe(
			'初一 — 每個農曆月（含閏月）',
		);
		expect(festivalCartLabel('yuanxiao', 'en')).toBe(
			'Lantern Festival — January 15th',
		);
		expect(festivalCartLabel('yuanxiao', 'zh-CN')).toBe('元宵节 — 正月十五');
		expect(festivalCartLabel('yuanxiao', 'zh-TW')).toBe('元宵節 — 正月十五');
		expect(monthlySummary(-1, 'chuyi', 'zh-CN')).toBe('农历闰正月初一');
		expect(monthlySummary(-1, 'chuyi', 'zh-TW')).toBe('農曆閏正月初一');
		expect(monthlySummary(-1, 'chuyi', 'en')).toBe('Lunar Leap January 1st');
		expect(previewLunarLine(1, 1, 'zh-CN')).toBe('正月初一');
		expect(previewLunarLine(1, 1, 'zh-TW')).toBe('正月初一');
		expect(previewLunarLine(1, 1, 'en')).toBe('January 1st');
		expect(previewLunarLine(-1, 1, 'zh-CN')).toBe('闰正月初一');
		expect(previewLunarLine(-1, 1, 'zh-TW')).toBe('閏正月初一');
		expect(previewLunarLine(-1, 1, 'en')).toBe('Leap January 1st');
	});
});
