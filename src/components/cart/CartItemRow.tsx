import { Lunar } from 'lunar-javascript';
import { Button } from '@/components/ui/button';
import { getMonthRuleName } from '@/lib/wizard/constants';
import { getLunarDayLabelFromGregorian } from '@/lib/wizard/preview-format';
import type { CartItem } from '@/store/calendar-store';
import { useCalendarStore } from '@/store/calendar-store';

type CartItemRowProps = {
	item: CartItem;
};

const CartItemRow = ({ item }: CartItemRowProps) => {
	const removeItem = useCalendarStore((state) => state.removeItem);

	const previewDate = (() => {
		try {
			const solar = Lunar.fromYmd(
				new Date().getFullYear(),
				item.lunarMonth,
				item.lunarDay,
			).getSolar();
			return getLunarDayLabelFromGregorian([
				solar.getYear(),
				solar.getMonth(),
				solar.getDay(),
			]);
		} catch {
			return `Day ${item.lunarDay}`;
		}
	})();

	return (
		<div className="grid gap-3 rounded-lg border p-4 md:grid-cols-[1fr_1fr_2fr_auto] md:items-end">
			<div className="space-y-2">
				<h2>Lunar month</h2>
				<p>{item.lunarMonth} - {getMonthRuleName(item.lunarMonth)}</p>
			</div>

			<div className="space-y-2">
				<h2>Lunar day</h2>
				<p>{item.lunarDay} - {previewDate}</p>
			</div>

			<div className="space-y-2">
				<h2>Title</h2>
				<p>{item.title}</p>
			</div>

			<Button
				type="button"
				variant="outline"
				onClick={() => removeItem(item.id)}>
				Delete
			</Button>
		</div>
	);
};

export default CartItemRow;
