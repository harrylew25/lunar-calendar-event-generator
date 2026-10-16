import { icsDraftFromItem, icsDraftToOverrides } from '@ics';
import { type ReactElement, useState } from 'react';
import { lunarDayLabel, lunarMonthLabel } from '@/lib/i18n/catalog-labels';
import { useI18n, useT } from '@/lib/i18n/I18nProvider';
import { reportCartChange } from '@/lib/wizard/cart-toast';
import type { CartItemInput, CustomCartItem } from '@/store/calendar-store';
import { useCalendarStore } from '@/store/calendar-store';
import AlertToolTip from './AlertToolTip';
import CartRowFrame from './CartRowFrame';
import CustomCartItemFields, {
	type CustomCartItemDraft,
} from './CustomCartItemFields';

type CustomCartItemRowProps = {
	item: CustomCartItem;
};

const draftFromItem = (item: CustomCartItem): CustomCartItemDraft => ({
	lunarMonth: String(item.lunarMonth),
	lunarDay: String(item.lunarDay),
	title: item.title.trim(),
	description: (item.description ?? '').trim(),
	ics: icsDraftFromItem(item),
});

const patchFromDraft = (draft: CustomCartItemDraft): CartItemInput => ({
	lunarMonth: Number(draft.lunarMonth),
	lunarDay: Number(draft.lunarDay),
	title: draft.title.trim(),
	description: draft.description.trim(),
	...icsDraftToOverrides(draft.ics),
});

const CustomCartItemRow = ({ item }: CustomCartItemRowProps): ReactElement => {
	const t = useT();
	const { locale } = useI18n();
	const removeItem = useCalendarStore((state) => state.removeItem);
	const updateItem = useCalendarStore((state) => state.updateItem);
	const [draft, setDraft] = useState(() => draftFromItem(item));

	const monthName = lunarMonthLabel(item.lunarMonth, locale);
	const dayName = lunarDayLabel(item.lunarDay, locale);
	const isLeapMonth = item.lunarMonth < 0;
	const is30thLunarDay = item.lunarDay === 30;

	const resetDraftFromItem = (): void => {
		setDraft(draftFromItem(item));
	};

	const handleSave = (): boolean => updateItem(item.id, patchFromDraft(draft));

	const handleRemove = (): void => {
		removeItem(item.id);
		reportCartChange({
			action: 'removed',
			title: item.title,
			lunarDate: `${monthName}${locale === 'en' ? ' ' : ''}${dayName}`,
			toastId: item.id,
		});
	};

	return (
		<CartRowFrame
			onSave={handleSave}
			onRemove={handleRemove}
			onReset={resetDraftFromItem}
			summary={
				<div className="min-w-0">
					<p className="truncate text-lg font-bold">{item.title}</p>
					<div className="flex items-center gap-2">
						{monthName}
						{isLeapMonth ? (
							<AlertToolTip
								label={t('leapMonth')}
								description={t('leapMonthHelp')}
								iconType="octagon"
								color="yellow"
							/>
						) : null}
						{' - '}
						{dayName}
						{is30thLunarDay ? (
							<AlertToolTip
								label={t('endOfMonth')}
								description={t('endOfMonthHelp')}
								color="yellow"
							/>
						) : null}
					</div>
					{item.description ? (
						<p className="line-clamp-2 sm:line-clamp-3">{item.description}</p>
					) : null}
				</div>
			}
			form={
				<CustomCartItemFields
					idPrefix={`custom-${item.id}`}
					value={draft}
					onChange={setDraft}
				/>
			}
		/>
	);
};

export default CustomCartItemRow;
