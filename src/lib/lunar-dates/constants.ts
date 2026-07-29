const monthRules = [
	{ name: '闰正月', value: -1, en: 'Leap 1st Month' },
	{ name: '正月', value: 1, en: '1st Month' },
	{ name: '闰二月', value: -2, en: 'Leap 2nd Month' },
	{ name: '二月', value: 2, en: '2nd Month' },
	{ name: '闰三月', value: -3, en: 'Leap 3rd Month' },
	{ name: '三月', value: 3, en: '3rd Month' },
	{ name: '闰四月', value: -4, en: 'Leap 4th Month' },
	{ name: '四月', value: 4, en: '4th Month' },
	{ name: '闰五月', value: -5, en: 'Leap 5th Month' },
	{ name: '五月', value: 5, en: '5th Month' },
	{ name: '闰六月', value: -6, en: 'Leap 6th Month' },
	{ name: '六月', value: 6, en: '6th Month' },
	{ name: '闰七月', value: -7, en: 'Leap 7th Month' },
	{ name: '七月', value: 7, en: '7th Month' },
	{ name: '闰八月', value: -8, en: 'Leap 8th Month' },
	{ name: '八月', value: 8, en: '8th Month' },
	{ name: '闰九月', value: -9, en: 'Leap 9th Month' },
	{ name: '九月', value: 9, en: '9th Month' },
	{ name: '闰十月', value: -10, en: 'Leap 10th Month' },
	{ name: '十月', value: 10, en: '10th Month' },
	{ name: '闰冬月', value: -11, en: 'Leap 11th Month' },
	{ name: '冬月', value: 11, en: '11th Month' },
	{ name: '闰十一月', value: -11, en: 'Leap 11th Month' },
	{ name: '十一月', value: 11, en: '11th Month' },
	{ name: '闰腊月', value: -12, en: 'Leap 12th Month' },
	{ name: '腊月', value: 12, en: '12th Month' },
	{ name: '闰十二月', value: -12, en: 'Leap 12th Month' },
	{ name: '十二月', value: 12, en: '12th Month' },
];

const CALENDAR_DEFAULTS = {
	startYear: 2020,
	startMonth: 1,
	numberOfYears: 5,
} as const;

const SOLAR_MONTH = {
	firstDay: 1,
	min: 1,
	max: 12,
} as const;

const LUNAR_MILESTONE_DAYS = {
	chuyi: 1,
	shiwu: 15,
} as const;

export { CALENDAR_DEFAULTS, LUNAR_MILESTONE_DAYS, monthRules, SOLAR_MONTH };
