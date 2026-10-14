import { Solar } from 'lunar-javascript';
import type {
	CustomYearRange,
	GregorianDateParts,
	IcsEventOverrides,
	LunarDateNotification,
} from './lunar-dates.type';

import {
	SOLAR_TERMS,
	SOLAR_TERMS_BY_SEASON,
	type SolarTerm,
	type SolarTermId,
} from './solar-term-seasons';

const JIE_QI_ALIAS = new Map<string, string>([
	['DA_HAN', '大寒'],
	['DA_XUE', '大雪'],
	['DONG_ZHI', '冬至'],
	['JING_ZHE', '惊蛰'],
	['LI_CHUN', '立春'],
	['XIAO_HAN', '小寒'],
	['YU_SHUI', '雨水'],
]);

const solarTermById = new Map(
	SOLAR_TERMS.map((term) => [term.id, term] as const),
);

const jieQiTitle = (key: string): string => JIE_QI_ALIAS.get(key) ?? key;

const solarTermDate = (year: number, id: SolarTermId): GregorianDateParts => {
	const term = solarTermById.get(id);
	if (!term) {
		throw new Error(`Unknown solar term ${id}`);
	}

	const tables = [year, year + 1].map((anchorYear) =>
		Solar.fromYmd(anchorYear, 7, 1).getLunar().getJieQiTable(),
	);

	for (const table of tables) {
		for (const [key, solar] of Object.entries(table)) {
			if (jieQiTitle(key) !== term.title || solar.getYear() !== year) {
				continue;
			}
			return [solar.getYear(), solar.getMonth(), solar.getDay()];
		}
	}

	throw new Error(`No ${term.title} in ${year}`);
};

const pickIcsOverrides = (
	input: IcsEventOverrides,
): IcsEventOverrides | undefined => {
	const overrides: IcsEventOverrides = {
		location: input.location,
		alarmDaysBefore: input.alarmDaysBefore,
		alarmHour: input.alarmHour,
		alarmMinute: input.alarmMinute,
		timeTransparent: input.timeTransparent,
		visibility: input.visibility,
	};
	const hasOverride = Object.values(overrides).some(
		(value) => value !== undefined,
	);
	if (!hasOverride) {
		return undefined;
	}
	return overrides;
};

const expandSolarTerm = (
	id: SolarTermId,
	{ startYear, numberOfYears }: CustomYearRange,
	overrides: IcsEventOverrides = {},
): LunarDateNotification[] => {
	const term = solarTermById.get(id);
	if (!term) {
		return [];
	}

	const notifications: LunarDateNotification[] = [];
	for (let offset = 0; offset <= numberOfYears; offset++) {
		const year = startYear + offset;
		notifications.push({
			date: solarTermDate(year, id),
			type: 'custom',
			title: term.title,
			summary: term.title,
			description: '',
			icsOverrides: pickIcsOverrides(overrides),
		});
	}
	return notifications;
};

const getSolarTerm = (id: SolarTermId): SolarTerm | undefined =>
	solarTermById.get(id);

export type { SolarTermId };
export {
	expandSolarTerm,
	getSolarTerm,
	SOLAR_TERMS,
	SOLAR_TERMS_BY_SEASON,
	solarTermDate,
};
