import { icsDraftFromItem, icsDraftToOverrides } from '@ics';
import { getCatalogItem, getMonthlyEvent } from '@lunar-dates/constants';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { reportCartChange } from '@/lib/wizard/cart-toast';
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

	const onRemove = (): void => {
		removeItem(item.id);
		if (item.kind === 'monthly') {
			const event = getMonthlyEvent(item.monthlyId);
			const title = event?.title ?? item.monthlyId;
			reportCartChange({
				action: 'removed',
				title,
				lunarDate: `每月${title}`,
				toastId: item.id,
			});
			return;
		}

		const event = getCatalogItem(item.catalogId);
		reportCartChange({
			action: 'removed',
			title: event?.title ?? item.catalogId,
			lunarDate: `${event?.lunarMonthLabel ?? ''}${event?.lunarDayLabel ?? ''}`,
			toastId: item.id,
		});
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
			<div className="flex flex-col gap-3 border-2 border-gray-200 rounded-lg p-4 sm:flex-row sm:items-center sm:justify-between">
				<p className="min-w-0 text-lg font-bold">{label}</p>
				<div className="flex gap-2">
					<Button type="button" variant="outline" onClick={() => setOpen(true)}>
						Edit
					</Button>
					<Button type="button" variant="destructive" onClick={onRemove}>
						Delete
					</Button>
				</div>
			</div>
		</>
	);
};

export default CartPickRow;
