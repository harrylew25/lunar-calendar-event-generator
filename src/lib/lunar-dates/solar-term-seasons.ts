const SOLAR_TERM_SEASONS = [
	{
		id: 'spring',
		label: '🌸 Spring (春)',
		terms: [
			{
				id: 'lichun',
				title: '立春',
				pinyin: 'Lìchūn',
				english: 'Beginning of Spring(Lìchūn)',
			},
			{
				id: 'yushui',
				title: '雨水',
				pinyin: 'Yǔshuǐ',
				english: 'Rain Water(Yǔshuǐ)',
			},
			{
				id: 'jingzhe',
				title: '惊蛰',
				pinyin: 'Jīngzhé',
				english: 'Awakening of Insects(Jīngzhé)',
			},
			{
				id: 'chunfen',
				title: '春分',
				pinyin: 'Chūnfēn',
				english: 'Spring Equinox(Chūnfēn)',
			},
			{
				id: 'qingming',
				title: '清明',
				pinyin: 'Qīngmíng',
				english: 'Pure Brightness(Qīngmíng)',
			},
			{
				id: 'guyu',
				title: '谷雨',
				pinyin: 'Gǔyǔ',
				english: 'Grain Rain(Gǔyǔ)',
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
				english: 'Beginning of Summer(Lìxià)',
			},
			{
				id: 'xiaoman',
				title: '小满',
				pinyin: 'Xiǎomǎn',
				english: 'Grain Buds(Xiǎomǎn)',
			},
			{
				id: 'mangzhong',
				title: '芒种',
				pinyin: 'Mángzhòng',
				english: 'Grain in Ear(Mángzhòng)',
			},
			{
				id: 'xiazhi',
				title: '夏至',
				pinyin: 'Xiàzhì',
				english: 'Summer Solstice(Xiàzhì)',
			},
			{
				id: 'xiaoshu',
				title: '小暑',
				pinyin: 'Xiǎoshǔ',
				english: 'Minor Heat(Xiǎoshǔ)',
			},
			{
				id: 'dashu',
				title: '大暑',
				pinyin: 'Dàshǔ',
				english: 'Major Heat(Dàshǔ)',
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
				english: 'Beginning of Autumn(Lìqiū)',
			},
			{
				id: 'chushu',
				title: '处暑',
				pinyin: 'Chǔshǔ',
				english: 'End of Heat(Chǔshǔ)',
			},
			{
				id: 'bailu',
				title: '白露',
				pinyin: 'Báilù',
				english: 'White Dew(Báilù)',
			},
			{
				id: 'qiufen',
				title: '秋分',
				pinyin: 'Qiūfēn',
				english: 'Autumn Equinox(Qiūfēn)',
			},
			{
				id: 'hanlu',
				title: '寒露',
				pinyin: 'Hánlù',
				english: 'Cold Dew(Hánlù)',
			},
			{
				id: 'shuangjiang',
				title: '霜降',
				pinyin: 'Shuāngjiàng',
				english: "Frost's Descent(Shuāngjiàng)",
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
				english: 'Beginning of Winter(Lìdōng)',
			},
			{
				id: 'xiaoxue',
				title: '小雪',
				pinyin: 'Xiǎoxuě',
				english: 'Minor Snow(Xiǎoxuě)',
			},
			{
				id: 'daxue',
				title: '大雪',
				pinyin: 'Dàxuě',
				english: 'Major Snow(Dàxuě)',
			},
			{
				id: 'dongzhi',
				title: '冬至',
				pinyin: 'Dōngzhì',
				english: 'Winter Solstice(Dōngzhì)',
			},
			{
				id: 'xiaohan',
				title: '小寒',
				pinyin: 'Xiǎohán',
				english: 'Minor Cold(Xiǎohán)',
			},
			{
				id: 'dahan',
				title: '大寒',
				pinyin: 'Dàhán',
				english: 'Major Cold(Dàhán)',
			},
		],
	},
] as const;

type SolarTermSeason = (typeof SOLAR_TERM_SEASONS)[number];
type SolarTerm = SolarTermSeason['terms'][number];
type SolarTermId = SolarTerm['id'];

const SOLAR_TERMS: SolarTerm[] = SOLAR_TERM_SEASONS.flatMap(
	(season): readonly SolarTerm[] => season.terms,
);

const SOLAR_TERMS_BY_SEASON = new Map(
	SOLAR_TERM_SEASONS.map((season) => [season.id, season] as const),
);

export type { SolarTerm, SolarTermId };
export { SOLAR_TERMS, SOLAR_TERMS_BY_SEASON };
