import { icsDraftFromItem, icsDraftToOverrides } from '@ics';
import { useState } from 'react';
import InputField from '@/components/form/input-field';
import { Button } from '@/components/ui/button';
import Label from '@/components/ui/label';
import SelectField from '@/components/ui/select-field';
import { Textarea } from '@/components/ui/textarea';
import { LUNAR_DAY_NAMES, monthRules } from '@/lib/lunar-dates/constants';
import { dedupedMonthRules, LUNAR_DAY_OPTIONS } from '@/lib/wizard/constants';
import type { CustomCartItem } from '@/store/calendar-store';
import { useCalendarStore } from '@/store/calendar-store';
import AlertToolTip from './AlertToolTip';
import EditDialog from './EditDialog';
import IcsOverrideFields from './IcsOverrideFields';

type CartItemRowProps = {
	item: CustomCartItem;
};

//  TODO: move to constants file
const END_OF_MONTH_MESSAGE =
	"Not every lunar month has 30 days. We will use 29th if the month doesn't have 30 days.";

const LEAP_MONTH_MESSAGE =
	'We will mark leap month for the first year, and then second year onward, revert to normal lunar month';

const is30thLunarDay = (lunarDay: number) => lunarDay === 30;
const isLeapMonth = (lunarMonth: number) => lunarMonth < 0;

const CartItemRow = ({ item }: CartItemRowProps) => {
	const [open, setOpen] = useState(false);
	const removeItem = useCalendarStore((state) => state.removeItem);
	const updateItem = useCalendarStore((state) => state.updateItem);

	const [lunarMonth, setLunarMonth] = useState(String(item.lunarMonth));
	const [lunarDay, setLunarDay] = useState(String(item.lunarDay));
	const [title, setTitle] = useState(item.title.trim());
	const [description, setDescription] = useState(
		(item.description ?? '').trim(),
	);
	const [icsDraft, setIcsDraft] = useState(() => icsDraftFromItem(item));

	const resetDraftFromItem = () => {
		setLunarMonth(String(item.lunarMonth));
		setLunarDay(String(item.lunarDay));
		setTitle(item.title.trim());
		setDescription((item.description ?? '').trim());
		setIcsDraft(icsDraftFromItem(item));
	};

	const previewDate = (item: CustomCartItem) => {
		const month = monthRules.find(
			(rule) => rule.value === item.lunarMonth,
		)?.name;
		const day = LUNAR_DAY_NAMES.find(
			(day) => day.value === item.lunarDay,
		)?.name;
		return { month, day };
	};

	const handleSave = () => {
		updateItem(item.id, {
			lunarMonth: Number(lunarMonth),
			lunarDay: Number(lunarDay),
			title: title.trim(),
			description: description.trim(),
			...icsDraftToOverrides(icsDraft),
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
			<EditDialog
				title="Edit Item"
				open={open}
				onOpenChange={onDialogChange}
				onCancel={handleCancel}
				onSave={handleSave}>
				<InputField
					id="title"
					label="Title"
					value={title}
					onChange={setTitle}
					className="mb-4"
				/>
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
				<div className="mt-4 mb-4">
					<Label htmlFor="description" className="mb-2">
						Description
					</Label>
					<Textarea
						id="description"
						rows={4}
						value={description}
						onChange={(e) => setDescription(e.target.value)}
					/>
				</div>
				<IcsOverrideFields
					idPrefix={`custom-${item.id}`}
					value={icsDraft}
					onChange={setIcsDraft}
				/>
			</EditDialog>
			<div className="flex justify-between items-center border-2 border-gray-200 rounded-lg p-4">
				<div>
					<p className="text-lg font-bold">{item.title}</p>
					<div className="flex items-center gap-2">
						{previewDate(item).month}
						{isLeapMonth(item.lunarMonth) && (
							<AlertToolTip
								description={LEAP_MONTH_MESSAGE}
								iconType="octagon"
								color="yellow"
							/>
						)}
						{' - '}
						{previewDate(item).day}
						{is30thLunarDay(item.lunarDay) && (
							<AlertToolTip description={END_OF_MONTH_MESSAGE} color="yellow" />
						)}
					</div>
					<div>{item.description} </div>
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
