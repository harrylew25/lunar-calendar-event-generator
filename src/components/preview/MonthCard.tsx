import type { LunarDateNotification } from '@lunar-dates/lunar-dates.type';
import { getLunarObjectFromDate } from '@/lib/wizard/preview-format';

type MonthCardProps = {
	monthName: string;
	events: LunarDateNotification[];
};

// TODO: move this to util, add tests, and add more sanitization for the id to prevent XSS attacks
const sanitizeId = (id: string) => {
	return id.trim().toLowerCase().replaceAll(' ', '-');
};

// TODO: move this to utils and add tests.
const formatDate = (date: LunarDateNotification['date']) => {
	const formatDateNumberToString = (value: number) =>
		value.toString().padStart(2, '0');
	return [...date].reverse().map(formatDateNumberToString).join('/');
};

const MonthCard = ({ monthName, events }: MonthCardProps) => {
	return (
		<article
			id={sanitizeId(monthName)}
			className="flex min-h-36 flex-col gap-3 rounded-xl border bg-card p-4 shadow-sm">
			<h3 className="font-medium">{monthName}</h3>
			<div className="flex flex-col gap-2">
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
			id={sanitizeId(event.title)}
			className="rounded-md border bg-muted/40 px-2 py-1 text-xs">
			{lunarObj.label}({formatDate(event.date)}) - {event.title}
		</div>
	);
};

export default MonthCard;
