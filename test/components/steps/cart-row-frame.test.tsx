import { afterEach, beforeEach, describe, expect, test } from 'bun:test';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { act } from 'react';
import CartStep from '@/components/steps/CartStep';
import { useCalendarStore } from '@/store/calendar-store';

const TITLE_DELAY_IN_MS = 300;

const resetStore = (): void => {
	useCalendarStore.setState({
		step: 'cart',
		loopYears: 1,
		cart: [],
		expandedEvents: null,
	});
};

const customItem = () =>
	useCalendarStore.getState().cart.find((item) => item.kind === 'custom');

describe('cart row frame', () => {
	beforeEach(() => {
		resetStore();
		useCalendarStore.getState().addItem({
			lunarMonth: 1,
			lunarDay: 1,
			title: 'Ancestor day',
			description: 'Family visit',
		});
		useCalendarStore.getState().setMonthlyEvent('chuyi', true);
		useCalendarStore.getState().setStep('cart');
	});

	afterEach(() => {
		cleanup();
		resetStore();
	});

	const clickNamedButton = (name: string, index = 0): void => {
		const button = screen.getAllByRole('button', { name })[index];
		if (!button) {
			throw new Error(`Missing ${name} button at index ${index}`);
		}
		fireEvent.click(button);
	};

	test('cancel restores the custom draft and leaves the cart unchanged', async () => {
		render(<CartStep />);

		clickNamedButton('Edit');
		fireEvent.change(screen.getByLabelText('Title'), {
			target: { value: 'Changed day' },
		});
		await act(async () => {
			await Bun.sleep(TITLE_DELAY_IN_MS + 20);
		});
		fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

		expect(screen.queryByLabelText('Title')).toBeNull();
		expect(screen.getByText('Ancestor day')).toBeTruthy();
		expect(customItem()?.kind === 'custom' && customItem()?.title).toBe(
			'Ancestor day',
		);

		clickNamedButton('Edit');
		expect((screen.getByLabelText('Title') as HTMLInputElement).value).toBe(
			'Ancestor day',
		);
	});

	test('save keeps the custom title and closes the dialog', async () => {
		render(<CartStep />);

		clickNamedButton('Edit');
		fireEvent.change(screen.getByLabelText('Title'), {
			target: { value: 'Changed day' },
		});
		await act(async () => {
			await Bun.sleep(TITLE_DELAY_IN_MS + 20);
		});
		fireEvent.click(screen.getByRole('button', { name: 'Save' }));

		expect(screen.queryByLabelText('Title')).toBeNull();
		expect(screen.getByText('Changed day')).toBeTruthy();
		expect(customItem()?.kind === 'custom' && customItem()?.title).toBe(
			'Changed day',
		);

		clickNamedButton('Edit');
		expect((screen.getByLabelText('Title') as HTMLInputElement).value).toBe(
			'Changed day',
		);
	});

	test('rejected duplicate edit keeps the dialog open', async () => {
		useCalendarStore.getState().addItem({
			lunarMonth: 1,
			lunarDay: 1,
			title: 'Other day',
			description: '',
		});
		render(<CartStep />);

		clickNamedButton('Edit', 2);
		fireEvent.change(screen.getByLabelText('Title'), {
			target: { value: 'Ancestor day' },
		});
		await act(async () => {
			await Bun.sleep(TITLE_DELAY_IN_MS + 20);
		});
		fireEvent.click(screen.getByRole('button', { name: 'Save' }));

		const saved = useCalendarStore
			.getState()
			.cart.filter((item) => item.kind === 'custom');
		expect(saved[1]).toMatchObject({
			title: 'Other day',
			lunarMonth: 1,
			lunarDay: 1,
		});
		expect((screen.getByLabelText('Title') as HTMLInputElement).value).toBe(
			'Ancestor day',
		);

		fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
		clickNamedButton('Edit', 2);
		expect((screen.getByLabelText('Title') as HTMLInputElement).value).toBe(
			'Other day',
		);
	});

	test('rejected date-only duplicate keeps the custom draft open', () => {
		useCalendarStore.getState().addItem({
			lunarMonth: 2,
			lunarDay: 2,
			title: 'Ancestor day',
			description: '',
		});
		render(<CartStep />);

		clickNamedButton('Edit', 2);
		const monthSelect = screen.getByLabelText('Lunar month');
		fireEvent.keyDown(monthSelect, { key: 'Enter' });
		fireEvent.click(screen.getByRole('option', { name: '正月' }));
		const daySelect = screen.getByLabelText('Lunar day');
		fireEvent.keyDown(daySelect, { key: 'Enter' });
		fireEvent.click(screen.getByRole('option', { name: '1' }));
		fireEvent.click(screen.getByRole('button', { name: 'Save' }));

		const saved = useCalendarStore
			.getState()
			.cart.filter((item) => item.kind === 'custom');
		expect(saved[1]).toMatchObject({
			title: 'Ancestor day',
			lunarMonth: 2,
			lunarDay: 2,
		});
		expect(screen.getByLabelText('Lunar month')).toBeTruthy();
		expect(screen.getByLabelText('Lunar day')).toBeTruthy();
	});

	test('pick edit cancel leaves the monthly row in place', () => {
		render(<CartStep />);

		clickNamedButton('Edit', 1);
		expect(
			screen.getAllByText('初一 — every lunar month (incl. leap)').length,
		).toBeGreaterThan(1);
		fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

		expect(
			screen.getAllByText('初一 — every lunar month (incl. leap)'),
		).toHaveLength(1);
		expect(useCalendarStore.getState().cart).toHaveLength(2);
	});

	test('delete removes a monthly pick and keeps the custom row', () => {
		render(<CartStep />);

		expect(
			screen.getByText('初一 — every lunar month (incl. leap)'),
		).toBeTruthy();
		clickNamedButton('Delete', 1);

		expect(
			screen.queryByText('初一 — every lunar month (incl. leap)'),
		).toBeNull();
		expect(screen.getByText('Ancestor day').className).toContain('truncate');
		expect(screen.getByText('Family visit').className).toContain(
			'line-clamp-2',
		);
		expect(screen.getByText('Family visit').className).toContain(
			'sm:line-clamp-3',
		);
		expect(useCalendarStore.getState().cart).toHaveLength(1);
	});
});
