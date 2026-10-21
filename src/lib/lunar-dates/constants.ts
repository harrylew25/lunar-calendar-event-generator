const CALENDAR_DEFAULTS = {
	startYear: new Date().getFullYear(),
	startMonth: 1,
	numberOfYears: 50,
} as const;

const SOLAR_MONTH = {
	firstDay: 1,
	min: 1,
	max: 12,
} as const;

const LUNAR_MONTH_NAMES = [
	{ name: '正月', en: '1st Month' },
	{ name: '二月', en: '2nd Month' },
	{ name: '三月', en: '3rd Month' },
	{ name: '四月', en: '4th Month' },
	{ name: '五月', en: '5th Month' },
	{ name: '六月', en: '6th Month' },
	{ name: '七月', en: '7th Month' },
	{ name: '八月', en: '8th Month' },
	{ name: '九月', en: '9th Month' },
	{ name: '十月', en: '10th Month' },
	{ name: '十一月(冬月)', en: '11th Month' },
	{ name: '十二月(腊月)', en: '12th Month' },
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

const LUNAR_MILESTONE_DAYS = {
	chuyi: 1,
	shiwu: 15,
} as const;

const MONTHLY_EVENTS = [
	{ id: 'chuyi', kind: 'monthly', lunarDay: LUNAR_MILESTONE_DAYS.chuyi },
	{ id: 'shiwu', kind: 'monthly', lunarDay: LUNAR_MILESTONE_DAYS.shiwu },
] as const;

type MonthlyEventCatalogId = (typeof MONTHLY_EVENTS)[number]['id'];

type LunarMonthValue = MonthRule['value'];

const knownMonthValues = new Set(monthRules.map((rule) => rule.value));
const knownDayValues = new Set<number>(LUNAR_DAY_NAMES.map((day) => day.value));

type FestivalEvent<TId extends string> = {
	id: TId;
	kind: 'festival';
	lunarMonth: LunarMonthValue;
	lunarDay: LunarDayValue;
	title: string;
	en: string;
};

const createFestivalEvent = <TId extends string>(
	id: TId,
	lunarMonth: LunarMonthValue,
	lunarDay: LunarDayValue,
	title: string,
	en: string,
): FestivalEvent<TId> => {
	if (!knownMonthValues.has(lunarMonth) || !knownDayValues.has(lunarDay)) {
		throw new Error(`Unknown lunar date ${lunarMonth}-${lunarDay}`);
	}

	return {
		id,
		kind: 'festival',
		lunarMonth,
		lunarDay,
		title,
		en,
	};
};

const FESTIVALS = [
	createFestivalEvent('chuxi', 12, 30, '除夕', "Chinese New Year's Eve"),
	createFestivalEvent('cny-1', 1, 1, '大年初一', "Lunar New Year's Day"),
	createFestivalEvent(
		'cny-2',
		1,
		2,
		'大年初二',
		'Second day of Lunar New Year',
	),
	createFestivalEvent('tiangong', 1, 9, '天公诞', "Jade Emperor's Birthday"),
	createFestivalEvent('yuanxiao', 1, 15, '元宵节', 'Lantern Festival'),
	createFestivalEvent(
		'laojun',
		2,
		15,
		'太上老君圣诞',
		"Taishang Laojun's Birthday",
	),
	createFestivalEvent(
		'guanyin-birth',
		2,
		19,
		'观音诞(诞辰)',
		"Guanyin's Birthday",
	),
	createFestivalEvent('duanwu', 5, 5, '端午节', 'Dragon Boat Festival'),
	createFestivalEvent(
		'guanyin-enlightenment',
		6,
		19,
		'观音诞(成道)',
		"Guanyin's Enlightenment",
	),
	createFestivalEvent('qixi', 7, 7, '七夕节', 'Qixi Festival'),
	createFestivalEvent('zhongyuan', 7, 14, '中元节/盂兰盛会', 'Ghost Festival'),
	createFestivalEvent('zhongqiu', 8, 15, '中秋节', 'Mid-Autumn Festival'),
	createFestivalEvent(
		'jiuhuang',
		9,
		1,
		'九皇爷诞',
		"Nine Emperor Gods' Birthday",
	),
	createFestivalEvent('chongyang', 9, 9, '重阳节', 'Double Ninth Festival'),
	createFestivalEvent(
		'guanyin-nirvana',
		9,
		19,
		'观音诞(涅槃)',
		"Guanyin's Nirvana",
	),
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
	LUNAR_DAY_NAMES,
	LUNAR_MILESTONE_DAYS,
	MONTHLY_EVENTS,
	monthRules,
	SOLAR_MONTH,
};
