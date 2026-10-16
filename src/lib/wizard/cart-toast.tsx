import type { ReactElement } from 'react';
import { toast } from 'sonner';
import { getLocale } from '@/lib/i18n/locale';
import { translate } from '@/lib/i18n/translate';

type CartToastAction = 'added' | 'removed';

type ReportCartChangeInput = {
	action: CartToastAction;
	title: string;
	lunarDate: string;
	toastId?: string;
};

const reportCartChange = ({
	action,
	title,
	lunarDate,
	toastId,
}: ReportCartChangeInput): void => {
	const customToast = action === 'added' ? toast.success : toast.warning;
	const description: ReactElement = (
		<>
			<span className="block truncate">{title}</span>
			<span className="block">{lunarDate}</span>
		</>
	);

	customToast(
		translate(getLocale(), action === 'added' ? 'added' : 'removed'),
		{
			id: toastId,
			description,
			descriptionClassName: 'min-w-0',
		},
	);
};

export { reportCartChange };
