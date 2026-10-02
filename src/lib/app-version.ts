const kualaLumpur = 'Asia/Kuala_Lumpur';

type CivilDate = {
	year: number;
	month: number;
	day: number;
};

const part = (
	parts: Intl.DateTimeFormatPart[],
	type: Intl.DateTimeFormatPartTypes,
): number => {
	const value = parts.find((item) => item.type === type)?.value;
	if (value === undefined) {
		throw new Error(`Missing ${type} in Kuala Lumpur date`);
	}
	return Number(value);
};

const kualaLumpurCivilDate = (now: Date): CivilDate => {
	const parts = new Intl.DateTimeFormat('en-US', {
		timeZone: kualaLumpur,
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
	}).formatToParts(now);

	return {
		year: part(parts, 'year'),
		month: part(parts, 'month'),
		day: part(parts, 'day'),
	};
};

const isoWeek = (civil: CivilDate): { weekYear: number; week: number } => {
	const date = new Date(Date.UTC(civil.year, civil.month - 1, civil.day));
	const weekday = date.getUTCDay() || 7;
	date.setUTCDate(date.getUTCDate() + 4 - weekday);
	const weekYear = date.getUTCFullYear();
	const yearStart = Date.UTC(weekYear, 0, 1);
	const week = Math.ceil(((date.getTime() - yearStart) / 86_400_000 + 1) / 7);

	return { weekYear, week };
};

const twoDigits = (value: number): string => String(value).padStart(2, '0');

export const formatAppVersion = (now: Date, buildId: string): string => {
	const { weekYear, week } = isoWeek(kualaLumpurCivilDate(now));
	const year = twoDigits(weekYear % 100);

	return `${year}.${twoDigits(week)}.${buildId}`;
};

export const currentAppVersion = (
	now: Date = new Date(),
	runNumber: string | undefined = process.env.GITHUB_RUN_NUMBER,
): string => formatAppVersion(now, runNumber === undefined ? 'dev' : runNumber);
