import { Button } from './components/ui/button';
import { generateLunarCalendarIcs } from './lib/ics/index';
import { getLunarDateNotifications } from './lib/lunar-dates/index';
import './index.css';

const lunarDatesNotifications = getLunarDateNotifications({
	startSolarYear: 2026,
	startSolarMonth: 6,
	numberOfYears: 2,
	customDates: [
		{
			kind: 'lunar',
			lunarMonth: 1,
			lunarDay: 15,
			title: '正月十五 (from lunar)',
			description: '农历正月十五',
		},
		{
			kind: 'lunar',
			lunarMonth: 5,
			lunarDay: 5,
			title: '五月初五 (from lunar)',
			description: '农历五月初五',
		},
		{
			kind: 'lunar',
			lunarMonth: 9,
			lunarDay: 9,
			title: '九月初九 (from lunar)',
			description: '农历九月初九',
		},
	],
});

const icsFile = generateLunarCalendarIcs(lunarDatesNotifications);

export function App() {
	const onClick = (): void => {
		const blob = new Blob([icsFile], { type: 'text/calendar;charset=utf-8' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = 'lunar-calendar.ics';
		link.click();
		URL.revokeObjectURL(url);
	};

	return (
		<div>
			<h1>Hello Bun App</h1>
			<Button onClick={onClick}>Download ICS File</Button>
		</div>
	);
}

export default App;
