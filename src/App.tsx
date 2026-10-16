import type { ReactElement } from 'react';
import Header from '@/components/Header';
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
			<Header />
			<main className="w-full flex-1 px-4 pb-10">
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
