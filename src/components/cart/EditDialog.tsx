import type { SubmitEvent } from 'react';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';

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
	const handleSubmit = (event: SubmitEvent<HTMLFormElement>): void => {
		event.preventDefault();
		onSave();
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-h-[90vh] overflow-y-auto">
				<form autoComplete="off" onSubmit={handleSubmit}>
					<DialogHeader>
						<DialogTitle>{title}</DialogTitle>
						{description && (
							<DialogDescription>{description}</DialogDescription>
						)}
					</DialogHeader>
					<div className="mt-4">{children}</div>
					<DialogFooter>
						<div className="mt-4 flex justify-end gap-2">
							<Button type="button" variant="outline" onClick={onCancel}>
								Cancel
							</Button>
							<Button type="submit" variant="default">
								Save
							</Button>
						</div>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default EditDialog;
