import {
	type FestivalId,
	getCatalogItem,
	LUNAR_DAY_NAMES,
	LUNAR_MILESTONE_DAYS,
	monthRules,
} from '@lunar-dates/constants';
import type { MonthlyEventId } from '@lunar-dates/lunar-dates.type';
import { SOLAR_TERMS, type SolarTermId } from '@lunar-dates/solar-term-seasons';
import type { MessageKey } from './en';
import type { Locale } from './locale';
import { translate } from './translate';
import { zhTwCatalog } from './zh-TW';

const monthByValue = new Map(monthRules.map((rule) => [rule.value, rule]));
const dayByValue = new Map<number, (typeof LUNAR_DAY_NAMES)[number]>(
	LUNAR_DAY_NAMES.map((day) => [day.value, day]),
);
const solarTermById = new Map(SOLAR_TERMS.map((term) => [term.id, term]));

const traditional = (simplified: string): string =>
	zhTwCatalog[simplified] ?? simplified;

const lunarMonthLabel = (value: number, locale: Locale): string => {
	const rule = monthByValue.get(value);
	if (!rule) {
		return String(value);
	}
	if (locale === 'en') {
		return rule.en;
	}
	if (locale === 'zh-TW') {
		return traditional(rule.name);
	}
	return rule.name;
};

const lunarDayLabel = (day: number, locale: Locale): string => {
	const entry = dayByValue.get(day);
	if (!entry) {
		return String(day);
	}
	if (locale === 'en') {
		return entry.en;
	}
	return entry.name;
};

const festivalTitle = (id: FestivalId, locale: Locale): string => {
	const festival = getCatalogItem(id);
	if (!festival) {
		return id;
	}
	if (locale === 'en') {
		return festival.en;
	}
	if (locale === 'zh-TW') {
		return traditional(festival.title);
	}
	return festival.title;
};

const festivalCartLabel = (id: FestivalId, locale: Locale): string => {
	const festival = getCatalogItem(id);
	if (!festival) {
		return id;
	}
	const title = festivalTitle(id, locale);
	const month = lunarMonthLabel(festival.lunarMonth, locale);
	const day = lunarDayLabel(festival.lunarDay, locale);
	if (locale === 'en') {
		return `${title} — ${month} ${day}`;
	}
	return `${title} — ${month}${day}`;
};

const solarTermTitle = (id: SolarTermId, locale: Locale): string => {
	const term = solarTermById.get(id);
	if (!term) {
		return id;
	}
	if (locale === 'en') {
		return term.english;
	}
	if (locale === 'zh-TW') {
		return traditional(term.title);
	}
	return term.title;
};

const monthlyTitle = (id: MonthlyEventId, locale: Locale): string =>
	lunarDayLabel(LUNAR_MILESTONE_DAYS[id], locale);

const monthlyCartLabel = (id: MonthlyEventId, locale: Locale): string =>
	`${monthlyTitle(id, locale)} — ${translate(locale, 'monthlyCartSuffix')}`;

const monthlySummary = (
	monthValue: number,
	id: MonthlyEventId,
	locale: Locale,
): string => {
	const month = lunarMonthLabel(monthValue, locale);
	const day = lunarDayLabel(LUNAR_MILESTONE_DAYS[id], locale);
	if (locale === 'en') {
		return `Lunar ${month} ${day}`;
	}
	const prefix = locale === 'zh-TW' ? traditional('农历') : '农历';
	return `${prefix}${month}${day}`;
};

const previewLunarLine = (
	monthValue: number,
	day: number,
	locale: Locale,
): string => {
	const month = lunarMonthLabel(monthValue, locale);
	const dayLabel = lunarDayLabel(day, locale);
	if (locale === 'en') {
		return `${month} ${dayLabel}`;
	}
	return `${month}${dayLabel}`;
};

const seasonMessageKey = {
	spring: 'seasonSpring',
	summer: 'seasonSummer',
	autumn: 'seasonAutumn',
	winter: 'seasonWinter',
} as const satisfies Record<string, MessageKey>;

const seasonLabel = (
	seasonId: keyof typeof seasonMessageKey,
	locale: Locale,
): string => translate(locale, seasonMessageKey[seasonId]);

export {
	festivalCartLabel,
	festivalTitle,
	lunarDayLabel,
	lunarMonthLabel,
	monthlyCartLabel,
	monthlySummary,
	monthlyTitle,
	previewLunarLine,
	seasonLabel,
	solarTermTitle,
};
