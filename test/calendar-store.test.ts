import { beforeEach, describe, expect, test } from 'bun:test';
import { useCalendarStore } from '@/store/calendar-store';

const resetStore = (): void => {
	useCalendarStore.setState({
		step: 'select',
		loopYears: 100,
		cart: [],
		expandedEvents: null,
	});
};

describe('useCalendarStore', () => {
	beforeEach(() => {
		resetStore();
	});

	test('addItem merges duplicates with same lunarMonth, lunarDay, and title', () => {
		const item = {
			lunarMonth: 1,
			lunarDay: 15,
			title: '正月十五',
			description: '',
		};
		useCalendarStore.getState().addItem(item);
		useCalendarStore.getState().addItem(item);

		expect(useCalendarStore.getState().cart).toHaveLength(1);
	});

	test('addItem allows same lunar date with different titles', () => {
		useCalendarStore.getState().addItem({
			lunarMonth: 1,
			lunarDay: 15,
			title: 'Event A',
			description: '',
		});
		useCalendarStore.getState().addItem({
			lunarMonth: 1,
			lunarDay: 15,
			title: 'Event B',
			description: '',
		});

		expect(useCalendarStore.getState().cart).toHaveLength(2);
	});

	test('confirmAndExpand sets expandedEvents and moves to preview', () => {
		useCalendarStore.getState().addItem({
			lunarMonth: 1,
			lunarDay: 15,
			title: '正月十五',
			description: '',
		});
		useCalendarStore.getState().confirmAndExpand();

		const state = useCalendarStore.getState();
		expect(state.step).toBe('preview');
		expect(state.expandedEvents?.length).toBeGreaterThan(0);
		expect(
			state.expandedEvents?.every((event) => event.type === 'custom'),
		).toBe(true);
	});

	test('confirmAndExpand does nothing when cart is empty', () => {
		useCalendarStore.getState().confirmAndExpand();

		const state = useCalendarStore.getState();
		expect(state.step).toBe('select');
		expect(state.expandedEvents).toBeNull();
	});

	test('setMonthlyEvent adds one monthly cart row and ignores a second check', () => {
		const { setMonthlyEvent } = useCalendarStore.getState();
		setMonthlyEvent('chuyi', true);
		setMonthlyEvent('chuyi', true);

		const cart = useCalendarStore.getState().cart;
		expect(cart).toHaveLength(1);
		expect(cart[0]).toMatchObject({ kind: 'monthly', monthlyId: 'chuyi' });
	});

	test('setMonthlyEvent false or removeItem drops the monthly row', () => {
		useCalendarStore.getState().setMonthlyEvent('chuyi', true);
		useCalendarStore.getState().setMonthlyEvent('chuyi', false);
		expect(useCalendarStore.getState().cart).toHaveLength(0);

		useCalendarStore.getState().setMonthlyEvent('chuyi', true);
		const rowId = useCalendarStore.getState().cart[0]?.id;
		expect(rowId).toBeDefined();
		if (!rowId) {
			return;
		}
		useCalendarStore.getState().removeItem(rowId);
		expect(useCalendarStore.getState().cart).toHaveLength(0);
	});

	test('setCatalogItem adds one catalog cart row and ignores a second check', () => {
		const { setCatalogItem } = useCalendarStore.getState();
		setCatalogItem('duanwu', true);
		setCatalogItem('duanwu', true);

		const cart = useCalendarStore.getState().cart;
		expect(cart).toHaveLength(1);
		expect(cart[0]).toMatchObject({ kind: 'catalog', catalogId: 'duanwu' });
	});

	test('confirmAndExpand with only 初一 reaches preview with chuyi events', () => {
		useCalendarStore.getState().setMonthlyEvent('chuyi', true);
		useCalendarStore.getState().confirmAndExpand();

		const state = useCalendarStore.getState();
		expect(state.step).toBe('preview');
		expect(state.expandedEvents?.length).toBeGreaterThan(0);
		expect(state.expandedEvents?.some((event) => event.type === 'chuyi')).toBe(
			true,
		);
	});

	test('confirmAndExpand with only 端午 has custom titles and no chuyi', () => {
		useCalendarStore.getState().setCatalogItem('duanwu', true);
		useCalendarStore.getState().confirmAndExpand();

		const state = useCalendarStore.getState();
		expect(state.step).toBe('preview');
		expect(
			state.expandedEvents?.every((event) => event.type === 'custom'),
		).toBe(true);
		expect(
			state.expandedEvents?.some((event) => event.title === '端午节'),
		).toBe(true);
		expect(state.expandedEvents?.some((event) => event.type === 'chuyi')).toBe(
			false,
		);
	});

	test('updateItem patches ICS fields on a custom item', () => {
		useCalendarStore.getState().addItem({
			lunarMonth: 1,
			lunarDay: 15,
			title: '正月十五',
			description: '',
		});
		const id = useCalendarStore.getState().cart[0]?.id;
		expect(id).toBeDefined();
		if (!id) {
			return;
		}

		useCalendarStore.getState().updateItem(id, {
			location: 'Temple',
			alarmDaysBefore: 14,
			visibility: 'PRIVATE',
		});

		expect(useCalendarStore.getState().cart[0]).toMatchObject({
			kind: 'custom',
			title: '正月十五',
			location: 'Temple',
			alarmDaysBefore: 14,
			visibility: 'PRIVATE',
		});
	});

	test('updateItem patches ICS fields on monthly and catalog items', () => {
		useCalendarStore.getState().setMonthlyEvent('chuyi', true);
		useCalendarStore.getState().setCatalogItem('duanwu', true);
		const [monthly, catalog] = useCalendarStore.getState().cart;
		expect(monthly?.id).toBeDefined();
		expect(catalog?.id).toBeDefined();
		if (!monthly || !catalog) {
			return;
		}

		useCalendarStore.getState().updateItem(monthly.id, {
			location: 'Home altar',
			timeTransparent: 'OPAQUE',
		});
		useCalendarStore.getState().updateItem(catalog.id, {
			location: 'Riverside',
			visibility: 'PRIVATE',
		});

		const cart = useCalendarStore.getState().cart;
		expect(cart[0]).toMatchObject({
			kind: 'monthly',
			monthlyId: 'chuyi',
			location: 'Home altar',
			timeTransparent: 'OPAQUE',
		});
		expect(cart[1]).toMatchObject({
			kind: 'catalog',
			catalogId: 'duanwu',
			location: 'Riverside',
			visibility: 'PRIVATE',
		});
	});

	test('updateItem ignores identity patches on monthly and catalog items', () => {
		useCalendarStore.getState().setMonthlyEvent('chuyi', true);
		const id = useCalendarStore.getState().cart[0]?.id;
		expect(id).toBeDefined();
		if (!id) {
			return;
		}

		useCalendarStore.getState().updateItem(id, {
			title: 'Should not copy',
			lunarMonth: 5,
			lunarDay: 5,
			description: 'nope',
			location: 'Altar',
		});

		const item = useCalendarStore.getState().cart[0];
		expect(item).toMatchObject({
			kind: 'monthly',
			monthlyId: 'chuyi',
			location: 'Altar',
		});
		expect(item).not.toHaveProperty('title');
		expect(item).not.toHaveProperty('lunarMonth');
		expect(item).not.toHaveProperty('description');
	});

	test('confirmAndExpand applies stored ICS overrides to every occurrence', () => {
		useCalendarStore.getState().addItem({
			lunarMonth: 1,
			lunarDay: 15,
			title: '正月十五',
			description: '',
		});
		const id = useCalendarStore.getState().cart[0]?.id;
		expect(id).toBeDefined();
		if (!id) {
			return;
		}

		useCalendarStore.getState().updateItem(id, {
			location: 'Temple',
			alarmDaysBefore: 14,
			timeTransparent: 'OPAQUE',
			visibility: 'PRIVATE',
		});
		useCalendarStore.getState().confirmAndExpand();

		const events = useCalendarStore.getState().expandedEvents;
		expect(events?.length).toBeGreaterThan(0);
		expect(
			events?.every(
				(event) =>
					event.icsOverrides?.location === 'Temple' &&
					event.icsOverrides.alarmDaysBefore === 14 &&
					event.icsOverrides.timeTransparent === 'OPAQUE' &&
					event.icsOverrides.visibility === 'PRIVATE',
			),
		).toBe(true);
	});
});
