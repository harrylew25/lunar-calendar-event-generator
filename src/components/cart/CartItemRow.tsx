import { Lunar } from 'lunar-javascript';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	dedupedMonthRules,
	getMonthRuleName,
	LUNAR_DAY_OPTIONS,
} from '@/lib/wizard/constants';
import { getLunarDayLabelFromGregorian } from '@/lib/wizard/preview-format';
import type { CartItem } from '@/store/calendar-store';
import { useCalendarStore } from '@/store/calendar-store';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import SelectField from '../ui/select-field';

type CartItemRowProps = {
	item: CartItem;
};

const CartItemRow = ({ item }: CartItemRowProps) => {
	const [open, setOpen] = useState(false);
	const removeItem = useCalendarStore((state) => state.removeItem);
	const updateItem = useCalendarStore((state) => state.updateItem);

	const [lunarMonth, setLunarMonth] = useState(String(item.lunarMonth));
	const [lunarDay, setLunarDay] = useState(String(item.lunarDay));
	const [title, setTitle] = useState(item.title.trim());

	const resetDraftFromItem = () => {
		setLunarMonth(String(item.lunarMonth));
		setLunarDay(String(item.lunarDay));
		setTitle(item.title.trim());
	};

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

	const handleSave = () => {
		updateItem(item.id, {
			lunarMonth: Number(lunarMonth),
			lunarDay: Number(lunarDay),
			title: title.trim(),
		});
		setOpen(false);
	};

	const onDialogChange = (isOpen: boolean) => {
		resetDraftFromItem();
		setOpen(isOpen);
	};

	const handleCancel = () => {
		resetDraftFromItem();
		setOpen(false);
	};

	return (
		<>
			<Dialog open={open} onOpenChange={onDialogChange}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Edit Item</DialogTitle>
						<DialogDescription>Edit the item details</DialogDescription>
						<div>
							<div className="mt-4 mb-4">
								<Label htmlFor="title" className="mb-2">
									Title
								</Label>
								{/* TODO: change this to debounce input */}
								<Input
									type="text"
									value={title}
									onChange={(e) => setTitle(e.target.value)}
								/>
							</div>
							<div className="grid gap-4 md:grid-cols-2">
								<SelectField
									id="lunar-month"
									label="Lunar month"
									value={lunarMonth}
									onValueChange={setLunarMonth}
									options={dedupedMonthRules.map((rule) => ({
										label: rule.name,
										value: String(rule.value),
									}))}
								/>
								<SelectField
									id="lunar-day"
									label="Lunar day"
									value={lunarDay}
									onValueChange={setLunarDay}
									options={LUNAR_DAY_OPTIONS.map((day) => ({
										label: String(day),
										value: String(day),
									}))}
								/>
							</div>
						</div>
						<div className="mt-4 flex justify-end gap-2">
							<Button type="button" variant="outline" onClick={handleCancel}>
								Cancel
							</Button>
							<Button type="button" variant="default" onClick={handleSave}>
								Save
							</Button>
						</div>
					</DialogHeader>
				</DialogContent>
			</Dialog>
			<div className="flex justify-between items-center border-2 border-gray-200 rounded-lg p-4">
				<div>
					<p className="text-lg font-bold">{item.title}</p>
					<div>
						{getMonthRuleName(item.lunarMonth)} {previewDate} |{' '}
						{item.lunarMonth} - {item.lunarDay}
					</div>
				</div>
				<div className="flex gap-2">
					<Button type="button" variant="outline" onClick={() => setOpen(true)}>
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
