import { icsDraftFromItem, icsDraftToOverrides } from '@ics';
import { getCatalogItem, getMonthlyEvent } from '@lunar-dates/constants';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { CatalogCartItem, MonthlyCartItem } from '@/store/calendar-store';
import { useCalendarStore } from '@/store/calendar-store';
import EditDialog from './EditDialog';
import IcsOverrideFields from './IcsOverrideFields';

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
	const [open, setOpen] = useState(false);
	const [icsDraft, setIcsDraft] = useState(() => icsDraftFromItem(item));
	const removeItem = useCalendarStore((state) => state.removeItem);
	const updateItem = useCalendarStore((state) => state.updateItem);
	const label = cartPickLabel(item);

	const resetDraftFromItem = () => {
		setIcsDraft(icsDraftFromItem(item));
	};

	const handleSave = () => {
		updateItem(item.id, icsDraftToOverrides(icsDraft));
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
			<EditDialog
				title="Edit Item"
				open={open}
				onOpenChange={onDialogChange}
				onCancel={handleCancel}
				onSave={handleSave}>
				<p className="mb-4 text-lg font-bold">{label}</p>
				<IcsOverrideFields
					idPrefix={`pick-${item.id}`}
					value={icsDraft}
					onChange={setIcsDraft}
				/>
			</EditDialog>
			<div className="flex justify-between items-center border-2 border-gray-200 rounded-lg p-4">
				<p className="text-lg font-bold">{label}</p>
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

export default CartPickRow;
