import type { ReactElement } from 'react';
import { Button } from '@/components/ui/button';
import SelectField from '@/components/ui/select-field';
import { useT } from '@/lib/i18n/I18nProvider';
import { LOOP_YEAR_PRESETS } from '@/lib/wizard/constants';
import { useCalendarStore } from '@/store/calendar-store';
import CustomRuleForm from './CustomRuleForm';
import EventPickOptions from './EventPickOptions';
import SolarTermPickOptions from './SolarTermPickOptions';

const currentYear = new Date().getFullYear();
const RANGE = 5;

const DateSelectionStep = (): ReactElement => {
	const t = useT();
	const cart = useCalendarStore((state) => state.cart);
	const loopYears = useCalendarStore((state) => state.loopYears);
	const startYear = useCalendarStore((state) => state.startYear);
	const setStep = useCalendarStore((state) => state.setStep);
	const setLoopYears = useCalendarStore((state) => state.setLoopYears);
	const setStartYear = useCalendarStore((state) => state.setStartYear);

	const yearOptions = Array.from(
		{ length: RANGE * 2 + 1 },
		(_, index) => currentYear - RANGE + index,
	).map((years) => ({
		label:
			years === currentYear ? `${years} ${t('currentYear')}` : String(years),
		value: String(years),
	}));

	const loopYearOptions = LOOP_YEAR_PRESETS.map((years) => ({
		label: t('loopYearsOption', { years, cycles: years + 1 }),
		value: String(years),
	}));

	const cartCount =
		cart.length === 1
			? t('cartCountOne', { count: cart.length })
			: t('cartCountOther', { count: cart.length });

	return (
		<div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
			<div>
				<h2 className="text-2xl font-semibold">{t('dateSelectionTitle')}</h2>
				<p className="text-muted-foreground mt-1">{t('dateSelectionBody')}</p>
			</div>
			<div className="grid gap-4 md:grid-cols-2">
				<SelectField
					id="start-year"
					label={t('startYear')}
					value={String(startYear)}
					onValueChange={(value) => setStartYear(Number(value))}
					options={yearOptions}
				/>

				<SelectField
					id="loop-years"
					label={t('loopYears')}
					value={String(loopYears)}
					onValueChange={(value) => setLoopYears(Number(value))}
					options={loopYearOptions}
				/>
			</div>

			<EventPickOptions />
			<SolarTermPickOptions />
			<CustomRuleForm />
			<p className="text-muted-foreground text-sm">{cartCount}</p>

			<div className="flex sm:justify-end">
				<Button
					type="button"
					className="w-full sm:w-auto"
					onClick={() => setStep('cart')}
					disabled={cart.length === 0}>
					{t('nextReviewCart')}
				</Button>
			</div>
		</div>
	);
};

export default DateSelectionStep;
