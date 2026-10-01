import type { ReactElement } from 'react';
import CartPickRow from '@/components/cart/CartPickRow';
import CustomCartItemRow from '@/components/cart/CustomCartItemRow';
import { Button } from '@/components/ui/button';
import type { CartItem } from '@/store/calendar-store';
import { useCalendarStore } from '@/store/calendar-store';

const CartStep = () => {
	const cart = useCalendarStore((state) => state.cart);
	const startYear = useCalendarStore((state) => state.startYear);
	const loopYears = useCalendarStore((state) => state.loopYears);
	const endYear = startYear + loopYears;
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
				<h2>
					Expanding lunar years from <strong>{startYear}</strong> through{' '}
					<strong>{endYear}</strong>
				</h2>
			</div>

			<div className="flex flex-col gap-4">
				{cart.length === 0 ? (
					<p className="text-muted-foreground rounded-lg border border-dashed p-8 text-center">
						Your cart is empty. Go back to add dates.
					</p>
				) : (
					cart.map((item) => <CartRow key={item.id} item={item} />)
				)}
			</div>

			<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
				<Button
					type="button"
					variant="outline"
					className="w-full sm:w-auto"
					onClick={() => setStep('select')}>
					Back
				</Button>
				<Button
					type="button"
					className="w-full sm:w-auto"
					onClick={confirmAndExpand}
					disabled={cart.length === 0}>
					Confirm & preview
				</Button>
				<Button
					type="button"
					variant="destructive"
					className="w-full sm:w-auto"
					onClick={clearAll}
					disabled={cart.length === 0}>
					Clear all
				</Button>
			</div>
		</div>
	);
};

export default CartStep;

type CartRowProps = { item: CartItem };

const CartRow = ({ item }: CartRowProps): ReactElement =>
	item.kind === 'custom' ? (
		<CustomCartItemRow item={item} />
	) : (
		<CartPickRow item={item} />
	);
