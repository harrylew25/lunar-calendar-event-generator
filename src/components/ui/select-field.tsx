import Label from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

export type SelectFieldOption = {
	label: string;
	value: string;
};

interface SelectFieldProps {
	id: string;
	label: string;
	value: string;
	onValueChange: (value: string) => void;
	options: SelectFieldOption[];
	className?: string;
	triggerClassName?: string;
}

const SelectField = ({
	id,
	label,
	value,
	onValueChange,
	options,
	className,
	triggerClassName = 'max-w-xs',
}: SelectFieldProps) => {
	return (
		<div className={cn('space-y-2', className)}>
			<Label htmlFor={id}>{label}</Label>
			<Select value={value} onValueChange={onValueChange}>
				<SelectTrigger id={id} className={cn('w-full', triggerClassName)}>
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					{options.map((option) => (
						<SelectItem key={option.value} value={option.value}>
							{option.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
};

export default SelectField;
