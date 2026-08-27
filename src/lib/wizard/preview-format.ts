import type { GregorianDateParts } from '@lunar-dates/lunar-dates.type';
import { Solar } from 'lunar-javascript';

const getLunarDayLabelFromGregorian = (date: GregorianDateParts): string => {
	const [year, month, day] = date;
	return Solar.fromYmd(year, month, day).getLunar().getDayInChinese();
};

export { getLunarDayLabelFromGregorian };
