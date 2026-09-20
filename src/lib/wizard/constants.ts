import { monthRules } from '@lunar-dates/constants';

const dedupedMonthRules = [
	...new Map(monthRules.map((rule) => [rule.value, rule])).values(),
];

const LOOP_YEAR_PRESETS = [5, 10, 25, 50, 100, 200, 300] as const;

const LUNAR_DAY_OPTIONS = Array.from({ length: 30 }, (_, index) => index + 1);

const GREGORIAN_MONTH_NAMES = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
] as const;

const MESSAGES = {
	endOfMonth:
		"Not every lunar month has 30 days. We will use 29th if the month doesn't have 30 days.",
	leapMonth:
		'We will mark leap month for the first year, and then second year onward, revert to normal lunar month',
} as const;

export {
	dedupedMonthRules,
	GREGORIAN_MONTH_NAMES,
	LOOP_YEAR_PRESETS,
	LUNAR_DAY_OPTIONS,
	MESSAGES,
};
