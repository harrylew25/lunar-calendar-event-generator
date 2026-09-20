import type { ReactElement } from 'react';
import { Button } from '@/components/ui/button';
import SelectField from '@/components/ui/select-field';
import { LOOP_YEAR_PRESETS } from '@/lib/wizard/constants';
import { useCalendarStore } from '@/store/calendar-store';
import CustomRuleForm from './CustomRuleForm';
import EventPickOptions from './EventPickOptions';

const currentYear = new Date().getFullYear();
const RANGE = 5;
const formatYearsOption = (
	years: number,
): { label: string; value: string } => ({
	label: `${years} ${years === currentYear ? '(current year)' : ''}`,
	value: String(years),
});
const YEARS_OPTIONS = Array.from(
	{ length: RANGE * 2 + 1 },
	(_, index) => currentYear - RANGE + index,
).map(formatYearsOption);

const LOOP_YEARS_OPTIONS = LOOP_YEAR_PRESETS.map((years) => ({
	label: `${years} years (${years + 1} cycles)`,
	value: String(years),
}));

const DateSelectionStep = (): ReactElement => {
	const cart = useCalendarStore((state) => state.cart);
	const loopYears = useCalendarStore((state) => state.loopYears);
	const startYear = useCalendarStore((state) => state.startYear);
	const setStep = useCalendarStore((state) => state.setStep);
	const setLoopYears = useCalendarStore((state) => state.setLoopYears);
	const setStartYear = useCalendarStore((state) => state.setStartYear);

	return (
		<div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
			<div>
				<h2 className="text-2xl font-semibold">Date Selection</h2>
				<p className="text-muted-foreground mt-1">
					Add lunar recurrence rules to your cart, then review before generating
					the calendar.
				</p>
			</div>
			<div className="grid gap-4 md:grid-cols-2">
				<SelectField
					id="start-year"
					label="Start year"
					value={String(startYear)}
					onValueChange={(value) => setStartYear(Number(value))}
					options={YEARS_OPTIONS}
				/>

				<SelectField
					id="loop-years"
					label="Loop years"
					value={String(loopYears)}
					onValueChange={(value) => setLoopYears(Number(value))}
					options={LOOP_YEARS_OPTIONS}
				/>
			</div>

			<EventPickOptions />

			<CustomRuleForm />

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

export default DateSelectionStep;
