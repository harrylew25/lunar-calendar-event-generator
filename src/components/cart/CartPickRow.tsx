import { icsDraftFromItem, icsDraftToOverrides } from '@ics';
import { getCatalogItem, getMonthlyEvent } from '@lunar-dates/constants';
import { getSolarTerm } from '@lunar-dates/solar-terms';
import { useState } from 'react';
import { reportCartChange } from '@/lib/wizard/cart-toast';
import type {
	CatalogCartItem,
	MonthlyCartItem,
	SolarTermCartItem,
} from '@/store/calendar-store';
import { useCalendarStore } from '@/store/calendar-store';
import CartRowFrame from './CartRowFrame';
import IcsOverrideFields from './IcsOverrideFields';

type CartPickRowProps = {
	item: MonthlyCartItem | CatalogCartItem | SolarTermCartItem;
};

const cartPickLabel = (
	item: MonthlyCartItem | CatalogCartItem | SolarTermCartItem,
): string => {
	if (item.kind === 'monthly') {
		return getMonthlyEvent(item.monthlyId)?.cartLabel ?? item.monthlyId;
	}
	if (item.kind === 'solarTerm') {
		return getSolarTerm(item.solarTermId)?.title ?? item.solarTermId;
	}
	return getCatalogItem(item.catalogId)?.cartLabel ?? item.catalogId;
};

const CartPickRow = ({ item }: CartPickRowProps) => {
	const [icsDraft, setIcsDraft] = useState(() => icsDraftFromItem(item));
	const removeItem = useCalendarStore((state) => state.removeItem);
	const updateItem = useCalendarStore((state) => state.updateItem);
	const label = cartPickLabel(item);

	const resetDraftFromItem = () => {
		setIcsDraft(icsDraftFromItem(item));
	};

	const handleSave = () => {
		return updateItem(item.id, icsDraftToOverrides(icsDraft));
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

		if (item.kind === 'solarTerm') {
			const title = getSolarTerm(item.solarTermId)?.title ?? item.solarTermId;
			reportCartChange({
				action: 'removed',
				title,
				lunarDate: title,
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
		<CartRowFrame
			onSave={handleSave}
			onRemove={onRemove}
			onReset={resetDraftFromItem}
			summary={<p className="text-lg font-bold">{label}</p>}
			form={
				<>
					<p className="mb-4 text-lg font-bold">{label}</p>
					<IcsOverrideFields
						idPrefix={`pick-${item.id}`}
						value={icsDraft}
						onChange={setIcsDraft}
					/>
				</>
			}
		/>
	);
};

export default CartPickRow;
