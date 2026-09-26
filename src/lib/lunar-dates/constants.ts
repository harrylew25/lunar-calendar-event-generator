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

const LUNAR_MONTH_NAMES = [
	{ name: '正月', en: 'January' },
	{ name: '二月', en: 'February' },
	{ name: '三月', en: 'March' },
	{ name: '四月', en: 'April' },
	{ name: '五月', en: 'May' },
	{ name: '六月', en: 'June' },
	{ name: '七月', en: 'July' },
	{ name: '八月', en: 'August' },
	{ name: '九月', en: 'September' },
	{ name: '十月', en: 'October' },
	{ name: '十一月(冬月)', en: 'November' },
	{ name: '十二月(腊月)', en: 'December' },
] as const;

type LunarMonthName = (typeof LUNAR_MONTH_NAMES)[number]['name'];
type LunarMonthEn = (typeof LUNAR_MONTH_NAMES)[number]['en'];
type LeapLunarMonthName = `闰${LunarMonthName}`;
type MonthRuleName = LunarMonthName | LeapLunarMonthName;
type MonthRuleEn = LunarMonthEn | `Leap ${LunarMonthEn}`;

type MonthRule = {
	name: MonthRuleName;
	en: MonthRuleEn;
	value: number;
};

const monthRules: MonthRule[] = LUNAR_MONTH_NAMES.flatMap((month, index) => {
	const value = index + 1;
	return [
		{ ...month, value },
		{ name: `闰${month.name}`, value: -value, en: `Leap ${month.en}` },
	];
});

const LUNAR_DAY_NAMES = [
	{ name: '初一', value: 1, en: '1st' },
	{ name: '初二', value: 2, en: '2nd' },
	{ name: '初三', value: 3, en: '3rd' },
	{ name: '初四', value: 4, en: '4th' },
	{ name: '初五', value: 5, en: '5th' },
	{ name: '初六', value: 6, en: '6th' },
	{ name: '初七', value: 7, en: '7th' },
	{ name: '初八', value: 8, en: '8th' },
	{ name: '初九', value: 9, en: '9th' },
	{ name: '初十', value: 10, en: '10th' },
	{ name: '十一', value: 11, en: '11th' },
	{ name: '十二', value: 12, en: '12th' },
	{ name: '十三', value: 13, en: '13th' },
	{ name: '十四', value: 14, en: '14th' },
	{ name: '十五', value: 15, en: '15th' },
	{ name: '十六', value: 16, en: '16th' },
	{ name: '十七', value: 17, en: '17th' },
	{ name: '十八', value: 18, en: '18th' },
	{ name: '十九', value: 19, en: '19th' },
	{ name: '二十', value: 20, en: '20th' },
	{ name: '廿一', value: 21, en: '21st' },
	{ name: '廿二', value: 22, en: '22nd' },
	{ name: '廿三', value: 23, en: '23rd' },
	{ name: '廿四', value: 24, en: '24th' },
	{ name: '廿五', value: 25, en: '25th' },
	{ name: '廿六', value: 26, en: '26th' },
	{ name: '廿七', value: 27, en: '27th' },
	{ name: '廿八', value: 28, en: '28th' },
	{ name: '廿九', value: 29, en: '29th' },
	{ name: '三十', value: 30, en: '30th' },
] as const;

type LunarDayValue = (typeof LUNAR_DAY_NAMES)[number]['value'];
type LunarDayName = (typeof LUNAR_DAY_NAMES)[number]['name'];

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

type MonthlyEventCatalogId = (typeof MONTHLY_EVENTS)[number]['id'];

const monthlyEventById = new Map(
	MONTHLY_EVENTS.map((event) => [event.id, event] as const),
);
const getMonthlyEvent = (id: MonthlyEventCatalogId) => monthlyEventById.get(id);

type LunarMonthValue = MonthRule['value'];

const monthNameByValue = new Map<number, MonthRule['name']>(
	monthRules.map((rule) => [rule.value, rule.name]),
);
const dayNameByValue = new Map(
	LUNAR_DAY_NAMES.map((day) => [day.value, day.name]),
);

type FestivalEvent<TId extends string> = {
	id: TId;
	kind: 'festival';
	lunarMonth: LunarMonthValue;
	lunarDay: LunarDayValue;
	title: string;
	cartLabel: string;
	lunarMonthLabel: MonthRuleName;
	lunarDayLabel: LunarDayName;
};

const createFestivalEvent = <TId extends string>(
	id: TId,
	lunarMonth: LunarMonthValue,
	lunarDay: LunarDayValue,
	title: string,
): FestivalEvent<TId> => {
	const month = monthNameByValue.get(lunarMonth);
	const day = dayNameByValue.get(lunarDay);
	if (month === undefined || day === undefined) {
		throw new Error(`Unknown lunar date ${lunarMonth}-${lunarDay}`);
	}

	return {
		id,
		kind: 'festival',
		lunarMonth,
		lunarDay,
		title,
		lunarMonthLabel: month,
		lunarDayLabel: day,
		cartLabel: `${title} — ${month}${day}`,
	};
};

const FESTIVALS = [
	createFestivalEvent('chuxi', 12, 30, '除夕'),
	createFestivalEvent('cny-1', 1, 1, '大年初一'),
	createFestivalEvent('cny-2', 1, 2, '大年初二'),
	createFestivalEvent('tiangong', 1, 9, '天公诞'),
	createFestivalEvent('yuanxiao', 1, 15, '元宵节'),
	createFestivalEvent('laojun', 2, 15, '太上老君圣诞'),
	createFestivalEvent('guanyin-birth', 2, 19, '观音诞(诞辰)'),
	createFestivalEvent('vesak', 4, 15, '卫塞节'),
	createFestivalEvent('duanwu', 5, 5, '端午节'),
	createFestivalEvent('guanyin-enlightenment', 6, 19, '观音诞(成道)'),
	createFestivalEvent('qixi', 7, 7, '七夕节'),
	createFestivalEvent('zhongyuan', 7, 14, '中元节/盂兰盛会'),
	createFestivalEvent('zhongqiu', 8, 15, '中秋节'),
	createFestivalEvent('jiuhuang', 9, 1, '九皇爷诞'),
	createFestivalEvent('chongyang', 9, 9, '重阳节'),
	createFestivalEvent('guanyin-nirvana', 9, 19, '观音诞(涅槃)'),
] as const;

type FestivalId = (typeof FESTIVALS)[number]['id'];

const catalogItemById = new Map(
	FESTIVALS.map((festival) => [festival.id, festival] as const),
);
const getCatalogItem = (id: FestivalId) => catalogItemById.get(id);

export type { FestivalId, MonthlyEventCatalogId, MonthRule };
export {
	CALENDAR_DEFAULTS,
	FESTIVALS,
	getCatalogItem,
	getMonthlyEvent,
	LUNAR_DAY_NAMES,
	LUNAR_MILESTONE_DAYS,
	MONTHLY_EVENTS,
	monthRules,
	SOLAR_MONTH,
};
