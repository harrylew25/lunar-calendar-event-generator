import { OctagonAlertIcon, TriangleAlertIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip';

interface AlertToolTipProps {
	label: string;
	description: string | ReactNode;
	iconType?: 'octagon' | 'triangle';
	color?: 'yellow' | 'red';
}

const AlertToolTip = ({
	label,
	description,
	iconType = 'triangle',
	color = 'red',
}: AlertToolTipProps) => {
	const IconComponent =
		iconType === 'triangle' ? TriangleAlertIcon : OctagonAlertIcon;

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<button type="button" aria-label={label} className="inline-flex">
					<IconComponent
						aria-hidden="true"
						className={`w-4 h-4 text-${color}-500 animate-blink hover:text-${color}-600`}
					/>
				</button>
			</TooltipTrigger>
			<TooltipContent>{description}</TooltipContent>
		</Tooltip>
	);
};

export default AlertToolTip;
