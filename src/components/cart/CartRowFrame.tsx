import { type ReactNode, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useT } from '@/lib/i18n/I18nProvider';
import EditDialog from './EditDialog';

type CartRowFrameProps = {
	summary: ReactNode;
	form: ReactNode;
	onSave: () => boolean;
	onRemove: () => void;
	onReset: () => void;
};

const CartRowFrame = ({
	summary,
	form,
	onSave,
	onRemove,
	onReset,
}: CartRowFrameProps) => {
	const [open, setOpen] = useState(false);
	const t = useT();

	const onDialogChange = (isOpen: boolean) => {
		onReset();
		setOpen(isOpen);
	};

	const handleCancel = () => {
		onReset();
		setOpen(false);
	};

	const handleSave = () => {
		if (onSave()) {
			setOpen(false);
		}
	};

	return (
		<>
			<EditDialog
				title={t('editItem')}
				open={open}
				onOpenChange={onDialogChange}
				onCancel={handleCancel}
				onSave={handleSave}>
				{form}
			</EditDialog>
			<div className="flex flex-col gap-4 rounded-lg border-2 border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
				<div className="min-w-0 flex-1">{summary}</div>
				<div className="flex shrink-0 justify-end gap-2">
					<Button type="button" variant="outline" onClick={() => setOpen(true)}>
						{t('edit')}
					</Button>
					<Button type="button" variant="destructive" onClick={onRemove}>
						{t('delete')}
					</Button>
				</div>
			</div>
		</>
	);
};

export default CartRowFrame;
