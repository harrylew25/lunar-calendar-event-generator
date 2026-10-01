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
import { toast } from 'sonner';
import { create } from 'zustand';
import { ICS_KEYS } from '@/lib/ics/constants';
import { assignIfPresent } from '@/lib/utils';

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

const pickIcsPatch = (patch: Partial<CartItemInput>) =>
	ICS_KEYS.reduce<IcsEventOverrides>((acc, key) => {
		assignIfPresent(patch, key, acc);
		return acc;
	}, {});

const toCartRule = ({ id: _id, ...rule }: CartItem) => rule;

type RowKind =
	| { kind: 'monthly'; monthlyId: MonthlyEventId }
	| { kind: 'catalog'; catalogId: FestivalId };

export const useCalendarStore = create<CalendarStore>((set, get) => {
	const setupSetEvent = (included: boolean, row: RowKind) => {
		const { cart } = get();
		const filteredCart = cart.filter((item) => {
			if (row.kind === 'monthly') {
				return !(item.kind === 'monthly' && item.monthlyId === row.monthlyId);
			}
			return !(item.kind === 'catalog' && item.catalogId === row.catalogId);
		});

		if (!included) {
			set({ cart: filteredCart });
			return;
		}

		if (filteredCart.length !== cart.length) {
			return;
		}
		set({ cart: [...cart, { ...row, id: crypto.randomUUID() }] });
	};

	return {
		step: 'select',
		startYear: CALENDAR_DEFAULTS.startYear,
		loopYears: CALENDAR_DEFAULTS.numberOfYears,
		cart: [],
		expandedEvents: null,

		setStep: (step) => set({ step }),
		setStartYear: (startYear) => set({ startYear }),
		setLoopYears: (loopYears) => set({ loopYears }),

		setMonthlyEvent: (id, included) => {
			setupSetEvent(included, { kind: 'monthly', monthlyId: id });
		},

		setCatalogItem: (id, included) => {
			setupSetEvent(included, { kind: 'catalog', catalogId: id });
		},

		addItem: (item) => {
			const { cart } = get();
			if (isDuplicate(cart, item)) {
				toast.error('Duplicate event added', {
					description:
						'There is already an event with the same lunar date and title.',
				});
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

			const updateCart = (item: CartItem) => {
				const next = [...cart];
				next[index] = item;
				set({ cart: next });
			};

			if (current.kind !== 'custom') {
				updateCart({ ...current, ...pickIcsPatch(patch) });
				return;
			}

			const updated: CustomCartItem = { ...current, ...patch };
			const filteredCart = cart.filter((item) => item.id !== id);
			if (isDuplicate(filteredCart, updated)) {
				toast.error('Duplicate event in cart', {
					description:
						'There is already an event with the same lunar date and title in the cart.',
				});
				return;
			}
			updateCart(updated);
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
	};
});

export type {
	CartItem,
	CartItemInput,
	CatalogCartItem,
	CustomCartItem,
	MonthlyCartItem,
	WizardStep,
};
