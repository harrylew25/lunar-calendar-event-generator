import {
	CALENDAR_DEFAULTS,
	collectCustomNotifications,
	expandMonthlyEvents,
} from '@lunar-dates';
import type {
	LunarCustomDateInput,
	LunarDateNotification,
	MonthlyEventId,
} from '@lunar-dates/lunar-dates.type';
import { create } from 'zustand';

type WizardStep = 'select' | 'cart' | 'preview';

type CartItem = {
	id: string;
	lunarMonth: number;
	lunarDay: number;
	title: string;
	description: string;
};

type CartItemInput = Omit<CartItem, 'id'>;

const INITIAL_MONTHLY_EVENTS: Record<MonthlyEventId, boolean> = {
	chuyi: false,
	shiwu: false,
};

type CalendarStore = {
	step: WizardStep;
	loopYears: number;
	startYear: number;
	cart: CartItem[];
	expandedEvents: LunarDateNotification[] | null;
	monthlyEvents: Record<MonthlyEventId, boolean>;

	setStep: (step: WizardStep) => void;
	setLoopYears: (loopYears: number) => void;
	setStartYear: (startYear: number) => void;
	addItem: (item: CartItemInput) => void;
	updateItem: (id: string, patch: Partial<CartItemInput>) => void;
	removeItem: (id: string) => void;
	confirmAndExpand: () => void;
	clearAll: () => void;
	setMonthlyEvent: (id: MonthlyEventId, includes: boolean) => void;
};

const isDuplicate = (cart: CartItem[], item: CartItemInput): boolean => {
	return cart.some(
		(existing) =>
			existing.lunarMonth === item.lunarMonth &&
			existing.lunarDay === item.lunarDay &&
			existing.title === item.title,
	);
};

const toCustomDateInput = (item: CartItem): LunarCustomDateInput => ({
	kind: 'lunar',
	lunarMonth: item.lunarMonth,
	lunarDay: item.lunarDay,
	title: item.title,
	description: item.description,
});

export const useCalendarStore = create<CalendarStore>((set, get) => ({
	step: 'select',
	startYear: CALENDAR_DEFAULTS.startYear,
	loopYears: CALENDAR_DEFAULTS.numberOfYears,
	cart: [],
	expandedEvents: null,
	monthlyEvents: { ...INITIAL_MONTHLY_EVENTS },

	setStep: (step) => set({ step }),
	setStartYear: (startYear) => set({ startYear }),
	setLoopYears: (loopYears) => set({ loopYears }),
	setMonthlyEvent: (id, includes) =>
		set({ monthlyEvents: { ...get().monthlyEvents, [id]: includes } }),
	addItem: (item) => {
		const { cart } = get();
		if (isDuplicate(cart, item)) {
			return;
		}
		set({
			cart: [...cart, { ...item, id: crypto.randomUUID() }],
		});
	},

	updateItem: (id, patch) => {
		const { cart } = get();
		const index = cart.findIndex((item) => item.id === id);
		if (index === -1) {
			return;
		}

		const updated = { ...cart[index], ...patch } as CartItem;
		const withoutSelf = cart.filter((item) => item.id !== id);
		if (isDuplicate(withoutSelf, updated)) {
			return;
		}

		const next = [...cart];
		next[index] = updated;
		set({ cart: next });
	},

	removeItem: (id) => {
		set({ cart: get().cart.filter((item) => item.id !== id) });
	},

	confirmAndExpand: () => {
		const { cart, loopYears: numberOfYears, startYear, monthlyEvents } = get();
		const hasBulk = monthlyEvents.chuyi || monthlyEvents.shiwu;
		if (cart.length === 0 && !hasBulk) {
			return;
		}

		const yearRange = { startYear, numberOfYears };
		const expandedEvents = [
			...collectCustomNotifications(cart.map(toCustomDateInput), yearRange),
			...expandMonthlyEvents(yearRange, monthlyEvents),
		];

		set({ expandedEvents, step: 'preview' });
	},

	clearAll: () => {
		set({
			cart: [],
			expandedEvents: null,
			monthlyEvents: { ...INITIAL_MONTHLY_EVENTS },
		});
	},
}));

export type { CartItem, CartItemInput, WizardStep };
