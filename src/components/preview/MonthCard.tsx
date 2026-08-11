import type { LunarDateNotification } from '@lunar-dates/lunar-dates.type';
import { getLunarDayLabelFromGregorian } from '@/lib/wizard/preview-format';

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
					events.map((event) => {
						const [, , gregDay] = event.date;
						const lunarDayLabel = getLunarDayLabelFromGregorian(event.date);
						return (
							<div
								key={`${event.title}-${event.date.join('-')}`}
								className="rounded-md border bg-muted/40 px-2 py-1 text-xs">
								{lunarDayLabel} - {event.title} - {gregDay}
							</div>
						);
					})
				)}
			</div>
		</div>
	);
};

export { MonthCard };
