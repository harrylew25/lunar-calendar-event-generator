import type { ReactElement } from 'react';
import { toast } from 'sonner';

type CartToastAction = 'added' | 'removed';

type ReportCartChangeInput = {
	action: CartToastAction;
	title: string;
	lunarDate: string;
	toastId?: string;
};

const CART_TOAST_TITLE: Record<CartToastAction, string> = {
	added: 'Added',
	removed: 'Removed',
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

	customToast(CART_TOAST_TITLE[action], {
		id: toastId,
		description,
		descriptionClassName: 'min-w-0',
	});
};

export { reportCartChange };
