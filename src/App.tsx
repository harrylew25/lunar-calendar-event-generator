import type { ReactElement } from 'react';
import PageFooter from '@/components/PageFooter';
import CartStep from '@/components/steps/CartStep';
import DateSelectionStep from '@/components/steps/DateSelectionStep';
import PreviewStep from '@/components/steps/PreviewStep';
import Toaster from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useCalendarStore } from '@/store/calendar-store';
import './index.css';

const App = (): ReactElement => {
	const step = useCalendarStore((state) => state.step);

	return (
		<div className="flex min-h-dvh w-full flex-col bg-background text-foreground">
			<main className="w-full flex-1 px-4 py-10">
				<div className="mx-auto mb-8 max-w-6xl">
					<h1 className="text-3xl font-bold tracking-tight">
						Lunar Calendar Event Generator
					</h1>
					<p className="text-muted-foreground mt-2">
						Build custom lunar recurrence rules and export them as an ICS
						calendar.
					</p>
				</div>
				<TooltipProvider>
					{step === 'select' && <DateSelectionStep />}
					{step === 'cart' && <CartStep />}
					{step === 'preview' && <PreviewStep />}
				</TooltipProvider>
			</main>
			<PageFooter />
			<Toaster />
		</div>
	);
};

export default App;
