import type { LunarDateNotification } from '@lunar-dates/lunar-dates.type';
import { format } from 'date-fns';
import { useI18n, useT } from '@/lib/i18n/I18nProvider';
import { formatPreviewLunarLine } from '@/lib/wizard/preview-format';

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
	const t = useT();
	return (
		<article
			id={sanitizeId(monthName)}
			className="flex min-h-36 min-w-0 flex-col gap-3 rounded-xl border bg-card p-4 shadow-sm
			 hover:shadow-md transition-shadow">
			<h3 className="font-medium">{monthName}</h3>
			<div className="flex min-w-0 flex-col gap-2">
				{events.length === 0 ? (
					<p className="text-muted-foreground text-xs">{t('noEvents')}</p>
				) : (
					events.map((event) => (
						<EventCard
							key={`${event.type}-${event.date.join('-')}-${event.title}`}
							event={event}
						/>
					))
				)}
			</div>
		</article>
	);
};

const EventCard = ({ event }: { event: LunarDateNotification }) => {
	const { locale } = useI18n();
	const lunarLabel = formatPreviewLunarLine(event.date, locale);
	return (
		<div
			className="min-w-0 rounded-md border bg-muted/20 px-2 py-1 
		transition-colors hover:bg-muted hover:shadow-sm">
			<p className="truncate text-sm font-medium">{event.title}</p>
			<p className="text-xs text-muted-foreground">
				{lunarLabel} - ({formatDate(event.date)})
			</p>
			{event.description ? (
				<p className="line-clamp-2 sm:line-clamp-3">{event.description}</p>
			) : null}
		</div>
	);
};

export default MonthCard;
