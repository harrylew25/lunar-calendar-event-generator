import { afterEach, describe, expect, test } from 'bun:test';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import DatePickerInput from '@/components/ui/date-picker';
import { I18nProvider } from '@/lib/i18n/I18nProvider';

const DatePickerHarness = ({
	initialValue = '',
}: {
	initialValue?: string;
}) => {
	const [value, setValue] = useState(initialValue);
	return (
		<I18nProvider>
			<DatePickerInput value={value} onChange={setValue} />
		</I18nProvider>
	);
};

const dateInput = (): HTMLInputElement =>
	screen.getByLabelText('Solar Date') as HTMLInputElement;

afterEach(() => {
	cleanup();
});

describe('DatePickerInput', () => {
	test('inserts dashes as digits are typed', () => {
		render(<DatePickerHarness />);
		const input = dateInput();

		fireEvent.change(input, { target: { value: '20251', selectionStart: 5 } });
		expect(input.value).toBe('2025-1');

		fireEvent.change(input, { target: { value: '202511', selectionStart: 6 } });
		expect(input.value).toBe('2025-11');

		fireEvent.change(input, {
			target: { value: '20251112', selectionStart: 8 },
		});
		expect(input.value).toBe('2025-11-12');
	});

	test('drops digits past the day', () => {
		render(<DatePickerHarness />);
		const input = dateInput();

		fireEvent.change(input, {
			target: { value: '2025111299', selectionStart: 10 },
		});

		expect(input.value).toBe('2025-11-12');
	});

	test('shows a compact parent value with dashes', () => {
		render(<DatePickerHarness initialValue="20251112" />);

		expect(dateInput().value).toBe('2025-11-12');
	});

	test('keeps the caret after the digit just typed', () => {
		render(<DatePickerHarness initialValue="2025-11-12" />);
		const input = dateInput();

		fireEvent.change(input, {
			target: { value: '20259-11-12', selectionStart: 5 },
		});

		expect(input.value).toBe('2025-91-11');
		expect(input.selectionStart).toBe(6);
	});
});
