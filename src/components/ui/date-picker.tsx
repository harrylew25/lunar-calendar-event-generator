import { format, isValid, parse } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import {
	type ChangeEvent,
	type KeyboardEvent,
	type ReactElement,
	useLayoutEffect,
	useRef,
	useState,
} from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from '@/components/ui/input-group';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { useT } from '@/lib/i18n/I18nProvider';

const formatDate = (date?: Date): string =>
	date ? format(date, 'yyyy-MM-dd') : '';

/** Keep up to 8 digits and insert YYYY-MM-DD separators as they are typed. */
const formatDateInput = (raw: string): string => {
	const digits = raw.replace(/\D/g, '').slice(0, 8);
	if (digits.length <= 4) {
		return digits;
	}
	if (digits.length <= 6) {
		return `${digits.slice(0, 4)}-${digits.slice(4)}`;
	}
	return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6)}`;
};

const caretAfterDigitCount = (
	formatted: string,
	digitCount: number,
): number => {
	if (digitCount <= 0) {
		return 0;
	}
	let seen = 0;
	for (let index = 0; index < formatted.length; index++) {
		const char = formatted[index];
		if (char !== undefined && char >= '0' && char <= '9') {
			seen += 1;
			if (seen === digitCount) {
				return index + 1;
			}
		}
	}
	return formatted.length;
};

interface DatePickerInputProps {
	value?: string;
	onChange?: (value: string) => void;
	error?: string | null;
}

const DatePickerInput = ({
	value = '',
	onChange,
	error,
}: DatePickerInputProps): ReactElement => {
	const t = useT();
	const inputRef = useRef<HTMLInputElement>(null);
	const pendingCaretDigits = useRef<number | null>(null);
	const [open, setOpen] = useState(false);
	const [month, setMonth] = useState<Date | undefined>(new Date());
	const displayValue = formatDateInput(value);

	const parsed = parse(displayValue, 'yyyy-MM-dd', new Date());
	const selected = isValid(parsed) ? parsed : undefined;

	useLayoutEffect(() => {
		const input = inputRef.current;
		const digitCount = pendingCaretDigits.current;
		if (!input || digitCount === null) {
			return;
		}
		const nextCaret = caretAfterDigitCount(displayValue, digitCount);
		input.setSelectionRange(nextCaret, nextCaret);
		pendingCaretDigits.current = null;
	}, [displayValue]);

	const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
		const raw = e.target.value;
		const caret = e.target.selectionStart ?? raw.length;
		const digitCount = raw.slice(0, caret).replace(/\D/g, '').length;
		const currentValue = formatDateInput(raw);

		const currentDateParsed = parse(currentValue, 'yyyy-MM-dd', new Date());
		if (isValid(currentDateParsed)) {
			setMonth(currentDateParsed);
		}

		if (currentValue === value) {
			e.target.value = currentValue;
			const nextCaret = caretAfterDigitCount(currentValue, digitCount);
			e.target.setSelectionRange(nextCaret, nextCaret);
			return;
		}

		pendingCaretDigits.current = digitCount;
		onChange?.(currentValue);
	};

	const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			setOpen(true);
		}
	};

	const handleSelect = (date: Date) => {
		setMonth(date);
		onChange?.(formatDate(date));
		setOpen(false);
	};

	return (
		<Field className="my-2" data-invalid={error ? 'true' : undefined}>
			<FieldLabel htmlFor="date-required">{t('solarDate')}</FieldLabel>
			<InputGroup>
				<InputGroupInput
					ref={inputRef}
					id="date-required"
					value={displayValue}
					placeholder="YYYY-MM-DD"
					inputMode="numeric"
					autoComplete="off"
					autoCorrect="off"
					autoCapitalize="off"
					spellCheck={false}
					onChange={handleChange}
					onKeyDown={handleKeyDown}
					aria-invalid={error ? 'true' : undefined}
				/>
				<InputGroupAddon align="inline-end">
					<Popover open={open} onOpenChange={setOpen}>
						<PopoverTrigger asChild>
							<InputGroupButton
								id="date-picker"
								variant="ghost"
								size="icon-xs"
								aria-label={t('selectDate')}>
								<CalendarIcon />
								<span className="sr-only">{t('selectDate')}</span>
							</InputGroupButton>
						</PopoverTrigger>

						<PopoverContent
							className="w-auto overflow-hidden p-0"
							align="end"
							alignOffset={-8}
							sideOffset={10}>
							<Calendar
								mode="single"
								required
								selected={selected}
								month={month}
								onMonthChange={setMonth}
								onSelect={handleSelect}
							/>
						</PopoverContent>
					</Popover>
				</InputGroupAddon>
			</InputGroup>
			{error && <FieldError>{error}</FieldError>}
		</Field>
	);
};

export default DatePickerInput;
