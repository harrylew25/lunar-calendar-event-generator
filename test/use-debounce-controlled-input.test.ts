import { describe, expect, mock, test } from 'bun:test';
import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { useDebouncedControlledInput } from '@/hooks/useDebounceControlledInput';

const DELAY_IN_MS = 20;

describe('useDebouncedControlledInput', () => {
	test('returns the parent value immediately', () => {
		const onChange = mock((_: string) => {});
		const { result } = renderHook(() =>
			useDebouncedControlledInput('正月十五', onChange, DELAY_IN_MS),
		);

		expect(result.current.localValue).toBe('正月十五');
		expect(onChange).not.toHaveBeenCalled();
	});

	test('does not notify the parent on mount after the delay', async () => {
		const onChange = mock((_: string) => {});
		renderHook(() =>
			useDebouncedControlledInput('正月十五', onChange, DELAY_IN_MS),
		);

		await act(async () => {
			await Bun.sleep(DELAY_IN_MS + 10);
		});

		expect(onChange).not.toHaveBeenCalled();
	});

	test('updates localValue immediately without notifying the parent', () => {
		const onChange = mock((_: string) => {});
		const { result } = renderHook(() =>
			useDebouncedControlledInput('', onChange, DELAY_IN_MS),
		);

		act(() => {
			result.current.setLocalValue('十五');
		});

		expect(result.current.localValue).toBe('十五');
		expect(onChange).not.toHaveBeenCalled();
	});

	test('notifies the parent with the latest local value after the delay', async () => {
		const onChange = mock((_: string) => {});
		const { result } = renderHook(() =>
			useDebouncedControlledInput('', onChange, DELAY_IN_MS),
		);

		act(() => {
			result.current.setLocalValue('十五');
		});

		await act(async () => {
			await Bun.sleep(DELAY_IN_MS + 10);
		});

		expect(onChange).toHaveBeenCalledTimes(1);
		expect(onChange).toHaveBeenCalledWith('十五');
	});

	test('keeps the last local value when it changes again before the delay', async () => {
		const onChange = mock((_: string) => {});
		const { result } = renderHook(() =>
			useDebouncedControlledInput('', onChange, DELAY_IN_MS),
		);

		act(() => {
			result.current.setLocalValue('初一');
		});
		await act(async () => {
			await Bun.sleep(DELAY_IN_MS / 2);
		});
		act(() => {
			result.current.setLocalValue('十五');
		});

		expect(result.current.localValue).toBe('十五');
		expect(onChange).not.toHaveBeenCalled();

		await act(async () => {
			await Bun.sleep(DELAY_IN_MS + 10);
		});

		expect(onChange).toHaveBeenCalledTimes(1);
		expect(onChange).toHaveBeenCalledWith('十五');
	});

	test('syncs localValue when the parent value changes', () => {
		const onChange = mock((_: string) => {});
		const { result, rerender } = renderHook(
			({ value }) => useDebouncedControlledInput(value, onChange, DELAY_IN_MS),
			{ initialProps: { value: '初一' } },
		);

		rerender({ value: '十五' });

		expect(result.current.localValue).toBe('十五');
	});

	test('does not notify the parent when only the parent value changes', async () => {
		const onChange = mock((_: string) => {});
		const { rerender } = renderHook(
			({ value }) => useDebouncedControlledInput(value, onChange, DELAY_IN_MS),
			{ initialProps: { value: '初一' } },
		);

		rerender({ value: '十五' });

		await act(async () => {
			await Bun.sleep(DELAY_IN_MS + 10);
		});

		expect(onChange).not.toHaveBeenCalled();
	});
});
