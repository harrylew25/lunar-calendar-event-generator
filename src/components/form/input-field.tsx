import type { ChangeEvent, JSX } from 'react';
import { FieldError } from '@/components/ui/field';
import Input from '@/components/ui/input';
import Label from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useDebouncedControlledInput } from '@/hooks/useDebounceControlledInput';
import { cn } from '@/lib/utils';

type InputType =
	| 'text'
	| 'number'
	| 'email'
	| 'password'
	| 'date'
	| 'time'
	| 'datetime-local'
	| 'search'
	| 'tel'
	| 'url'
	| 'textarea';

type InputFieldProps = {
	id: string;
	label: string;
	value: string;
	onChange: (value: string) => void;
	type?: InputType;
	className?: string;
	delayInMs?: number;
	placeholder?: string;
	error?: string | null;
	onBlur?: () => void;
};

const DEFAULT_DELAY_IN_MS = 300;

const InputField = ({
	id,
	label,
	value,
	type = 'text',
	onChange,
	className,
	placeholder,
	onBlur,
	delayInMs = DEFAULT_DELAY_IN_MS,
	error,
}: InputFieldProps): JSX.Element => {
	const { localValue, setLocalValue } = useDebouncedControlledInput(
		value,
		onChange,
		delayInMs,
	);

	const errorId = error ? `${id}-error` : undefined;

	const handleChange = (
		event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	): void => {
		setLocalValue(event.target.value);
	};

	return (
		<div className={cn('space-y-2', className)}>
			<Label htmlFor={id}>{label}</Label>
			{type === 'textarea' ? (
				<Textarea
					id={id}
					value={localValue}
					onChange={handleChange}
					placeholder={placeholder}
					aria-invalid={error ? true : undefined}
					aria-describedby={errorId}
					onBlur={onBlur}
				/>
			) : (
				<>
					<Input
						id={id}
						type={type}
						value={localValue}
						onChange={handleChange}
						placeholder={placeholder}
						aria-invalid={error ? true : undefined}
						aria-describedby={errorId}
						onBlur={onBlur}
					/>
					{error && <FieldError id={errorId}>{error}</FieldError>}
				</>
			)}
		</div>
	);
};

export default InputField;
