import { afterEach, beforeEach, describe, expect, jest, test } from 'bun:test';
import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { useDebounce } from '@/hooks/useDebounce';

const DELAY_IN_MS = 20;

describe('useDebounce', () => {
	beforeEach(() => {
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	test('returns the current value immediately', () => {
		const { result } = renderHook(() => useDebounce('正月十五', DELAY_IN_MS));

		expect(result.current).toBe('正月十五');
	});

	test('updates to the latest value after the delay', () => {
		const { result, rerender } = renderHook(
			({ value }) => useDebounce(value, DELAY_IN_MS),
			{ initialProps: { value: '初一' } },
		);

		rerender({ value: '十五' });
		expect(result.current).toBe('初一');

		act(() => {
			jest.advanceTimersByTime(DELAY_IN_MS);
		});

		expect(result.current).toBe('十五');
	});

	test('keeps the last settled value when the input changes again before the delay', () => {
		const { result, rerender } = renderHook(
			({ value }) => useDebounce(value, DELAY_IN_MS),
			{ initialProps: { value: 1 } },
		);

		rerender({ value: 2 });
		act(() => {
			jest.advanceTimersByTime(DELAY_IN_MS / 2);
		});
		rerender({ value: 3 });

		expect(result.current).toBe(1);

		act(() => {
			jest.advanceTimersByTime(DELAY_IN_MS);
		});

		expect(result.current).toBe(3);
	});
});
