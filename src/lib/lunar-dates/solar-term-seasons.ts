const SOLAR_TERM_SEASONS = [
	{
		id: 'spring',
		label: '🌸 Spring (春)',
		terms: [
			{
				id: 'lichun',
				title: '立春',
				pinyin: 'Lìchūn',
				english: 'Start of Spring',
			},
			{
				id: 'yushui',
				title: '雨水',
				pinyin: 'Yǔshuǐ',
				english: 'Rain Water',
			},
			{
				id: 'jingzhe',
				title: '惊蛰',
				pinyin: 'Jīngzhé',
				english: 'Awakening of Insects',
			},
			{
				id: 'chunfen',
				title: '春分',
				pinyin: 'Chūnfēn',
				english: 'Spring Equinox',
			},
			{
				id: 'qingming',
				title: '清明',
				pinyin: 'Qīngmíng',
				english: 'Pure Brightness',
			},
			{
				id: 'guyu',
				title: '谷雨',
				pinyin: 'Gǔyǔ',
				english: 'Grain Rain',
			},
		],
	},
	{
		id: 'summer',
		label: '☀️ Summer (夏)',
		terms: [
			{
				id: 'lixia',
				title: '立夏',
				pinyin: 'Lìxià',
				english: 'Start of Summer',
			},
			{
				id: 'xiaoman',
				title: '小满',
				pinyin: 'Xiǎomǎn',
				english: 'Grain Budding',
			},
			{
				id: 'mangzhong',
				title: '芒种',
				pinyin: 'Mángzhòng',
				english: 'Grain in Ear',
			},
			{
				id: 'xiazhi',
				title: '夏至',
				pinyin: 'Xiàzhì',
				english: 'Summer Solstice',
			},
			{
				id: 'xiaoshu',
				title: '小暑',
				pinyin: 'Xiǎoshǔ',
				english: 'Minor Heat',
			},
			{
				id: 'dashu',
				title: '大暑',
				pinyin: 'Dàshǔ',
				english: 'Major Heat',
			},
		],
	},
	{
		id: 'autumn',
		label: '🍁 Autumn (秋)',
		terms: [
			{
				id: 'liqiu',
				title: '立秋',
				pinyin: 'Lìqiū',
				english: 'Start of Autumn',
			},
			{
				id: 'chushu',
				title: '处暑',
				pinyin: 'Chǔshǔ',
				english: 'End of Heat',
			},
			{
				id: 'bailu',
				title: '白露',
				pinyin: 'Báilù',
				english: 'White Dew',
			},
			{
				id: 'qiufen',
				title: '秋分',
				pinyin: 'Qiūfēn',
				english: 'Autumn Equinox',
			},
			{
				id: 'hanlu',
				title: '寒露',
				pinyin: 'Hánlù',
				english: 'Cold Dew',
			},
			{
				id: 'shuangjiang',
				title: '霜降',
				pinyin: 'Shuāngjiàng',
				english: "Frost's Descent",
			},
		],
	},
	{
		id: 'winter',
		label: '❄️ Winter (冬)',
		terms: [
			{
				id: 'lidong',
				title: '立冬',
				pinyin: 'Lìdōng',
				english: 'Start of Winter',
			},
			{
				id: 'xiaoxue',
				title: '小雪',
				pinyin: 'Xiǎoxuě',
				english: 'Minor Snow',
			},
			{
				id: 'daxue',
				title: '大雪',
				pinyin: 'Dàxuě',
				english: 'Major Snow',
			},
			{
				id: 'dongzhi',
				title: '冬至',
				pinyin: 'Dōngzhì',
				english: 'Winter Solstice',
			},
			{
				id: 'xiaohan',
				title: '小寒',
				pinyin: 'Xiǎohán',
				english: 'Minor Cold',
			},
			{
				id: 'dahan',
				title: '大寒',
				pinyin: 'Dàhán',
				english: 'Major Cold',
			},
		],
	},
] as const;

type SolarTermSeason = (typeof SOLAR_TERM_SEASONS)[number];
type SolarTerm = SolarTermSeason['terms'][number];
type SolarTermId = SolarTerm['id'];

const SOLAR_TERMS: SolarTerm[] = SOLAR_TERM_SEASONS.flatMap((season) => [
	...season.terms,
]);

const SOLAR_TERMS_BY_SEASON = new Map(
	SOLAR_TERM_SEASONS.map((season) => [season.id, season] as const),
);

export type { SolarTerm, SolarTermId };
export { SOLAR_TERMS, SOLAR_TERMS_BY_SEASON };
