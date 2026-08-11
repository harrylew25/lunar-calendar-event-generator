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
		const item = { lunarMonth: 1, lunarDay: 15, title: '正月十五' };
		useCalendarStore.getState().addItem(item);
		useCalendarStore.getState().addItem(item);

		expect(useCalendarStore.getState().cart).toHaveLength(1);
	});

	test('addItem allows same lunar date with different titles', () => {
		useCalendarStore.getState().addItem({
			lunarMonth: 1,
			lunarDay: 15,
			title: 'Event A',
		});
		useCalendarStore.getState().addItem({
			lunarMonth: 1,
			lunarDay: 15,
			title: 'Event B',
		});

		expect(useCalendarStore.getState().cart).toHaveLength(2);
	});

	test('confirmAndExpand sets expandedEvents and moves to preview', () => {
		useCalendarStore.getState().addItem({
			lunarMonth: 1,
			lunarDay: 15,
			title: '正月十五',
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
});
