import type { IcsOverrideDraft, ReminderUnit } from '@ics';
import { FieldDescription, FieldLegend, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import Label from '@/components/ui/label';
import SelectField from '@/components/ui/select-field';

type IcsOverrideFieldsProps = {
	idPrefix: string;
	value: IcsOverrideDraft;
	onChange: (next: IcsOverrideDraft) => void;
};

const padTwo = (value: number): string => String(value).padStart(2, '0');

const formatReminderTime = (hour: string, minute: string): string => {
	const hourNumber = Number(hour);
	const minuteNumber = Number(minute);
	const period = hourNumber >= 12 ? 'PM' : 'AM';
	const hour12 = hourNumber % 12 === 0 ? 12 : hourNumber % 12;

	return `${padTwo(hour12)}:${padTwo(minuteNumber)} ${period}`;
};

const getLabelValuePair = (value: string, label: string) => ({
	value,
	label,
});

const DAY_AMOUNT_OPTIONS = [0, 1, 2, 3, 4, 5, 6].map((amount) =>
	getLabelValuePair(
		String(amount),
		amount === 0 ? '0 (on the day)' : String(amount),
	),
);

const WEEK_AMOUNT_OPTIONS = [1, 2, 3, 4].map((amount) =>
	getLabelValuePair(String(amount), String(amount)),
);

const UNIT_OPTIONS = [
	getLabelValuePair('days', 'days'),
	getLabelValuePair('weeks', 'weeks'),
];

const HOUR_OPTIONS = Array.from({ length: 24 }, (_, hour) =>
	getLabelValuePair(String(hour), padTwo(hour)),
);

const MINUTE_OPTIONS = [0, 15, 30, 45].map((minute) =>
	getLabelValuePair(String(minute), padTwo(minute)),
);

const BUSY_OPTIONS = [
	getLabelValuePair('TRANSPARENT', 'Free'),
	getLabelValuePair('OPAQUE', 'Busy'),
];

const VISIBILITY_OPTIONS = [
	getLabelValuePair('PUBLIC', 'Public'),
	getLabelValuePair('PRIVATE', 'Private'),
];

const WEEK_AMOUNTS = new Set(['1', '2', '3', '4']);

const amountOptionsForUnit = (unit: ReminderUnit) =>
	unit === 'weeks' ? WEEK_AMOUNT_OPTIONS : DAY_AMOUNT_OPTIONS;

const formatReminderDescription = (
	amount: string,
	unit: ReminderUnit,
	hour: string,
	minute: string,
): string => {
	const reminderDayOrWeek =
		amount === '0' ? `On the day of` : `${amount} ${unit} before`;
	return `${reminderDayOrWeek} the event at ${formatReminderTime(hour, minute)}`;
};

const IcsOverrideFields = ({
	idPrefix,
	value,
	onChange,
}: IcsOverrideFieldsProps) => {
	const locationId = `${idPrefix}-location`;

	const handleUnitChange = (nextUnitValue: string): void => {
		const unit: ReminderUnit = nextUnitValue === 'weeks' ? 'weeks' : 'days';
		const amountValid =
			unit === 'weeks'
				? WEEK_AMOUNTS.has(value.amount)
				: DAY_AMOUNT_OPTIONS.some((option) => option.value === value.amount);
		onChange({
			...value,
			unit,
			amount: amountValid ? value.amount : '1',
		});
	};

	return (
		<div className="flex flex-col gap-4">
			<div className="space-y-2">
				<Label htmlFor={locationId}>Location</Label>
				<Input
					id={locationId}
					name="location"
					value={value.location}
					placeholder="Add location"
					onChange={(event) =>
						onChange({ ...value, location: event.target.value })
					}
				/>
			</div>
			<FieldSet>
				<FieldLegend>Reminder</FieldLegend>
				<FieldDescription>
					{formatReminderDescription(
						value.amount,
						value.unit,
						value.hour,
						value.minute,
					)}
				</FieldDescription>
				<div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
					<SelectField
						id={`${idPrefix}-reminder-amount`}
						label="Anmount"
						value={value.amount}
						onValueChange={(amount) => onChange({ ...value, amount })}
						options={amountOptionsForUnit(value.unit)}
						triggerClassName="max-w-none"
					/>
					<SelectField
						id={`${idPrefix}-reminder-unit`}
						label="Unit"
						value={value.unit}
						onValueChange={handleUnitChange}
						options={UNIT_OPTIONS}
						triggerClassName="max-w-none"
					/>
					<SelectField
						id={`${idPrefix}-reminder-hour`}
						label="Hour"
						value={value.hour}
						onValueChange={(hour) => onChange({ ...value, hour })}
						options={HOUR_OPTIONS}
						triggerClassName="max-w-none"
					/>
					<SelectField
						id={`${idPrefix}-reminder-minute`}
						label="Minute"
						value={value.minute}
						onValueChange={(minute) => onChange({ ...value, minute })}
						options={MINUTE_OPTIONS}
						triggerClassName="max-w-none"
					/>
				</div>
			</FieldSet>
			<div className="grid gap-4 md:grid-cols-2">
				<SelectField
					id={`${idPrefix}-busy`}
					label="Show as"
					value={value.timeTransparent}
					onValueChange={(timeTransparent) =>
						onChange({
							...value,
							timeTransparent:
								timeTransparent === 'OPAQUE' ? 'OPAQUE' : 'TRANSPARENT',
						})
					}
					options={BUSY_OPTIONS}
					triggerClassName="max-w-none"
				/>
				<SelectField
					id={`${idPrefix}-visibility`}
					label="Visibility"
					value={value.visibility}
					onValueChange={(visibility) =>
						onChange({
							...value,
							visibility: visibility === 'PRIVATE' ? 'PRIVATE' : 'PUBLIC',
						})
					}
					options={VISIBILITY_OPTIONS}
					triggerClassName="max-w-none"
				/>
			</div>
		</div>
	);
};

export default IcsOverrideFields;
