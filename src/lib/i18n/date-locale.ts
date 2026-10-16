import { format } from 'date-fns';
import { enUS, zhCN, zhTW } from 'date-fns/locale';
import type { Locale } from './locale';

const dateFnsLocales = {
	en: enUS,
	'zh-CN': zhCN,
	'zh-TW': zhTW,
} as const;

const dateFnsLocale = (locale: Locale) => dateFnsLocales[locale];

const gregorianMonthName = (month: number, locale: Locale): string =>
	format(new Date(2020, month - 1, 1), 'LLLL', {
		locale: dateFnsLocales[locale],
	});

export { dateFnsLocale, gregorianMonthName };
