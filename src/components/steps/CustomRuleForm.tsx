import { resolveLunarMonthDay } from '@lunar-dates';
import { type ReactElement, useState } from 'react';
import AlertToolTip from '@/components/cart/AlertToolTip';
import InputField from '@/components/form/input-field';
import { Button } from '@/components/ui/button';
import SelectField from '@/components/ui/select-field';
import {
	dedupedMonthRules,
	LUNAR_DAY_OPTIONS,
	MESSAGES,
} from '@/lib/wizard/constants';
import { useCalendarStore } from '@/store/calendar-store';
import SelectFieldWithAlert from '../form/select-field-with-alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

const is30thLunarDay = (lunarDay: number): boolean => lunarDay === 30;
const isLeapMonth = (lunarMonth: number): boolean => lunarMonth < 0;

const CustomRuleForm = (): ReactElement => {
	const addItem = useCalendarStore((state) => state.addItem);

	const [lunarMonth, setLunarMonth] = useState('1');
	const [lunarDay, setLunarDay] = useState('1');
	const [title, setTitle] = useState(`testing ${crypto.randomUUID()}`);
	const [description, setDescription] = useState('');
	const [solarDate, setSolarDate] = useState('');
	const [inputMode, setInputMode] = useState<'lunar' | 'solar'>('lunar');

	const trimmedTitle = title.trim();
	const canAddLunar = trimmedTitle.length > 0;
	const canAddSolar =
		trimmedTitle.length > 0 && solarDate.length > 0 && inputMode === 'solar';

	const resetForm = (): void => {
		setTitle(`testing ${crypto.randomUUID()}`);
		setDescription('');
		setLunarMonth('1');
		setLunarDay('1');
		setSolarDate('');
	};

	const submitRule = (nextLunarMonth: number, nextLunarDay: number): void => {
		addItem({
			lunarMonth: nextLunarMonth,
			lunarDay: nextLunarDay,
			title: trimmedTitle,
			description: description.trim(),
		});
		resetForm();
	};

	const handleAddLunar = (): void => {
		if (!canAddLunar) {
			return;
		}
		submitRule(Number(lunarMonth), Number(lunarDay));
	};

	const handleAddSolar = (): void => {
		if (!canAddSolar) {
			return;
		}
		const [year, month, day] = solarDate.split('-').map(Number);
		if (!year || !month || !day) {
			return;
		}
		const { lunarMonth: resolvedMonth, lunarDay: resolvedDay } =
			resolveLunarMonthDay({
				kind: 'solar',
				solarYear: year,
				solarMonth: month,
				solarDay: day,
				title: trimmedTitle,
			});
		submitRule(resolvedMonth, resolvedDay);
	};

	return (
		<Tabs
			defaultValue="lunar"
			onValueChange={(value) => setInputMode(value as 'lunar' | 'solar')}>
			<TabsList>
				<TabsTrigger value="lunar">Lunar</TabsTrigger>
				<TabsTrigger value="solar">Solar</TabsTrigger>
			</TabsList>
			<div className="space-y-4 rounded-xl border p-6">
				<InputField
					id="event-title"
					type="text"
					label="Event title"
					value={title}
					onChange={setTitle}
					placeholder="e.g. 正月十五 reminder"
				/>

				<TabsContent value="lunar">
					<div className="grid gap-4 md:grid-cols-2">
						<SelectFieldWithAlert
							showAlert={isLeapMonth(Number(lunarMonth))}
							alert={
								<AlertToolTip
									label="Leap month"
									description={MESSAGES.leapMonth}
									color="yellow"
								/>
							}>
							<SelectField
								id="lunar-month"
								label="Lunar month"
								value={lunarMonth}
								onValueChange={setLunarMonth}
								className="min-w-0"
								triggerClassName="w-full max-w-none"
								options={dedupedMonthRules.map((rule) => ({
									label: rule.name,
									value: String(rule.value),
								}))}
							/>
						</SelectFieldWithAlert>

						<SelectFieldWithAlert
							showAlert={is30thLunarDay(Number(lunarDay))}
							alert={
								<AlertToolTip
									label="End of month"
									description={MESSAGES.endOfMonth}
									color="yellow"
								/>
							}>
							<SelectField
								id="lunar-day"
								label="Lunar day"
								value={lunarDay}
								onValueChange={setLunarDay}
								className="min-w-0"
								triggerClassName="w-full max-w-none"
								options={LUNAR_DAY_OPTIONS.map((day) => ({
									label: String(day),
									value: String(day),
								}))}
							/>
						</SelectFieldWithAlert>
					</div>
				</TabsContent>
				<TabsContent value="solar">
					<InputField
						id="solar-date"
						label="Solar date"
						value={solarDate}
						onChange={setSolarDate}
						placeholder="YYYY-MM-DD"
					/>
				</TabsContent>

				<InputField
					id="event-description"
					type="textarea"
					label="Description"
					value={description}
					onChange={setDescription}
					placeholder="e.g. 元宵节提醒"
				/>
				<Button
					type="button"
					onClick={inputMode === 'lunar' ? handleAddLunar : handleAddSolar}
					disabled={inputMode === 'lunar' ? !canAddLunar : !canAddSolar}>
					Add to cart
				</Button>
			</div>
		</Tabs>
	);
};

export default CustomRuleForm;
