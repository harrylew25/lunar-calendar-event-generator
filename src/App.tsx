import './index.css';
import { getLunarDate, getLunarDateNotifications } from './lib/lunar-dates/lunar-dates';

console.log(
	getLunarDateNotifications({
		startSolarYear: 2026,
		startSolarMonth: 6,
		numberOfYears: 5,
	}),
);

export function App() {
	return (
		<div>
			<h1>Hello Bun App</h1>
			<p>{getLunarDate(new Date())} </p>
		</div>
	);
}

export default App;
