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

// TODO:  move these to constants file
const EVENTS = [
	{
		id: 'chuyi',
		label: '初一 (chuyi) — first day of each lunar month',
	},
	{
		id: 'shiwu',
		label: '十五 (shiwu) — fifteenth day of each lunar month',
	},
] as const;

const BulkEventOptions = () => {
	const { monthlyEvents, setMonthlyEvent } = useCalendarStore();

	return (
		<FieldSet>
			<FieldLegend variant="label">Show these events</FieldLegend>
			<FieldDescription>
				Select the events you want to add to the calendar.
			</FieldDescription>
			<FieldGroup data-slot="checkbox-group">
				{EVENTS.map((event) => {
					const inputId = `include-${event.id}`;

					return (
						<Field key={event.id} orientation="horizontal">
							<Checkbox
								id={inputId}
								checked={monthlyEvents[event.id]}
								onCheckedChange={(value: boolean | 'indeterminate') => {
									setMonthlyEvent(event.id, value === true);
								}}
							/>
							<FieldLabel htmlFor={inputId} className="font-normal">
								{event.label}
							</FieldLabel>
						</Field>
					);
				})}
			</FieldGroup>
		</FieldSet>
	);
};

export default BulkEventOptions;
