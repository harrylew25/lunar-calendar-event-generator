import {
	collectCustomNotifications,
	resolveStartLunarYearFromGregorian,
} from '@lunar-dates';
import type {
	LunarCustomDateInput,
	LunarDateNotification,
} from '@lunar-dates/lunar-dates.type';
import { create } from 'zustand';

type WizardStep = 'select' | 'cart' | 'preview';

type CartItem = {
	id: string;
	lunarMonth: number;
	lunarDay: number;
	title: string;
};

type CartItemInput = Omit<CartItem, 'id'>;

type CalendarStore = {
	step: WizardStep;
	loopYears: number;
	startYear: number;
	cart: CartItem[];
	expandedEvents: LunarDateNotification[] | null;

	setStep: (step: WizardStep) => void;
	setLoopYears: (loopYears: number) => void;
	setStartYear: (startYear: number) => void;
	addItem: (item: CartItemInput) => void;
	updateItem: (id: string, patch: Partial<CartItemInput>) => void;
	removeItem: (id: string) => void;
	confirmAndExpand: () => void;
	clearAll: () => void;
};

const DEFAULT_LOOP_YEARS = 100;

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
});

const useCalendarStore = create<CalendarStore>((set, get) => ({
	step: 'select',
	startYear: new Date().getFullYear(),
	loopYears: DEFAULT_LOOP_YEARS,
	cart: [],
	expandedEvents: null,

	setStep: (step) => set({ step }),
	setStartYear: (startYear) => set({ startYear }),
	setLoopYears: (loopYears) => set({ loopYears }),

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
		const { cart, loopYears, startYear } = get();
		if (cart.length === 0) {
			return;
		}
		const resolvedStartYear = resolveStartLunarYearFromGregorian(
			startYear,
		);
		const expandedEvents = collectCustomNotifications(
			cart.map(toCustomDateInput),
			{ startYear: resolvedStartYear, numberOfYears: loopYears },
		);

		set({ expandedEvents, step: 'preview' });
	},

	clearAll: () => {
		set({ cart: [], expandedEvents: null });
	},
}));

export type { CartItem, CartItemInput, WizardStep };
export { DEFAULT_LOOP_YEARS, useCalendarStore };
