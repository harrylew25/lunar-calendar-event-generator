import type { LunarDateNotification } from '@lunar-dates/lunar-dates.type';
import { MonthCard } from '@/components/preview/MonthCard';
import { GREGORIAN_MONTH_NAMES } from '@/lib/wizard/constants';

type YearPreviewGridProps = {
	year: number;
	events: LunarDateNotification[];
};

const YearPreviewGrid = ({ year, events }: YearPreviewGridProps) => {
	const eventsForYear = events.filter((event) => event.date[0] === year);

	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{GREGORIAN_MONTH_NAMES.map((monthName, index) => {
				const month = index + 1;
				const monthEvents = eventsForYear.filter(
					(event) => event.date[1] === month,
				);
				return (
					<MonthCard
						key={monthName}
						monthName={monthName}
						events={monthEvents}
					/>
				);
			})}
		</div>
	);
};

export { YearPreviewGrid };
