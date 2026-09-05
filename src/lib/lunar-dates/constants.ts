const monthRules = [
	{ name: '正月', value: 1, en: 'January' },
	{ name: '二月', value: 2, en: 'February' },
	{ name: '三月', value: 3, en: 'March' },
	{ name: '四月', value: 4, en: 'April' },
	{ name: '五月', value: 5, en: 'May' },
	{ name: '六月', value: 6, en: 'June' },
	{ name: '七月', value: 7, en: 'July' },
	{ name: '八月', value: 8, en: 'August' },
	{ name: '九月', value: 9, en: 'September' },
	{ name: '十月', value: 10, en: 'October' },
	{ name: '十一月', value: 11, en: 'November' },
	{ name: '十二月', value: 12, en: 'December' },
	{ name: '冬月', value: 11, en: 'November' },
	{ name: '腊月', value: 12, en: 'December' },
	{ name: '闰正月', value: -1, en: 'Leap January' },
	{ name: '闰二月', value: -2, en: 'Leap February' },
	{ name: '闰三月', value: -3, en: 'Leap March' },
	{ name: '闰四月', value: -4, en: 'Leap April' },
	{ name: '闰五月', value: -5, en: 'Leap May' },
	{ name: '闰六月', value: -6, en: 'Leap June' },
	{ name: '闰七月', value: -7, en: 'Leap July' },
	{ name: '闰八月', value: -8, en: 'Leap August' },
	{ name: '闰九月', value: -9, en: 'Leap September' },
	{ name: '闰十月', value: -10, en: 'Leap October' },
	{ name: '闰十一月', value: -11, en: 'Leap November' },
	{ name: '闰十二月', value: -12, en: 'Leap December' },
	{ name: '闰冬月', value: -11, en: 'Leap November' },
	{ name: '闰腊月', value: -12, en: 'Leap December' },
] as const;

const CALENDAR_DEFAULTS = {
	startYear: 2026,
	startMonth: 1,
	numberOfYears: 10,
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
