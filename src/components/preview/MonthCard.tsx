import type { LunarDateNotification } from '@lunar-dates/lunar-dates.type';
import { getLunarObjectFromDate } from '@/lib/wizard/preview-format';

type MonthCardProps = {
	monthName: string;
	events: LunarDateNotification[];
};

const MonthCard = ({ monthName, events }: MonthCardProps) => {
	return (
		<div className="flex min-h-36 flex-col gap-3 rounded-xl border bg-card p-4 shadow-sm">
			<h3 className="font-medium">{monthName}</h3>
			<div className="flex flex-col gap-2">
				{events.length === 0 ? (
					<p className="text-muted-foreground text-xs">No events</p>
				) : (
					events.map(event => <EventCard key={event.date.join('-')} event={event} />)
				)}
			</div>
		</div>
	);
};

const EventCard = ({ event }: { event: LunarDateNotification }) => {
	const [, , gregDay] = event.date;
	const lunarObj = getLunarObjectFromDate(event.date);
	return (
		<div
			id={lunarObj.label}
			className="rounded-md border bg-muted/40 px-2 py-1 text-xs">
			{lunarObj.label} - {event.title} - {gregDay}
		</div>
	)
}

export default MonthCard;
