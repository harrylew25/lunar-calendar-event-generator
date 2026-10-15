import {
	SOLAR_TERMS_BY_SEASON,
	type SolarTermId,
} from '@lunar-dates/solar-terms';
import Checkbox from '@/components/ui/checkbox';
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
	FieldLegend,
	FieldSet,
} from '@/components/ui/field';
import { reportCartChange } from '@/lib/wizard/cart-toast';
import { useCalendarStore } from '@/store/calendar-store';

const SolarTermPickOptions = () => {
	const cart = useCalendarStore((state) => state.cart);
	const setSolarTerm = useCalendarStore((state) => state.setSolarTerm);

	const isChecked = (id: SolarTermId) =>
		cart.some((item) => item.kind === 'solarTerm' && item.solarTermId === id);

	return (
		<div className="flex flex-col gap-6">
			<FieldLegend variant="label" className="-mb-4">
				Solar terms
			</FieldLegend>
			<FieldDescription className="-mb-4">
				Add a solar term once each Gregorian year in the loop.
			</FieldDescription>
			{[...SOLAR_TERMS_BY_SEASON.values()].map((season) => (
				<FieldSet key={season.id}>
					<FieldLegend variant="label">{season.label}</FieldLegend>
					<FieldGroup data-slot="checkbox-group" className="grid grid-cols-2">
						{season.terms.map((term) => {
							const inputId = `include-solar-${term.id}`;

							return (
								<Field key={term.id} orientation="horizontal">
									<Checkbox
										id={inputId}
										checked={isChecked(term.id)}
										onCheckedChange={(value: boolean | 'indeterminate') => {
											const included = value === true;
											setSolarTerm(term.id, included);
											reportCartChange({
												action: included ? 'added' : 'removed',
												title: term.title,
												lunarDate: term.title,
												toastId: `solar-${term.id}`,
											});
										}}
									/>
									<FieldLabel htmlFor={inputId} className="font-normal">
										{term.title}
									</FieldLabel>
								</Field>
							);
						})}
					</FieldGroup>
				</FieldSet>
			))}
		</div>
	);
};

export default SolarTermPickOptions;
