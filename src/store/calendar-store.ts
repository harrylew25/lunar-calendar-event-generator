import { CALENDAR_DEFAULTS, notificationsFromCart } from '@lunar-dates';
import type { FestivalId } from '@lunar-dates/constants';
import type {
	CatalogCartRule,
	CustomCartRule,
	IcsEventOverrides,
	LunarDateNotification,
	MonthlyCartRule,
	MonthlyEventId,
} from '@lunar-dates/lunar-dates.type';
import { create } from 'zustand';

type WizardStep = 'select' | 'cart' | 'preview';

type CustomCartItem = CustomCartRule & { id: string };
type MonthlyCartItem = MonthlyCartRule & { id: string };
type CatalogCartItem = CatalogCartRule & { id: string };
type CartItem = CustomCartItem | MonthlyCartItem | CatalogCartItem;
type CartItemInput = Omit<CustomCartItem, 'id' | 'kind'>;

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
	setMonthlyEvent: (id: MonthlyEventId, included: boolean) => void;
	setCatalogItem: (id: FestivalId, included: boolean) => void;
};

const isCustomItem = (item: CartItem): item is CustomCartItem =>
	item.kind === 'custom';

const isDuplicate = (cart: CartItem[], item: CartItemInput): boolean => {
	return cart
		.filter(isCustomItem)
		.some(
			(existing) =>
				existing.lunarMonth === item.lunarMonth &&
				existing.lunarDay === item.lunarDay &&
				existing.title === item.title,
		);
};

const assignIfPresent = <K extends keyof IcsEventOverrides>(
	patch: Partial<CartItemInput>,
	key: K,
	overrides: IcsEventOverrides,
): void => {
	if (Object.hasOwn(patch, key)) {
		overrides[key] = patch[key];
	}
};

const ICS_KEYS = [
	'location',
	'alarmDaysBefore',
	'alarmHour',
	'alarmMinute',
	'timeTransparent',
	'visibility',
] as const satisfies readonly (keyof IcsEventOverrides)[];

const pickIcsPatch = (patch: Partial<CartItemInput>): IcsEventOverrides => {
	const overrides: IcsEventOverrides = {};
	ICS_KEYS.forEach((key) => {
		assignIfPresent(patch, key, overrides);
	});
	return overrides;
};

const toCartRule = ({ id: _id, ...rule }: CartItem) => rule;

export const useCalendarStore = create<CalendarStore>((set, get) => ({
	step: 'select',
	startYear: CALENDAR_DEFAULTS.startYear,
	loopYears: CALENDAR_DEFAULTS.numberOfYears,
	cart: [],
	expandedEvents: null,

	setStep: (step) => set({ step }),
	setStartYear: (startYear) => set({ startYear }),
	setLoopYears: (loopYears) => set({ loopYears }),

	setMonthlyEvent: (id, included) => {
		const { cart } = get();
		const withoutId = cart.filter(
			(item) => !(item.kind === 'monthly' && item.monthlyId === id),
		);
		if (!included) {
			set({ cart: withoutId });
			return;
		}
		if (withoutId.length !== cart.length) {
			return;
		}
		set({
			cart: [
				...cart,
				{ kind: 'monthly', monthlyId: id, id: crypto.randomUUID() },
			],
		});
	},

	setCatalogItem: (id, included) => {
		const { cart } = get();
		const withoutId = cart.filter(
			(item) => !(item.kind === 'catalog' && item.catalogId === id),
		);
		if (!included) {
			set({ cart: withoutId });
			return;
		}
		if (withoutId.length !== cart.length) {
			return;
		}
		set({
			cart: [
				...cart,
				{ kind: 'catalog', catalogId: id, id: crypto.randomUUID() },
			],
		});
	},

	addItem: (item) => {
		const { cart } = get();
		if (isDuplicate(cart, item)) {
			return;
		}
		set({
			cart: [...cart, { ...item, kind: 'custom', id: crypto.randomUUID() }],
		});
	},

	updateItem: (id, patch) => {
		const { cart } = get();
		const index = cart.findIndex((item) => item.id === id);
		const current = cart[index];
		if (index === -1 || !current) {
			return;
		}

		if (current.kind !== 'custom') {
			const next = [...cart];
			next[index] = { ...current, ...pickIcsPatch(patch) };
			set({ cart: next });
			return;
		}

		const updated: CustomCartItem = { ...current, ...patch };
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
		const { cart, loopYears: numberOfYears, startYear } = get();
		if (cart.length === 0) {
			return;
		}

		set({
			expandedEvents: notificationsFromCart(cart.map(toCartRule), {
				startYear,
				numberOfYears,
			}),
			step: 'preview',
		});
	},

	clearAll: () => {
		set({
			cart: [],
			expandedEvents: null,
		});
	},
}));

export type {
	CartItem,
	CartItemInput,
	CatalogCartItem,
	CustomCartItem,
	MonthlyCartItem,
	WizardStep,
};
