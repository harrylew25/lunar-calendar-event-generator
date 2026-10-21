import { describe, expect, test } from 'bun:test';
import { solarTermDate } from '@lunar-dates';
import { SOLAR_TERMS_BY_SEASON } from '@lunar-dates/solar-terms';

const CHECKED_TERMS = ['lichun', 'qingming', 'lidong', 'dongzhi'] as const;

type MonthDay = readonly [month: number, day: number];

type SolarTermYear = {
	year: number;
} & Record<(typeof CHECKED_TERMS)[number], MonthDay>;

const malaysiaDate = (
	year: number,
	[month, day]: MonthDay,
): readonly [number, number, number] => [year, month, day];

type AnnualSolarTermDates = readonly [
	lichun: MonthDay,
	qingming: MonthDay,
	lidong: MonthDay,
	dongzhi: MonthDay,
];

const generateAnnualSolarTerms = (
	year: number,
	[lichun, qingming, lidong, dongzhi]: AnnualSolarTermDates,
): SolarTermYear => ({
	year,
	lichun,
	qingming,
	lidong,
	dongzhi,
});

const MALAYSIA_UTC8: SolarTermYear[] = [
	generateAnnualSolarTerms(2017, [
		[2, 3],
		[4, 4],
		[11, 7],
		[12, 22],
	]),
	generateAnnualSolarTerms(2018, [
		[2, 4],
		[4, 5],
		[11, 7],
		[12, 22],
	]),
	generateAnnualSolarTerms(2019, [
		[2, 4],
		[4, 5],
		[11, 8],
		[12, 22],
	]),
	generateAnnualSolarTerms(2020, [
		[2, 4],
		[4, 4],
		[11, 7],
		[12, 21],
	]),
	generateAnnualSolarTerms(2021, [
		[2, 3],
		[4, 4],
		[11, 7],
		[12, 21],
	]),
	generateAnnualSolarTerms(2022, [
		[2, 4],
		[4, 5],
		[11, 7],
		[12, 22],
	]),
	generateAnnualSolarTerms(2023, [
		[2, 4],
		[4, 5],
		[11, 8],
		[12, 22],
	]),
	generateAnnualSolarTerms(2024, [
		[2, 4],
		[4, 4],
		[11, 7],
		[12, 21],
	]),
	generateAnnualSolarTerms(2025, [
		[2, 3],
		[4, 4],
		[11, 7],
		[12, 21],
	]),
	generateAnnualSolarTerms(2026, [
		[2, 4],
		[4, 5],
		[11, 7],
		[12, 22],
	]),
	generateAnnualSolarTerms(2027, [
		[2, 4],
		[4, 5],
		[11, 7],
		[12, 22],
	]),
	generateAnnualSolarTerms(2028, [
		[2, 4],
		[4, 4],
		[11, 7],
		[12, 21],
	]),
	generateAnnualSolarTerms(2029, [
		[2, 3],
		[4, 4],
		[11, 7],
		[12, 21],
	]),
	generateAnnualSolarTerms(2030, [
		[2, 4],
		[4, 5],
		[11, 7],
		[12, 22],
	]),
	generateAnnualSolarTerms(2031, [
		[2, 4],
		[4, 5],
		[11, 7],
		[12, 22],
	]),
	generateAnnualSolarTerms(2032, [
		[2, 4],
		[4, 4],
		[11, 7],
		[12, 21],
	]),
	generateAnnualSolarTerms(2033, [
		[2, 3],
		[4, 4],
		[11, 7],
		[12, 21],
	]),
	generateAnnualSolarTerms(2034, [
		[2, 4],
		[4, 5],
		[11, 7],
		[12, 22],
	]),
	generateAnnualSolarTerms(2035, [
		[2, 4],
		[4, 5],
		[11, 7],
		[12, 22],
	]),
	generateAnnualSolarTerms(2036, [
		[2, 4],
		[4, 4],
		[11, 7],
		[12, 21],
	]),
];

describe('solarTermDate', () => {
	test.each(
		MALAYSIA_UTC8,
	)('$year 立春, 清明, 立冬, and 冬至 match Malaysia civil dates', (row) => {
		for (const id of CHECKED_TERMS) {
			expect(solarTermDate(row.year, id)).toEqual(
				malaysiaDate(row.year, row[id]),
			);
		}
	});

	test('2020 小寒 is 6 January', () => {
		expect(solarTermDate(2020, 'xiaohan')).toEqual([2020, 1, 6]);
	});
});

describe('SOLAR_TERMS_BY_SEASON', () => {
	test('groups the 24 solar terms into spring, summer, autumn, and winter', () => {
		expect(
			[...SOLAR_TERMS_BY_SEASON.entries()].map(([id, season]) => ({
				id,
				label: season.label,
				terms: season.terms.map((term) => [term.title, term.english]),
			})),
		).toEqual([
			{
				id: 'spring',
				label: '🌸 Spring (春)',
				terms: [
					['立春', 'Beginning of Spring(Lìchūn)'],
					['雨水', 'Rain Water(Yǔshuǐ)'],
					['惊蛰', 'Awakening of Insects(Jīngzhé)'],
					['春分', 'Spring Equinox(Chūnfēn)'],
					['清明', 'Pure Brightness(Qīngmíng)'],
					['谷雨', 'Grain Rain(Gǔyǔ)'],
				],
			},
			{
				id: 'summer',
				label: '☀️ Summer (夏)',
				terms: [
					['立夏', 'Beginning of Summer(Lìxià)'],
					['小满', 'Grain Buds(Xiǎomǎn)'],
					['芒种', 'Grain in Ear(Mángzhòng)'],
					['夏至', 'Summer Solstice(Xiàzhì)'],
					['小暑', 'Minor Heat(Xiǎoshǔ)'],
					['大暑', 'Major Heat(Dàshǔ)'],
				],
			},
			{
				id: 'autumn',
				label: '🍁 Autumn (秋)',
				terms: [
					['立秋', 'Beginning of Autumn(Lìqiū)'],
					['处暑', 'End of Heat(Chǔshǔ)'],
					['白露', 'White Dew(Báilù)'],
					['秋分', 'Autumn Equinox(Qiūfēn)'],
					['寒露', 'Cold Dew(Hánlù)'],
					['霜降', "Frost's Descent(Shuāngjiàng)"],
				],
			},
			{
				id: 'winter',
				label: '❄️ Winter (冬)',
				terms: [
					['立冬', 'Beginning of Winter(Lìdōng)'],
					['小雪', 'Minor Snow(Xiǎoxuě)'],
					['大雪', 'Major Snow(Dàxuě)'],
					['冬至', 'Winter Solstice(Dōngzhì)'],
					['小寒', 'Minor Cold(Xiǎohán)'],
					['大寒', 'Major Cold(Dàhán)'],
				],
			},
		]);
	});
});
