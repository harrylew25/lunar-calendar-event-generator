import type { GregorianDateParts } from '@lunar-dates/lunar-dates.type';
import { Solar } from 'lunar-javascript';
import { previewLunarLine } from '@/lib/i18n/catalog-labels';
import type { Locale } from '@/lib/i18n/locale';

const formatPreviewLunarLine = (
	date: GregorianDateParts,
	locale: Locale,
): string => {
	const lunar = Solar.fromYmd(date[0], date[1], date[2]).getLunar();
	return previewLunarLine(lunar.getMonth(), lunar.getDay(), locale);
};

export { formatPreviewLunarLine };
