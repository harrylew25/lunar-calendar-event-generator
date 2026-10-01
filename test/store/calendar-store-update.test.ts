import { beforeEach, describe, expect, mock, test } from 'bun:test';

const toastError = mock((): number => 1);
const toastOk = (): number => 1;
mock.module('sonner', () => ({
	toast: { error: toastError, success: toastOk, warning: toastOk },
}));

const { useCalendarStore } = await import('@/store/calendar-store');

describe('useCalendarStore updateItem', () => {
	beforeEach(() => {
		toastError.mockClear();
		useCalendarStore.setState({
			step: 'select',
			loopYears: 100,
			cart: [],
			expandedEvents: null,
		});
	});

	test('rejects a duplicate custom rule and returns false', () => {
		const { addItem, updateItem } = useCalendarStore.getState();
		addItem({ lunarMonth: 1, lunarDay: 15, title: 'A', description: '' });
		addItem({ lunarMonth: 2, lunarDay: 2, title: 'B', description: 'kept' });
		const id = useCalendarStore.getState().cart[1]?.id ?? '';
		const updated = updateItem(id, {
			lunarMonth: 1,
			lunarDay: 15,
			title: 'A',
		});

		expect(updated).toBe(false);
		expect(useCalendarStore.getState().cart[1]).toMatchObject({
			title: 'B',
			lunarMonth: 2,
			lunarDay: 2,
		});
		expect(toastError).toHaveBeenCalledWith('Duplicate event in cart', {
			description:
				'There is already an event with the same lunar date and title in the cart.',
		});
	});

	test('returns false when the cart item does not exist', () => {
		const updated = useCalendarStore
			.getState()
			.updateItem('missing-item', { title: 'Missing' });

		expect(updated).toBe(false);
	});

	test('patches ICS fields on a custom item and returns true', () => {
		useCalendarStore.getState().addItem({
			lunarMonth: 1,
			lunarDay: 15,
			title: '正月十五',
			description: '',
		});
		const id = useCalendarStore.getState().cart[0]?.id ?? '';
		const updated = useCalendarStore.getState().updateItem(id, {
			location: 'Temple',
			alarmDaysBefore: 14,
			visibility: 'PRIVATE',
		});

		expect(updated).toBe(true);
		expect(useCalendarStore.getState().cart[0]).toMatchObject({
			kind: 'custom',
			title: '正月十五',
			location: 'Temple',
			alarmDaysBefore: 14,
			visibility: 'PRIVATE',
		});
	});

	test('patches ICS fields on monthly and catalog items', () => {
		useCalendarStore.getState().setMonthlyEvent('chuyi', true);
		useCalendarStore.getState().setCatalogItem('duanwu', true);
		const [monthly, catalog] = useCalendarStore.getState().cart;
		if (!monthly || !catalog) {
			throw new Error('Expected monthly and catalog cart items');
		}

		expect(
			useCalendarStore.getState().updateItem(monthly.id, {
				location: 'Home altar',
				timeTransparent: 'OPAQUE',
			}),
		).toBe(true);
		expect(
			useCalendarStore.getState().updateItem(catalog.id, {
				location: 'Riverside',
				visibility: 'PRIVATE',
			}),
		).toBe(true);

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

	test('ignores identity patches on monthly and catalog items', () => {
		useCalendarStore.getState().setMonthlyEvent('chuyi', true);
		const id = useCalendarStore.getState().cart[0]?.id ?? '';

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
});
