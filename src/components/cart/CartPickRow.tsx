import { getCatalogItem, getMonthlyEvent } from '@lunar-dates/constants';
import { Button } from '@/components/ui/button';
import type { CatalogCartItem, MonthlyCartItem } from '@/store/calendar-store';
import { useCalendarStore } from '@/store/calendar-store';

type CartPickRowProps = {
	item: MonthlyCartItem | CatalogCartItem;
};

const cartPickLabel = (item: MonthlyCartItem | CatalogCartItem): string => {
	if (item.kind === 'monthly') {
		return getMonthlyEvent(item.monthlyId)?.cartLabel ?? item.monthlyId;
	}
	return getCatalogItem(item.catalogId)?.cartLabel ?? item.catalogId;
};

const CartPickRow = ({ item }: CartPickRowProps) => {
	const removeItem = useCalendarStore((state) => state.removeItem);
	const label = cartPickLabel(item);

	return (
		<div className="flex justify-between items-center border-2 border-gray-200 rounded-lg p-4">
			<p className="text-lg font-bold">{label}</p>
			<Button
				type="button"
				variant="outline"
				onClick={() => removeItem(item.id)}>
				Delete
			</Button>
		</div>
	);
};

export default CartPickRow;
