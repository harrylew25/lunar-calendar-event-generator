import { resolveLunarMonthDay } from '@lunar-dates';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	dedupedMonthRules,
	LOOP_YEAR_PRESETS,
	LUNAR_DAY_OPTIONS,
} from '@/lib/wizard/constants';
import { useCalendarStore } from '@/store/calendar-store';

const DEFAULT_START_YEAR = 2020;
const currentYear = new Date().getFullYear();
const YEARS_OPTIONS = Array.from(
	{ length: currentYear - DEFAULT_START_YEAR + 1 },
	(_, index) => index + DEFAULT_START_YEAR
);


const DateSelectionStep = () => {
	const cart = useCalendarStore((state) => state.cart);
	const loopYears = useCalendarStore((state) => state.loopYears);
	const startYear = useCalendarStore((state) => state.startYear);
	const addItem = useCalendarStore((state) => state.addItem);
	const setStep = useCalendarStore((state) => state.setStep);
	const setLoopYears = useCalendarStore((state) => state.setLoopYears);
	const setStartYear = useCalendarStore((state) => state.setStartYear);

	const [lunarMonth, setLunarMonth] = useState('1');
	const [lunarDay, setLunarDay] = useState('1');
	const [title, setTitle] = useState('');
	const [solarDate, setSolarDate] = useState('');
	const [inputMode, setInputMode] = useState<'lunar' | 'solar'>('lunar');

	const trimmedTitle = title.trim();
	const canAddLunar = trimmedTitle.length > 0;
	const canAddSolar =
		trimmedTitle.length > 0 && solarDate.length > 0 && inputMode === 'solar';

	const handleAddLunar = (): void => {
		if (!canAddLunar) {
			return;
		}
		addItem({
			lunarMonth: Number(lunarMonth),
			lunarDay: Number(lunarDay),
			title: trimmedTitle,
		});
		setTitle('');
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
		addItem({
			lunarMonth: resolvedMonth,
			lunarDay: resolvedDay,
			title: trimmedTitle,
		});
		setTitle('');
		setSolarDate('');
	};

	return (
		<div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
			<div>
				<h2 className="text-2xl font-semibold">Date Selection</h2>
				<p className="text-muted-foreground mt-1">
					Add lunar recurrence rules to your cart, then review before generating
					the calendar.
				</p>
			</div>

			<div className="space-y-2">
				<Label htmlFor="start-year">Start year</Label>
				<Select
					value={String(startYear)}
					onValueChange={(value) => setStartYear(Number(value))}>
					<SelectTrigger id="start-year" className="w-full max-w-xs">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{YEARS_OPTIONS.map((years) => (
							<SelectItem key={years} value={String(years)}>
								{years}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div className="space-y-2">
				<Label htmlFor="loop-years">Loop years</Label>
				<Select
					value={String(loopYears)}
					onValueChange={(value) => setLoopYears(Number(value))}>
					<SelectTrigger id="loop-years" className="w-full max-w-xs">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{LOOP_YEAR_PRESETS.map((years) => (
							<SelectItem key={years} value={String(years)}>
								{years} years ({years + 1} occurrences)
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div className="flex gap-2">
				<Button
					type="button"
					variant={inputMode === 'lunar' ? 'default' : 'outline'}
					onClick={() => setInputMode('lunar')}>
					Lunar input
				</Button>
				<Button
					type="button"
					variant={inputMode === 'solar' ? 'default' : 'outline'}
					onClick={() => setInputMode('solar')}>
					Solar input
				</Button>
			</div>

			<div className="space-y-4 rounded-xl border p-6">
				<div className="space-y-2">
					<Label htmlFor="event-title">Title</Label>
					<Input
						id="event-title"
						value={title}
						onChange={(event) => setTitle(event.target.value)}
						placeholder="e.g. 正月十五 reminder"
					/>
				</div>

				{inputMode === 'lunar' ? (
					<div className="grid gap-4 md:grid-cols-2">
						<div className="space-y-2">
							<Label htmlFor="lunar-month">Lunar month</Label>
							<Select value={lunarMonth} onValueChange={setLunarMonth}>
								<SelectTrigger id="lunar-month">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{dedupedMonthRules.map((rule) => (
										<SelectItem key={rule.value} value={String(rule.value)}>
											{rule.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label htmlFor="lunar-day">Lunar day</Label>
							<Select value={lunarDay} onValueChange={setLunarDay}>
								<SelectTrigger id="lunar-day">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{LUNAR_DAY_OPTIONS.map((day) => (
										<SelectItem key={day} value={String(day)}>
											{day}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>
				) : (
					<div className="space-y-2">
						<Label htmlFor="solar-date">Solar date</Label>
						<Input
							id="solar-date"
							placeholder="YYYY-MM-DD"
							value={solarDate}
							onChange={(event) => setSolarDate(event.target.value)}
						/>
					</div>
				)}

				<Button
					type="button"
					onClick={inputMode === 'lunar' ? handleAddLunar : handleAddSolar}
					disabled={inputMode === 'lunar' ? !canAddLunar : !canAddSolar}>
					Add to cart
				</Button>
			</div>

			<p className="text-muted-foreground text-sm">
				{cart.length} item{cart.length === 1 ? '' : 's'} in cart
			</p>

			<div className="flex justify-end">
				<Button
					type="button"
					onClick={() => setStep('cart')}
					disabled={cart.length === 0}>
					Next: Review cart
				</Button>
			</div>
		</div>
	);
};

export { DateSelectionStep };
