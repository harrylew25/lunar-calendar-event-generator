import { LunarMonth, LunarYear, Solar } from 'lunar-javascript';
import './index.css';
import { monthRules } from './lib/constants';
import { getLunarDate } from './lib/generator';

const NUMBER_OF_YEAR = 5;
//  enum for the type
type DATE_TYPE = 'chuyi' | 'shiwu';

type LUNAR_DATE_NOTIFICATION = {
	date: string;
	type: DATE_TYPE;
	summary: string;
	description: string;
};

const getMonthRule = (month?: string) => {
	if (!month) {
		return null;
	}
	return monthRules.find((rule) => month.includes(rule.name)) || null;
};

const getFirstandFifteenDay = (
	year: number,
	monthNumber: number,
	isLeap: boolean,
): [string, string] => {
	const firstJulianDay = LunarMonth.fromYm(
		year,
		monthNumber,
		isLeap,
	).getFirstJulianDay();

	const solarDate = Solar.fromJulianDay(firstJulianDay);
	const fifteenDay = solarDate.next(14);

	return [solarDate.toYmd(), fifteenDay.toYmd()];
};

const getDatesData = () => {
	const currentLunarYear = LunarYear.fromYear(2020);
	const allNotifications: LUNAR_DATE_NOTIFICATION[] = [];

	for (let i = 0; i <= NUMBER_OF_YEAR; i++) {
		const currentYearObj = currentLunarYear.next(i);
		const yearValue = currentYearObj.getYear();

		const months = currentYearObj
			.getMonthsInYear()
			.toString()
			.split(',')
			.map((monthName) => getMonthRule(monthName))
			.filter((rule) => rule !== null);

		months.forEach((rule) => {
			const isLeapMonth = rule.value < 0;
			const absoluteMonthNum = Math.abs(rule.value);

			const [chuyiDate, shiwuDate] = getFirstandFifteenDay(
				yearValue,
				absoluteMonthNum,
				isLeapMonth,
			);

			allNotifications.push({
				date: chuyiDate,
				type: 'chuyi',
				summary: `农历${rule.name}初一 (${rule.en} Day 1)`,
				description: `Lunar Calendar: ${rule.en}, Day 1 (New Moon)`,
			});

			allNotifications.push({
				date: shiwuDate,
				type: 'shiwu',
				summary: `农历${rule.name}十五 (${rule.en} Day 15)`,
				description: `Lunar Calendar: ${rule.en}, Day 15 (Full Moon)`,
			});
		});
	}

	return allNotifications;
};

console.log(getDatesData());

export function App() {
	// getDatesData();

	return (
		<div>
			<h1>Hello Bun App</h1>
			<p>{getLunarDate(new Date())} </p>
		</div>
	);
}

export default App;
