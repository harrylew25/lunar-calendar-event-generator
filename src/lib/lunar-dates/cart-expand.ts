import { FESTIVALS } from './constants';
import {
	collectCustomNotifications,
	expandMonthlyEvents,
} from './custom-dates';
import type {
	CartRule,
	CustomYearRange,
	IcsEventOverrides,
	LunarCustomDateInput,
	LunarDateNotification,
	MonthlyEventId,
} from './lunar-dates.type';

const festivalById = new Map(
	FESTIVALS.map((festival) => [festival.id, festival] as const),
);

const icsFields = (item: IcsEventOverrides): IcsEventOverrides => ({
	location: item.location,
	alarmDaysBefore: item.alarmDaysBefore,
	alarmHour: item.alarmHour,
	alarmMinute: item.alarmMinute,
	timeTransparent: item.timeTransparent,
	visibility: item.visibility,
});

const toCustomInput = (
	item: {
		lunarMonth: number;
		lunarDay: number;
		title: string;
		description?: string;
	} & IcsEventOverrides,
): LunarCustomDateInput => ({
	kind: 'lunar',
	lunarMonth: item.lunarMonth,
	lunarDay: item.lunarDay,
	title: item.title,
	description: item.description,
	...icsFields(item),
});

const notificationsFromCart = (
	cart: CartRule[],
	yearRange: CustomYearRange,
): LunarDateNotification[] => {
	const customInputs: LunarCustomDateInput[] = [];
	const catalogInputs: LunarCustomDateInput[] = [];
	const monthly: Record<MonthlyEventId, boolean> = {
		chuyi: false,
		shiwu: false,
	};
	const monthlyOverrides: Partial<Record<MonthlyEventId, IcsEventOverrides>> =
		{};

	for (const item of cart) {
		if (item.kind === 'custom') {
			customInputs.push(toCustomInput(item));
			continue;
		}

		if (item.kind === 'monthly') {
			monthly[item.monthlyId] = true;
			monthlyOverrides[item.monthlyId] = icsFields(item);
			continue;
		}

		const festival = festivalById.get(item.catalogId);
		if (festival) {
			catalogInputs.push(
				toCustomInput({
					lunarMonth: festival.lunarMonth,
					lunarDay: festival.lunarDay,
					title: festival.title,
					...icsFields(item),
				}),
			);
		}
	}

	return [
		...collectCustomNotifications(
			[...customInputs, ...catalogInputs],
			yearRange,
		),
		...expandMonthlyEvents(yearRange, monthly, monthlyOverrides),
	];
};

export { notificationsFromCart };
