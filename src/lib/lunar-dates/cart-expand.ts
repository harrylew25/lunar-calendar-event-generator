import { FESTIVALS } from './constants';
import {
	collectCustomNotifications,
	expandMonthlyEvents,
} from './custom-dates';
import type {
	CartRule,
	CustomYearRange,
	LunarCustomDateInput,
	LunarDateNotification,
	MonthlyEventId,
} from './lunar-dates.type';

const festivalById = new Map(
	FESTIVALS.map((festival) => [festival.id, festival] as const),
);

const toCustomInput = (item: {
	lunarMonth: number;
	lunarDay: number;
	title: string;
	description?: string;
}): LunarCustomDateInput => ({
	kind: 'lunar',
	lunarMonth: item.lunarMonth,
	lunarDay: item.lunarDay,
	title: item.title,
	description: item.description,
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

	for (const item of cart) {
		if (item.kind === 'custom') {
			customInputs.push(toCustomInput(item));
			continue;
		}

		if (item.kind === 'monthly') {
			monthly[item.monthlyId] = true;
			continue;
		}

		const festival = festivalById.get(item.catalogId);
		if (festival) {
			catalogInputs.push(toCustomInput(festival));
		}
	}

	return [
		...collectCustomNotifications(
			[...customInputs, ...catalogInputs],
			yearRange,
		),
		...expandMonthlyEvents(yearRange, monthly),
	];
};

export { notificationsFromCart };
