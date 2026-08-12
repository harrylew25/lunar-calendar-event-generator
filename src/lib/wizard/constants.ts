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

const getMonthRuleName = (monthValue: number): string => {
	return (
		dedupedMonthRules.find((rule) => rule.value === monthValue)?.name ??
		`${monthValue}`
	);
};

export {
	dedupedMonthRules,
	GREGORIAN_MONTH_NAMES,
	getMonthRuleName,
	LOOP_YEAR_PRESETS,
	LUNAR_DAY_OPTIONS,
};
