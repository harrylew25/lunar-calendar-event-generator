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

const MONTHLY_EVENTS = [
	{
		id: 'chuyi',
		kind: 'monthly',
		lunarDay: 1,
		title: '初一',
		cartLabel: '初一 — every lunar month (incl. leap)',
	},
	{
		id: 'shiwu',
		kind: 'monthly',
		lunarDay: 15,
		title: '十五',
		cartLabel: '十五 — every lunar month (incl. leap)',
	},
] as const;

const FESTIVALS = [
	{
		id: 'chuxi',
		kind: 'festival',
		lunarMonth: 12,
		lunarDay: 30,
		title: '除夕',
		cartLabel: '除夕 — 十二月三十',
	},
	{
		id: 'cny-1',
		kind: 'festival',
		lunarMonth: 1,
		lunarDay: 1,
		title: '大年初一',
		cartLabel: '大年初一 — 正月初一',
	},
	{
		id: 'cny-2',
		kind: 'festival',
		lunarMonth: 1,
		lunarDay: 2,
		title: '大年初二',
		cartLabel: '大年初二 — 正月初二',
	},
	{
		id: 'tiangong',
		kind: 'festival',
		lunarMonth: 1,
		lunarDay: 9,
		title: '天公诞',
		cartLabel: '天公诞 — 正月初九',
	},
	{
		id: 'yuanxiao',
		kind: 'festival',
		lunarMonth: 1,
		lunarDay: 15,
		title: '元宵节',
		cartLabel: '元宵节 — 正月十五',
	},
	{
		id: 'laojun',
		kind: 'festival',
		lunarMonth: 2,
		lunarDay: 15,
		title: '太上老君圣诞',
		cartLabel: '太上老君圣诞 — 二月十五',
	},
	{
		id: 'guanyin-birth',
		kind: 'festival',
		lunarMonth: 2,
		lunarDay: 19,
		title: '观音诞(诞辰)',
		cartLabel: '观音诞(诞辰) — 二月十九',
	},
	{
		id: 'vesak',
		kind: 'festival',
		lunarMonth: 4,
		lunarDay: 15,
		title: '卫塞节',
		cartLabel: '卫塞节 — 四月十五',
	},
	{
		id: 'duanwu',
		kind: 'festival',
		lunarMonth: 5,
		lunarDay: 5,
		title: '端午节',
		cartLabel: '端午节 — 五月初五',
	},
	{
		id: 'guanyin-enlightenment',
		kind: 'festival',
		lunarMonth: 6,
		lunarDay: 19,
		title: '观音诞(成道)',
		cartLabel: '观音诞(成道) — 六月十九',
	},
	{
		id: 'qixi',
		kind: 'festival',
		lunarMonth: 7,
		lunarDay: 7,
		title: '七夕节',
		cartLabel: '七夕节 — 七月初七',
	},
	{
		id: 'zhongyuan',
		kind: 'festival',
		lunarMonth: 7,
		lunarDay: 14,
		title: '中元节/盂兰盛会',
		cartLabel: '中元节/盂兰盛会 — 七月十四',
	},
	{
		id: 'zhongqiu',
		kind: 'festival',
		lunarMonth: 8,
		lunarDay: 15,
		title: '中秋节',
		cartLabel: '中秋节 — 八月十五',
	},
	{
		id: 'jiuhuang',
		kind: 'festival',
		lunarMonth: 9,
		lunarDay: 1,
		title: '九皇爷诞',
		cartLabel: '九皇爷诞 — 九月初一',
	},
	{
		id: 'chongyang',
		kind: 'festival',
		lunarMonth: 9,
		lunarDay: 9,
		title: '重阳节',
		cartLabel: '重阳节 — 九月初九',
	},
	{
		id: 'guanyin-nirvana',
		kind: 'festival',
		lunarMonth: 9,
		lunarDay: 19,
		title: '观音诞(涅槃)',
		cartLabel: '观音诞(涅槃) — 九月十九',
	},
] as const;

type MonthlyEventCatalogId = (typeof MONTHLY_EVENTS)[number]['id'];
type FestivalId = (typeof FESTIVALS)[number]['id'];

const monthlyEventById = new Map(
	MONTHLY_EVENTS.map((event) => [event.id, event] as const),
);
const catalogItemById = new Map(
	FESTIVALS.map((festival) => [festival.id, festival] as const),
);

const getMonthlyEvent = (id: MonthlyEventCatalogId) => monthlyEventById.get(id);
const getCatalogItem = (id: FestivalId) => catalogItemById.get(id);

export type { FestivalId, MonthlyEventCatalogId };
export {
	CALENDAR_DEFAULTS,
	FESTIVALS,
	getCatalogItem,
	getMonthlyEvent,
	LUNAR_MILESTONE_DAYS,
	MONTHLY_EVENTS,
	monthRules,
	SOLAR_MONTH,
};
