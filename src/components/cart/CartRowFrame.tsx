import { type ReactNode, useState } from 'react';
import { Button } from '@/components/ui/button';
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
				title="Edit Item"
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

export default CartRowFrame;
