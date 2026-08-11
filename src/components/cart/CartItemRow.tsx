import { Lunar } from 'lunar-javascript';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	dedupedMonthRules,
	getMonthRuleName,
	LUNAR_DAY_OPTIONS,
} from '@/lib/wizard/constants';
import { getLunarDayLabelFromGregorian } from '@/lib/wizard/preview-format';
import type { CartItem } from '@/store/calendar-store';
import { useCalendarStore } from '@/store/calendar-store';

type CartItemRowProps = {
	item: CartItem;
};

const CartItemRow = ({ item }: CartItemRowProps) => {
	const updateItem = useCalendarStore((state) => state.updateItem);
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
				<Label htmlFor={`month-${item.id}`}>Lunar month</Label>
				<Select
					value={String(item.lunarMonth)}
					onValueChange={(value) =>
						updateItem(item.id, { lunarMonth: Number(value) })
					}>
					<SelectTrigger id={`month-${item.id}`} className="w-full">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{dedupedMonthRules.map((rule) => (
							<SelectItem key={rule.value} value={String(rule.value)}>
								{rule.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div className="space-y-2">
				<Label htmlFor={`day-${item.id}`}>Lunar day</Label>
				<Select
					value={String(item.lunarDay)}
					onValueChange={(value) =>
						updateItem(item.id, { lunarDay: Number(value) })
					}>
					<SelectTrigger id={`day-${item.id}`} className="w-full">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{LUNAR_DAY_OPTIONS.map((day) => (
							<SelectItem key={day} value={String(day)}>
								{day}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<p className="text-muted-foreground text-xs">{previewDate}</p>
			</div>

			<div className="space-y-2">
				<Label htmlFor={`title-${item.id}`}>Title</Label>
				<Input
					id={`title-${item.id}`}
					value={item.title}
					onChange={(event) =>
						updateItem(item.id, { title: event.target.value.trim() })
					}
				/>
				<p className="text-muted-foreground text-xs">
					{getMonthRuleName(item.lunarMonth)}
				</p>
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

export { CartItemRow };
