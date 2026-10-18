import { resolveLunarMonthDay } from '@lunar-dates';
import { getDate, getMonth, getYear, isMatch, isValid, parse } from 'date-fns';
import { type ReactElement, useState } from 'react';
import AlertToolTip from '@/components/cart/AlertToolTip';
import InputField from '@/components/form/input-field';
import SelectFieldWithAlert from '@/components/form/select-field-with-alert';
import { Button } from '@/components/ui/button';
import DatePickerInput from '@/components/ui/date-picker';
import SelectField from '@/components/ui/select-field';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { lunarDayLabel, lunarMonthLabel } from '@/lib/i18n/catalog-labels';
import { useI18n, useT } from '@/lib/i18n/I18nProvider';
import { reportCartChange } from '@/lib/wizard/cart-toast';
import { dedupedMonthRules, LUNAR_DAY_OPTIONS } from '@/lib/wizard/constants';
import { useCalendarStore } from '@/store/calendar-store';

const is30thLunarDay = (lunarDay: number): boolean => lunarDay === 30;
const isLeapMonth = (lunarMonth: number): boolean => lunarMonth < 0;

const CustomRuleForm = (): ReactElement => {
	const t = useT();
	const { locale } = useI18n();
	const addItem = useCalendarStore((state) => state.addItem);

	const [lunarMonth, setLunarMonth] = useState('1');
	const [lunarDay, setLunarDay] = useState('1');
	const [title, setTitle] = useState('');
	const [titleTouched, setTitleTouched] = useState(false);
	const [description, setDescription] = useState('');
	const [solarDate, setSolarDate] = useState('');
	const [inputMode, setInputMode] = useState<'lunar' | 'solar'>('lunar');

	const trimmedTitle = title.trim();
	const canAddLunar = trimmedTitle.length > 0;
	const canAddSolar =
		trimmedTitle.length > 0 && solarDate.length > 0 && inputMode === 'solar';

	const resetForm = (): void => {
		setTitle('');
		setDescription('');
		setLunarMonth('1');
		setLunarDay('1');
		setSolarDate('');
		setTitleTouched(false);
	};

	const submitRule = (nextLunarMonth: number, nextLunarDay: number): void => {
		const currentCartLength = useCalendarStore.getState().cart.length;
		addItem({
			lunarMonth: nextLunarMonth,
			lunarDay: nextLunarDay,
			title: trimmedTitle,
			description: description.trim(),
		});
		const postSubmitCartLength = useCalendarStore.getState().cart.length;
		if (postSubmitCartLength > currentCartLength) {
			const monthName = lunarMonthLabel(nextLunarMonth, locale);
			const dayName = lunarDayLabel(nextLunarDay, locale);
			const separator = locale === 'en' ? ' ' : '';
			reportCartChange({
				action: 'added',
				title: trimmedTitle,
				lunarDate: `${monthName}${separator}${dayName}`,
			});
		}
		resetForm();
	};

	const handleAddLunar = (): void => {
		if (!canAddLunar) {
			return;
		}
		submitRule(Number(lunarMonth), Number(lunarDay));
	};

	const handleAddSolar = (): void => {
		const parsed = parse(solarDate, 'yyyy-MM-dd', new Date());
		if (!isValid(parsed) || !canAddSolar) {
			return;
		}
		const { lunarMonth: resolvedMonth, lunarDay: resolvedDay } =
			resolveLunarMonthDay({
				kind: 'solar',
				solarYear: getYear(parsed),
				solarMonth: getMonth(parsed) + 1,
				solarDay: getDate(parsed),
				title: trimmedTitle,
			});
		submitRule(resolvedMonth, resolvedDay);
	};

	const titleError = titleTouched && trimmedTitle.length === 0;

	const solarDateError =
		solarDate.length > 0 && !isMatch(solarDate, 'yyyy-MM-dd')
			? t('invalidDate')
			: null;

	return (
		<Tabs
			defaultValue="lunar"
			onValueChange={(value) => setInputMode(value as 'lunar' | 'solar')}>
			<TabsList>
				<TabsTrigger value="lunar">{t('lunar')}</TabsTrigger>
				<TabsTrigger value="solar">{t('solar')}</TabsTrigger>
			</TabsList>
			<div className="space-y-4 rounded-xl border p-6">
				<InputField
					id="event-title"
					type="text"
					label={t('eventTitle')}
					value={title}
					onChange={setTitle}
					placeholder={t('eventTitlePlaceholder')}
					onBlur={() => setTitleTouched(true)}
					error={titleError ? t('titleRequired') : undefined}
				/>

				<TabsContent value="lunar">
					<div className="grid gap-4 md:grid-cols-2">
						<SelectFieldWithAlert
							showAlert={isLeapMonth(Number(lunarMonth))}
							alert={
								<AlertToolTip
									label={t('leapMonth')}
									description={t('leapMonthHelp')}
									color="yellow"
								/>
							}>
							<SelectField
								id="lunar-month"
								label={t('lunarMonth')}
								value={lunarMonth}
								onValueChange={setLunarMonth}
								className="min-w-0"
								triggerClassName="w-full max-w-none"
								options={dedupedMonthRules.map((rule) => ({
									label: lunarMonthLabel(rule.value, locale),
									value: String(rule.value),
								}))}
							/>
						</SelectFieldWithAlert>

						<SelectFieldWithAlert
							showAlert={is30thLunarDay(Number(lunarDay))}
							alert={
								<AlertToolTip
									label={t('endOfMonth')}
									description={t('endOfMonthHelp')}
									color="yellow"
								/>
							}>
							<SelectField
								id="lunar-day"
								label={t('lunarDay')}
								value={lunarDay}
								onValueChange={setLunarDay}
								className="min-w-0"
								triggerClassName="w-full max-w-none"
								options={LUNAR_DAY_OPTIONS.map((day) => ({
									label: lunarDayLabel(day, locale),
									value: String(day),
								}))}
							/>
						</SelectFieldWithAlert>
					</div>
				</TabsContent>
				<TabsContent value="solar">
					<DatePickerInput
						value={solarDate}
						onChange={(item) => setSolarDate(item)}
						error={solarDateError}
					/>
				</TabsContent>

				<InputField
					id="event-description"
					type="textarea"
					label={t('description')}
					value={description}
					onChange={setDescription}
					placeholder={t('descriptionPlaceholder')}
				/>
				<Button
					type="button"
					onClick={inputMode === 'lunar' ? handleAddLunar : handleAddSolar}
					disabled={
						(inputMode === 'lunar' ? !canAddLunar : !canAddSolar) ||
						!!solarDateError ||
						!!titleError
					}>
					{t('addToCart')}
				</Button>
			</div>
		</Tabs>
	);
};

export default CustomRuleForm;
