import type { IcsOverrideDraft } from '@ics';
import {
	type Dispatch,
	type ReactElement,
	type SetStateAction,
	useCallback,
} from 'react';
import InputField from '@/components/form/input-field';
import SelectFieldWithAlert from '@/components/form/select-field-with-alert';
import Label from '@/components/ui/label';
import SelectField from '@/components/ui/select-field';
import { Textarea } from '@/components/ui/textarea';
import { lunarDayLabel, lunarMonthLabel } from '@/lib/i18n/catalog-labels';
import { useI18n, useT } from '@/lib/i18n/I18nProvider';
import { dedupedMonthRules, LUNAR_DAY_OPTIONS } from '@/lib/wizard/constants';
import AlertToolTip from './AlertToolTip';
import IcsOverrideFields from './IcsOverrideFields';

type CustomCartItemDraft = {
	lunarMonth: string;
	lunarDay: string;
	title: string;
	description: string;
	ics: IcsOverrideDraft;
};

type CustomCartItemFieldsProps = {
	idPrefix: string;
	value: CustomCartItemDraft;
	onChange: Dispatch<SetStateAction<CustomCartItemDraft>>;
};

const is30thLunarDay = (lunarDay: string): boolean => Number(lunarDay) === 30;

const isLeapMonth = (lunarMonth: string): boolean => Number(lunarMonth) < 0;

const CustomCartItemFields = ({
	idPrefix,
	value,
	onChange,
}: CustomCartItemFieldsProps): ReactElement => {
	const t = useT();
	const { locale } = useI18n();
	const handleTitleChange = useCallback(
		(title: string): void => {
			onChange((current) => ({ ...current, title }));
		},
		[onChange],
	);

	return (
		<>
			<InputField
				id={`${idPrefix}-title`}
				label={t('title')}
				value={value.title}
				onChange={handleTitleChange}
				className="mb-4"
			/>
			<div className="grid gap-4 md:grid-cols-2">
				<SelectFieldWithAlert
					showAlert={isLeapMonth(value.lunarMonth)}
					alert={
						<AlertToolTip
							label={t('leapMonth')}
							description={t('leapMonthHelp')}
							color="yellow"
						/>
					}>
					<SelectField
						id={`${idPrefix}-lunar-month`}
						label={t('lunarMonth')}
						value={value.lunarMonth}
						onValueChange={(lunarMonth) => onChange({ ...value, lunarMonth })}
						className="min-w-0"
						triggerClassName="w-full max-w-none"
						options={dedupedMonthRules.map((rule) => ({
							label: lunarMonthLabel(rule.value, locale),
							value: String(rule.value),
						}))}
					/>
				</SelectFieldWithAlert>
				<SelectFieldWithAlert
					showAlert={is30thLunarDay(value.lunarDay)}
					alert={
						<AlertToolTip
							label={t('endOfMonth')}
							description={t('endOfMonthHelp')}
							color="yellow"
						/>
					}>
					<SelectField
						id={`${idPrefix}-lunar-day`}
						label={t('lunarDay')}
						value={value.lunarDay}
						onValueChange={(lunarDay) => onChange({ ...value, lunarDay })}
						className="min-w-0"
						triggerClassName="w-full max-w-none"
						options={LUNAR_DAY_OPTIONS.map((day) => ({
							label: lunarDayLabel(day, locale),
							value: String(day),
						}))}
					/>
				</SelectFieldWithAlert>
			</div>
			<div className="mt-4 mb-4">
				<Label htmlFor={`${idPrefix}-description`} className="mb-2">
					{t('description')}
				</Label>
				<Textarea
					id={`${idPrefix}-description`}
					rows={4}
					value={value.description}
					onChange={(event) =>
						onChange({ ...value, description: event.target.value })
					}
				/>
			</div>
			<IcsOverrideFields
				idPrefix={`${idPrefix}-ics`}
				value={value.ics}
				onChange={(ics) => onChange({ ...value, ics })}
			/>
		</>
	);
};

export type { CustomCartItemDraft };
export default CustomCartItemFields;
