import type { LunarDateNotification } from '@lunar-dates/lunar-dates.type';
import MonthCard from '@/components/preview/MonthCard';
import { gregorianMonthName } from '@/lib/i18n/date-locale';
import { useI18n } from '@/lib/i18n/I18nProvider';

type YearPreviewGridProps = {
	year: number;
	events: LunarDateNotification[];
};

const YearPreviewGrid = ({ year, events }: YearPreviewGridProps) => {
	const { locale } = useI18n();
	const eventsForYear = events.filter((event) => event.date[0] === year);

	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{Array.from({ length: 12 }, (_, index) => {
				const month = index + 1;
				const monthName = gregorianMonthName(month, locale);
				const monthEvents = eventsForYear.filter(
					(event) => event.date[1] === month,
				);
				return (
					<MonthCard
						key={`${year}-${monthName}`}
						monthName={monthName}
						events={monthEvents}
					/>
				);
			})}
		</div>
	);
};

export default YearPreviewGrid;
