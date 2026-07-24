import { getLunarDateNotifications } from '@lib/lunar-dates/lunar-dates';
import { Button } from './components/ui/button';
import './index.css';
import { generateLunarCalendarIcs } from './lib/lunar-dates-ics';

const lunarDatesNotifications = getLunarDateNotifications({
	startSolarYear: 2026,
	startSolarMonth: 6,
	numberOfYears: 5,
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
			<Button onClick={onClick}>
				Download ICS File
			</Button>
		</div>
	);
}

export default App;
