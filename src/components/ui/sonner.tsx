import {
	CircleCheckIcon,
	InfoIcon,
	Loader2Icon,
	OctagonXIcon,
	TriangleAlertIcon,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { Toaster as Sonner, type ToasterProps } from 'sonner';

const TOASTER_STYLES = {
	'--normal-bg': 'var(--popover)',
	'--normal-text': 'var(--popover-foreground)',
	'--normal-border': 'var(--border)',
	'--border-radius': 'var(--radius)',
	'--success-bg': 'var(--color-green-100)',
	'--success-border': 'var(--color-green-300)',
	'--success-text': 'var(--color-green-800)',
	'--warning-bg': 'var(--color-amber-100)',
	'--warning-border': 'var(--color-amber-300)',
	'--warning-text': 'var(--color-amber-900)',
	'--error-bg': 'var(--color-red-100)',
	'--error-border': 'var(--color-red-300)',
	'--error-text': 'var(--color-red-800)',
} as React.CSSProperties;

const Toaster = ({ ...props }: ToasterProps) => {
	const { theme = 'system' } = useTheme();

	return (
		<Sonner
			richColors
			theme={theme as ToasterProps['theme']}
			className="toaster group"
			icons={{
				success: <CircleCheckIcon className="size-4" />,
				info: <InfoIcon className="size-4" />,
				warning: <TriangleAlertIcon className="size-4" />,
				error: <OctagonXIcon className="size-4" />,
				loading: <Loader2Icon className="size-4 animate-spin" />,
			}}
			style={TOASTER_STYLES}
			{...props}
		/>
	);
};

export default Toaster;
