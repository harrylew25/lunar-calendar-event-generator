import { FESTIVALS, MONTHLY_EVENTS } from '@lunar-dates/constants';
import Checkbox from '@/components/ui/checkbox';
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
	FieldLegend,
	FieldSet,
} from '@/components/ui/field';
import { useCalendarStore } from '@/store/calendar-store';

const EventPickOptions = () => {
	const cart = useCalendarStore((state) => state.cart);
	const setMonthlyEvent = useCalendarStore((state) => state.setMonthlyEvent);
	const setCatalogItem = useCalendarStore((state) => state.setCatalogItem);

	const isMonthlyChecked = (id: (typeof MONTHLY_EVENTS)[number]['id']) =>
		cart.some((item) => item.kind === 'monthly' && item.monthlyId === id);

	const isCatalogChecked = (id: (typeof FESTIVALS)[number]['id']) =>
		cart.some((item) => item.kind === 'catalog' && item.catalogId === id);

	return (
		<div className="flex flex-col gap-6">
			<FieldSet>
				<FieldLegend variant="label">Every lunar month</FieldLegend>
				<FieldDescription>
					Add the first and/or fifteenth of every lunar month, including leap
					months.
				</FieldDescription>
				<FieldGroup data-slot="checkbox-group">
					{MONTHLY_EVENTS.map((event) => {
						const inputId = `include-${event.id}`;

						return (
							<Field key={event.id} orientation="horizontal">
								<Checkbox
									id={inputId}
									checked={isMonthlyChecked(event.id)}
									onCheckedChange={(value: boolean | 'indeterminate') => {
										setMonthlyEvent(event.id, value === true);
									}}
								/>
								<FieldLabel htmlFor={inputId} className="font-normal">
									{event.cartLabel}
								</FieldLabel>
							</Field>
						);
					})}
				</FieldGroup>
			</FieldSet>
			<FieldSet>
				<FieldLegend variant="label">Festivals</FieldLegend>
				<FieldDescription>
					Add these lunar dates once per year (leap month follows the start
					year).
				</FieldDescription>
				<FieldGroup data-slot="checkbox-group">
					{FESTIVALS.map((event) => {
						const inputId = `include-${event.id}`;

						return (
							<Field key={event.id} orientation="horizontal">
								<Checkbox
									id={inputId}
									checked={isCatalogChecked(event.id)}
									onCheckedChange={(value: boolean | 'indeterminate') => {
										setCatalogItem(event.id, value === true);
									}}
								/>
								<FieldLabel htmlFor={inputId} className="font-normal">
									{event.cartLabel}
								</FieldLabel>
							</Field>
						);
					})}
				</FieldGroup>
			</FieldSet>
		</div>
	);
};

export default EventPickOptions;
