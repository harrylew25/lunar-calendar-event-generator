import { Button } from '@/components/ui/button';
import { getMonthRuleName } from '@/lib/wizard/constants';
import { getLunarDayLabelFromGregorian } from '@/lib/wizard/preview-format';
import type { CartItem } from '@/store/calendar-store';
import { useCalendarStore } from '@/store/calendar-store';
import { Lunar } from 'lunar-javascript';
import { Fragment, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';

type CartItemRowProps = {
	item: CartItem;
};

const CartItemRow = ({ item }: CartItemRowProps) => {
	const [open, setOpen] = useState(false);
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
		<>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Edit Item</DialogTitle>
						<DialogDescription>Edit the item details</DialogDescription>
					</DialogHeader>
				</DialogContent>
			</Dialog>
			<div className="grid gap-3 rounded-lg border p-4 md:grid-cols-[1fr_1fr_2fr_auto] md:items-end">
				<div className="space-y-2">
					<h2>Lunar month</h2>
					<p>
						{item.lunarMonth} - {getMonthRuleName(item.lunarMonth)}
					</p>
				</div>

				<div className="space-y-2">
					<h2>Lunar day</h2>
					<p>
						{item.lunarDay} - {previewDate}
					</p>
				</div>

				<div className="space-y-2">
					<h2>Title</h2>
					<p>{item.title}</p>
				</div>
				<div className="flex gap-2">
					<Button
						type="button"
						variant="outline"
						onClick={() => setOpen(true)}>
						Edit
					</Button>
					<Button
						type="button"
						variant="outline"
						onClick={() => removeItem(item.id)}>
						Delete
					</Button>
				</div>
			</div>
		</>
	);
};

export default CartItemRow;
