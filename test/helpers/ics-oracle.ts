import type { GregorianDateParts } from '@lunar-dates/lunar-dates.type';

const toGregorianDate = (parts: GregorianDateParts): Date => {
	const [year, month, day] = parts;
	return new Date(Date.UTC(year, month - 1, day));
};

export const subtractCalendarDays = (
	parts: GregorianDateParts,
	days: number,
): GregorianDateParts => {
	const date = toGregorianDate(parts);
	date.setUTCDate(date.getUTCDate() - days);
	return [date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate()];
};
