import type { IcsOverrideDraft, ReminderUnit } from '@ics';
import { FieldDescription, FieldLegend, FieldSet } from '@/components/ui/field';
import Input from '@/components/ui/input';
import Label from '@/components/ui/label';
import SelectField from '@/components/ui/select-field';
import { useT } from '@/lib/i18n/I18nProvider';

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

const WEEK_AMOUNTS = new Set(['1', '2', '3', '4']);

const IcsOverrideFields = ({
	idPrefix,
	value,
	onChange,
}: IcsOverrideFieldsProps) => {
	const t = useT();
	const locationId = `${idPrefix}-location`;
	const dayAmountOptions = [0, 1, 2, 3, 4, 5, 6].map((amount) => ({
		value: String(amount),
		label: amount === 0 ? t('onTheDayOption') : String(amount),
	}));
	const weekAmountOptions = [1, 2, 3, 4].map((amount) => ({
		value: String(amount),
		label: String(amount),
	}));
	const unitOptions = [
		{ value: 'days', label: t('days') },
		{ value: 'weeks', label: t('weeks') },
	];
	const hourOptions = Array.from({ length: 24 }, (_, hour) => ({
		value: String(hour),
		label: padTwo(hour),
	}));
	const minuteOptions = [0, 15, 30, 45].map((minute) => ({
		value: String(minute),
		label: padTwo(minute),
	}));
	const busyOptions = [
		{ value: 'TRANSPARENT', label: t('free') },
		{ value: 'OPAQUE', label: t('busy') },
	];
	const visibilityOptions = [
		{ value: 'PUBLIC', label: t('public') },
		{ value: 'PRIVATE', label: t('private') },
	];
	const amountOptions =
		value.unit === 'weeks' ? weekAmountOptions : dayAmountOptions;
	const reminderText =
		value.amount === '0'
			? t('reminderOnDay', {
					time: formatReminderTime(value.hour, value.minute),
				})
			: t('reminderBefore', {
					amount: value.amount,
					unit: value.unit === 'weeks' ? t('weeks') : t('days'),
					time: formatReminderTime(value.hour, value.minute),
				});

	const handleUnitChange = (nextUnitValue: string): void => {
		const unit: ReminderUnit = nextUnitValue === 'weeks' ? 'weeks' : 'days';
		const amountValid =
			unit === 'weeks'
				? WEEK_AMOUNTS.has(value.amount)
				: dayAmountOptions.some((option) => option.value === value.amount);
		onChange({
			...value,
			unit,
			amount: amountValid ? value.amount : '1',
		});
	};

	return (
		<div className="flex flex-col gap-4">
			<div className="space-y-2">
				<Label htmlFor={locationId}>{t('location')}</Label>
				<Input
					id={locationId}
					name="location"
					value={value.location}
					placeholder={t('locationPlaceholder')}
					onChange={(event) =>
						onChange({ ...value, location: event.target.value })
					}
				/>
			</div>
			<FieldSet>
				<FieldLegend>{t('reminder')}</FieldLegend>
				<FieldDescription>{reminderText}</FieldDescription>
				<div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
					<SelectField
						id={`${idPrefix}-reminder-amount`}
						label={t('amount')}
						value={value.amount}
						onValueChange={(amount) => onChange({ ...value, amount })}
						options={amountOptions}
						triggerClassName="max-w-none"
					/>
					<SelectField
						id={`${idPrefix}-reminder-unit`}
						label={t('unit')}
						value={value.unit}
						onValueChange={handleUnitChange}
						options={unitOptions}
						triggerClassName="max-w-none"
					/>
					<SelectField
						id={`${idPrefix}-reminder-hour`}
						label={t('hour')}
						value={value.hour}
						onValueChange={(hour) => onChange({ ...value, hour })}
						options={hourOptions}
						triggerClassName="max-w-none"
					/>
					<SelectField
						id={`${idPrefix}-reminder-minute`}
						label={t('minute')}
						value={value.minute}
						onValueChange={(minute) => onChange({ ...value, minute })}
						options={minuteOptions}
						triggerClassName="max-w-none"
					/>
				</div>
			</FieldSet>
			<div className="grid gap-4 md:grid-cols-2">
				<SelectField
					id={`${idPrefix}-busy`}
					label={t('showAs')}
					value={value.timeTransparent}
					onValueChange={(timeTransparent) =>
						onChange({
							...value,
							timeTransparent:
								timeTransparent === 'OPAQUE' ? 'OPAQUE' : 'TRANSPARENT',
						})
					}
					options={busyOptions}
					triggerClassName="max-w-none"
				/>
				<SelectField
					id={`${idPrefix}-visibility`}
					label={t('visibility')}
					value={value.visibility}
					onValueChange={(visibility) =>
						onChange({
							...value,
							visibility: visibility === 'PRIVATE' ? 'PRIVATE' : 'PUBLIC',
						})
					}
					options={visibilityOptions}
					triggerClassName="max-w-none"
				/>
			</div>
		</div>
	);
};

export default IcsOverrideFields;
