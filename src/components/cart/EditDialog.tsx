import { Button } from '../ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '../ui/dialog';

interface EditDialogProps {
	title: string;
	description?: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	children: React.ReactNode;
	onCancel: () => void;
	onSave: () => void;
}

const EditDialog = ({
	title,
	description,
	open,
	onOpenChange,
	children,
	onCancel,
	onSave,
}: EditDialogProps) => {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					{description && <DialogDescription>{description}</DialogDescription>}
					<article className="mt-4">{children}</article>
				</DialogHeader>
				<DialogFooter>
					<div className="mt-4 flex justify-end gap-2">
						<Button type="button" variant="outline" onClick={onCancel}>
							Cancel
						</Button>
						<Button type="button" variant="default" onClick={onSave}>
							Save
						</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default EditDialog;
