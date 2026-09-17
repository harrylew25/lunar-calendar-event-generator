import type {
	IcsEventOverrides,
	IcsEventVisibility,
	IcsTimeTransparent,
} from '@lunar-dates/lunar-dates.type';
import { ICS_EVENT_DEFAULTS } from './constants';
import {
	overridesToReminderForm,
	type ReminderUnit,
	reminderFormToOverrides,
} from './reminder-form';

type IcsDialogVisibility = Exclude<IcsEventVisibility, 'CONFIDENTIAL'>;

type IcsOverrideDraft = {
	location: string;
	amount: string;
	unit: ReminderUnit;
	hour: string;
	minute: string;
	timeTransparent: IcsTimeTransparent;
	visibility: IcsDialogVisibility;
};

const icsDraftFromItem = (item: IcsEventOverrides): IcsOverrideDraft => {
	const reminder = overridesToReminderForm(item);

	return {
		location: item.location ?? '',
		amount: String(reminder.amount),
		unit: reminder.unit,
		hour: String(reminder.hour),
		minute: String(reminder.minute),
		timeTransparent: item.timeTransparent ?? ICS_EVENT_DEFAULTS.timeTransparent,
		visibility: item.visibility === 'PRIVATE' ? 'PRIVATE' : 'PUBLIC',
	};
};

const icsDraftToOverrides = (draft: IcsOverrideDraft): IcsEventOverrides => {
	const location = draft.location.trim();

	return {
		location: location === '' ? undefined : location,
		...reminderFormToOverrides({
			amount: Number(draft.amount),
			unit: draft.unit,
			hour: Number(draft.hour),
			minute: Number(draft.minute),
		}),
		timeTransparent: draft.timeTransparent,
		visibility: draft.visibility,
	};
};

export type { IcsDialogVisibility, IcsOverrideDraft };
export { icsDraftFromItem, icsDraftToOverrides };
