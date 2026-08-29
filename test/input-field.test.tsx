import { afterEach, describe, expect, mock, test } from 'bun:test';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { act } from 'react';
import InputField from '@/components/form/input-field';

const DELAY_IN_MS = 20;

const renderTitleField = (
	overrides: Partial<{
		value: string;
		onChange: (value: string) => void;
		type: 'text' | 'textarea';
		className: string;
	}> = {},
) => {
	const onChange = overrides.onChange ?? mock((_: string) => {});
	render(
		<InputField
			id="event-title"
			label="Title"
			value={overrides.value ?? ''}
			type={overrides.type ?? 'text'}
			onChange={onChange}
			delayInMs={DELAY_IN_MS}
			className={overrides.className}
		/>,
	);
	return { onChange, input: screen.getByLabelText('Title') };
};

afterEach(() => {
	cleanup();
});

describe('InputField', () => {
	test('does not notify the parent on mount', async () => {
		const onChange = mock((_: string) => {});
		renderTitleField({ value: '正月十五', onChange });

		await act(async () => {
			await Bun.sleep(DELAY_IN_MS + 10);
		});

		expect(onChange).not.toHaveBeenCalled();
	});

	test('shows typed text immediately without notifying the parent', () => {
		const { onChange, input } = renderTitleField();

		fireEvent.change(input, { target: { value: '十五' } });

		expect((input as HTMLInputElement).value).toBe('十五');
		expect(onChange).not.toHaveBeenCalled();
	});

	test('notifies the parent with the latest text after the delay', async () => {
		const { onChange, input } = renderTitleField();

		fireEvent.change(input, { target: { value: '十五' } });
		await act(async () => {
			await Bun.sleep(DELAY_IN_MS + 10);
		});

		expect(onChange).toHaveBeenCalledTimes(1);
		expect(onChange).toHaveBeenCalledWith('十五');
	});

	test('shows the parent value when it changes from outside', () => {
		const onChange = mock((_: string) => {});
		const { rerender } = render(
			<InputField
				id="event-title"
				label="Title"
				value="初一"
				type="text"
				onChange={onChange}
				delayInMs={DELAY_IN_MS}
			/>,
		);

		rerender(
			<InputField
				id="event-title"
				label="Title"
				value="十五"
				type="text"
				onChange={onChange}
				delayInMs={DELAY_IN_MS}
			/>,
		);

		expect((screen.getByLabelText('Title') as HTMLInputElement).value).toBe(
			'十五',
		);
	});

	test('renders a textarea when type is textarea', () => {
		const { input } = renderTitleField({ type: 'textarea' });

		expect(input.tagName).toBe('TEXTAREA');
	});

	test('does not set class to the string undefined when className is omitted', () => {
		const { container } = render(
			<InputField
				id="event-title"
				label="Title"
				value=""
				type="text"
				onChange={mock((_: string) => {})}
			/>,
		);

		expect(container.firstElementChild?.className).not.toContain('undefined');
	});
});
