import { useEffect, useRef, useState } from 'react';
import { useDebounce } from './useDebounce';

type DebouncedControlledInput = {
	localValue: string;
	setLocalValue: (next: string) => void;
};

export const useDebouncedControlledInput = (
	value: string,
	onChange: (value: string) => void,
	delayInMs: number,
): DebouncedControlledInput => {
	const [localValue, setLocalValue] = useState(value);
	const debouncedValue = useDebounce(localValue, delayInMs);
	const parentValueRef = useRef(value);
	parentValueRef.current = value;

	useEffect(() => {
		setLocalValue(value);
	}, [value]);

	useEffect(() => {
		if (debouncedValue === parentValueRef.current) {
			return;
		}
		onChange(debouncedValue);
	}, [debouncedValue, onChange]);

	return { localValue, setLocalValue };
};
