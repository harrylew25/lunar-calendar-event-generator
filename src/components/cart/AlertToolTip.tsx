import { OctagonAlertIcon, TriangleAlertIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip';

interface AlertToolTipProps {
	description: string | ReactNode;
	iconType?: 'octagon' | 'triangle';
	color?: 'yellow' | 'red';
}

const AlertToolTip = ({
	description,
	iconType = 'triangle',
	color = 'red',
}: AlertToolTipProps) => {
	const IconComponent =
		iconType === 'triangle' ? TriangleAlertIcon : OctagonAlertIcon;
	return (
		<Tooltip>
			<TooltipTrigger>
				<IconComponent
					className={`w-4 h-4 text-${color}-500 animate-blink hover:text-${color}-600`}
				/>
			</TooltipTrigger>
			<TooltipContent>{description}</TooltipContent>
		</Tooltip>
	);
};

export default AlertToolTip;
