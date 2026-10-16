import { monthRules } from '@lunar-dates/constants';

const dedupedMonthRules = [
	...new Map(monthRules.map((rule) => [rule.value, rule])).values(),
];

const LOOP_YEAR_PRESETS = [5, 10, 25, 50, 100, 200, 300] as const;

const LUNAR_DAY_OPTIONS = Array.from({ length: 30 }, (_, index) => index + 1);

export { dedupedMonthRules, LOOP_YEAR_PRESETS, LUNAR_DAY_OPTIONS };
