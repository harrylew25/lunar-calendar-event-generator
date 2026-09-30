import type { LunarDateNotification } from '@lunar-dates/lunar-dates.type';
import { format } from 'date-fns';
import { getLunarObjectFromDate } from '@/lib/wizard/preview-format';

type MonthCardProps = {
	monthName: string;
	events: LunarDateNotification[];
};

const sanitizeId = (id: string) =>
	id.trim().toLowerCase().replaceAll(' ', '-').replaceAll(':', '-');

const formatDate = (date: LunarDateNotification['date']) => {
	const [year, month, day] = date;
	return format(new Date(year, month - 1, day), 'dd/MM/yyyy');
};

const MonthCard = ({ monthName, events }: MonthCardProps) => {
	return (
		<article
			id={sanitizeId(monthName)}
			className="flex min-h-36 min-w-0 flex-col gap-3 rounded-xl border bg-card p-4 shadow-sm
			 hover:shadow-md transition-shadow">
			<h3 className="font-medium">{monthName}</h3>
			<div className="flex min-w-0 flex-col gap-2">
				{events.length === 0 ? (
					<p className="text-muted-foreground text-xs">No events</p>
				) : (
					events.map((event) => (
						<EventCard key={sanitizeId(event.title)} event={event} />
					))
				)}
			</div>
		</article>
	);
};

const EventCard = ({ event }: { event: LunarDateNotification }) => {
	const lunarObj = getLunarObjectFromDate(event.date);
	return (
		<div
			className="min-w-0 rounded-md border bg-muted/20 px-2 py-1 
		transition-colors hover:bg-muted hover:shadow-sm">
			<p className="truncate text-sm font-medium">{event.title}</p>
			<p className="text-xs text-muted-foreground">
				{lunarObj.label} - ({formatDate(event.date)})
			</p>
			{event.description ? (
				<p className="line-clamp-2 sm:line-clamp-3">{event.description}</p>
			) : null}
		</div>
	);
};

export default MonthCard;
