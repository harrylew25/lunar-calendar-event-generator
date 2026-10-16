import { FESTIVALS, MONTHLY_EVENTS } from '@lunar-dates/constants';
import Checkbox from '@/components/ui/checkbox';
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
	FieldLegend,
	FieldSet,
} from '@/components/ui/field';
import {
	festivalCartLabel,
	festivalTitle,
	lunarDayLabel,
	lunarMonthLabel,
	monthlyCartLabel,
	monthlyTitle,
} from '@/lib/i18n/catalog-labels';
import { useI18n, useT } from '@/lib/i18n/I18nProvider';
import { reportCartChange } from '@/lib/wizard/cart-toast';
import { useCalendarStore } from '@/store/calendar-store';

const EventPickOptions = () => {
	const t = useT();
	const { locale } = useI18n();
	const cart = useCalendarStore((state) => state.cart);
	const setMonthlyEvent = useCalendarStore((state) => state.setMonthlyEvent);
	const setCatalogItem = useCalendarStore((state) => state.setCatalogItem);

	const isMonthlyChecked = (id: (typeof MONTHLY_EVENTS)[number]['id']) =>
		cart.some((item) => item.kind === 'monthly' && item.monthlyId === id);

	const isCatalogChecked = (id: (typeof FESTIVALS)[number]['id']) =>
		cart.some((item) => item.kind === 'catalog' && item.catalogId === id);

	return (
		<div className="flex flex-col gap-6">
			<FieldSet>
				<FieldLegend variant="label">{t('everyLunarMonth')}</FieldLegend>
				<FieldDescription>{t('everyLunarMonthBody')}</FieldDescription>
				<FieldGroup data-slot="checkbox-group">
					{MONTHLY_EVENTS.map((event) => {
						const inputId = `include-${event.id}`;
						const title = monthlyTitle(event.id);

						return (
							<Field key={event.id} orientation="horizontal">
								<Checkbox
									id={inputId}
									checked={isMonthlyChecked(event.id)}
									onCheckedChange={(value: boolean | 'indeterminate') => {
										const included = value === true;
										setMonthlyEvent(event.id, included);
										reportCartChange({
											action: included ? 'added' : 'removed',
											title,
											lunarDate: t('everyMonthDate', { title }),
											toastId: event.id,
										});
									}}
								/>
								<FieldLabel htmlFor={inputId} className="font-normal">
									{monthlyCartLabel(event.id, locale)}
								</FieldLabel>
							</Field>
						);
					})}
				</FieldGroup>
			</FieldSet>
			<FieldSet>
				<FieldLegend variant="label">{t('festivals')}</FieldLegend>
				<FieldDescription>{t('festivalsBody')}</FieldDescription>
				<FieldGroup data-slot="checkbox-group" className="grid grid-cols-2">
					{FESTIVALS.map((event) => {
						const inputId = `include-${event.id}`;

						return (
							<Field key={event.id} orientation="horizontal">
								<Checkbox
									id={inputId}
									checked={isCatalogChecked(event.id)}
									onCheckedChange={(value: boolean | 'indeterminate') => {
										const included = value === true;
										setCatalogItem(event.id, included);
										reportCartChange({
											action: included ? 'added' : 'removed',
											title: festivalTitle(event.id, locale),
											lunarDate: `${lunarMonthLabel(event.lunarMonth, locale)}${locale === 'en' ? ' ' : ''}${lunarDayLabel(event.lunarDay, locale)}`,
											toastId: `catalog-${event.id}`,
										});
									}}
								/>
								<FieldLabel htmlFor={inputId} className="font-normal">
									{festivalCartLabel(event.id, locale)}
								</FieldLabel>
							</Field>
						);
					})}
				</FieldGroup>
			</FieldSet>
		</div>
	);
};

export default EventPickOptions;
