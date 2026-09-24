import { format, isValid, parse } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { type ChangeEvent, type KeyboardEvent, useState } from 'react';
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

const formatDate = (date?: Date) => (date ? format(date, 'yyyy-MM-dd') : '');

interface DatePickerInputProps {
	value?: string;
	onChange?: (value: string) => void;
	error?: string | null;
}

const DatePickerInput = ({
	value = '',
	onChange,
	error,
}: DatePickerInputProps) => {
	const [open, setOpen] = useState(false);
	const [month, setMonth] = useState<Date | undefined>(new Date());

	const parsed = parse(value, 'yyyy-MM-dd', new Date());
	const selected = isValid(parsed) ? parsed : undefined;

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const currentValue = e.target.value;
		onChange?.(currentValue);

		const currentDateParsed = parse(currentValue, 'yyyy-MM-dd', new Date());
		if (isValid(currentDateParsed)) {
			setMonth(currentDateParsed);
		}
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
			<FieldLabel htmlFor="date-required">Solar Date</FieldLabel>
			<InputGroup>
				<InputGroupInput
					id="date-required"
					value={value}
					placeholder="YYYY-MM-DD"
					onChange={handleChange}
					onKeyDown={handleKeyDown}
					aria-invalid={error ? 'true' : undefined}
				/>
				<InputGroupAddon align="inline-end">
					<Popover open={open} onOpenChange={setOpen}>
						<PopoverTrigger>
							<InputGroupButton
								id="date-picker"
								variant="ghost"
								size="icon-xs"
								aria-label="Select date">
								<CalendarIcon />
								<span className="sr-only">Select date</span>
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
