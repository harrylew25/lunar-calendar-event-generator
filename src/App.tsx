import CartStep from '@/components/steps/CartStep';
import DateSelectionStep from '@/components/steps/DateSelectionStep';
import PreviewStep from '@/components/steps/PreviewStep';
import { useCalendarStore } from '@/store/calendar-store';
import './index.css';

const App = () => {
	const step = useCalendarStore((state) => state.step);

	return (
		<main className="min-h-screen bg-background px-4 py-10 text-foreground">
			<div className="mx-auto mb-8 max-w-6xl">
				<h1 className="text-3xl font-bold tracking-tight">
					Lunar Calendar Event Generator
				</h1>
				<p className="text-muted-foreground mt-2">
					Build custom lunar recurrence rules and export them as an ICS
					calendar.
				</p>
			</div>

			{step === 'select' && <DateSelectionStep />}
			{step === 'cart' && <CartStep />}
			{step === 'preview' && <PreviewStep />}
		</main>
	);
};

export default App;
