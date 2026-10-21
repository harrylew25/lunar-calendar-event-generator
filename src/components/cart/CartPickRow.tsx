import { icsDraftFromItem, icsDraftToOverrides } from '@ics';
import { getCatalogItem } from '@lunar-dates/constants';
import { useState } from 'react';
import {
	festivalCartLabel,
	festivalTitle,
	lunarDayLabel,
	lunarMonthLabel,
	monthlyCartLabel,
	monthlyTitle,
	solarTermTitle,
} from '@/lib/i18n/catalog-labels';
import { useI18n, useT } from '@/lib/i18n/I18nProvider';
import type { Locale } from '@/lib/i18n/locale';
import { reportCartChange } from '@/lib/wizard/cart-toast';
import type {
	CatalogCartItem,
	MonthlyCartItem,
	SolarTermCartItem,
} from '@/store/calendar-store';
import { useCalendarStore } from '@/store/calendar-store';
import CartRowFrame from './CartRowFrame';
import IcsOverrideFields from './IcsOverrideFields';

type CartPickItem = MonthlyCartItem | CatalogCartItem | SolarTermCartItem;

type CartPickRowProps = {
	item: CartPickItem;
};

const pickLabel = (item: CartPickItem, locale: Locale): string => {
	if (item.kind === 'monthly') {
		return monthlyCartLabel(item.monthlyId, locale);
	}
	if (item.kind === 'solarTerm') {
		return solarTermTitle(item.solarTermId, locale);
	}
	return festivalCartLabel(item.catalogId, locale);
};

const CartPickRow = ({ item }: CartPickRowProps) => {
	const t = useT();
	const { locale } = useI18n();
	const [icsDraft, setIcsDraft] = useState(() => icsDraftFromItem(item));
	const removeItem = useCalendarStore((state) => state.removeItem);
	const updateItem = useCalendarStore((state) => state.updateItem);
	const label = pickLabel(item, locale);

	const resetDraftFromItem = () => {
		setIcsDraft(icsDraftFromItem(item));
	};

	const handleSave = () => {
		return updateItem(item.id, icsDraftToOverrides(icsDraft));
	};

	const onRemove = (): void => {
		removeItem(item.id);
		if (item.kind === 'monthly') {
			const title = monthlyTitle(item.monthlyId, locale);
			reportCartChange({
				action: 'removed',
				title,
				lunarDate: t('everyMonthDate', { title }),
				toastId: item.id,
			});
			return;
		}

		if (item.kind === 'solarTerm') {
			const title = solarTermTitle(item.solarTermId, locale);
			reportCartChange({
				action: 'removed',
				title,
				lunarDate: title,
				toastId: item.id,
			});
			return;
		}

		const event = getCatalogItem(item.catalogId);
		const title = festivalTitle(item.catalogId, locale);
		const month = event ? lunarMonthLabel(event.lunarMonth, locale) : '';
		const day = event ? lunarDayLabel(event.lunarDay, locale) : '';
		const separator = locale === 'en' ? ' ' : '';
		reportCartChange({
			action: 'removed',
			title,
			lunarDate: `${month}${separator}${day}`,
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
