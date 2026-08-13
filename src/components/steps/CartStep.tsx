import CartItemRow from '@/components/cart/CartItemRow';
import { Button } from '@/components/ui/button';
import { useCalendarStore } from '@/store/calendar-store';

const CartStep = () => {
	const cart = useCalendarStore((state) => state.cart);
	const startYear = useCalendarStore((state) => state.startYear);
	const loopYears = useCalendarStore((state) => state.loopYears);
	const setStep = useCalendarStore((state) => state.setStep);
	const confirmAndExpand = useCalendarStore((state) => state.confirmAndExpand);
	const clearAll = useCalendarStore((state) => state.clearAll);

	return (
		<div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
			<div>
				<h2 className="text-2xl font-semibold">Cart</h2>
				<p className="text-muted-foreground mt-1">
					Review and edit your recurrence rules before expanding across{' '}
					{loopYears + 1} lunar years.
				</p>
			</div>
			<div className="space-y-2">
				<h2>Loop years: {loopYears} years</h2>
				<h2>Start year: {startYear}</h2>
			</div>

			<div className="flex flex-col gap-4">
				{cart.length === 0 ? (
					<p className="text-muted-foreground rounded-lg border border-dashed p-8 text-center">
						Your cart is empty. Go back to add dates.
					</p>
				) : (
					cart.map((item) => <CartItemRow key={item.id} item={item} />)
				)}
			</div>

			<div className="flex justify-between">
				<Button
					type="button"
					variant="outline"
					onClick={() => setStep('select')}>
					Back
				</Button>
				<Button
					type="button"
					onClick={confirmAndExpand}
					disabled={cart.length === 0}>
					Confirm & preview
				</Button>
				<Button
					type="button"
					variant="destructive"
					onClick={clearAll}
					disabled={cart.length === 0}>
					Clear all
				</Button>
			</div>
		</div>
	);
};

export { CartStep };
