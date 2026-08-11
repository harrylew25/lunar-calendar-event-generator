import { CartItemRow } from '@/components/cart/CartItemRow';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { LOOP_YEAR_PRESETS } from '@/lib/wizard/constants';
import { useCalendarStore } from '@/store/calendar-store';

const CartStep = () => {
	const cart = useCalendarStore((state) => state.cart);
	const loopYears = useCalendarStore((state) => state.loopYears);
	const setStep = useCalendarStore((state) => state.setStep);
	const setLoopYears = useCalendarStore((state) => state.setLoopYears);
	const confirmAndExpand = useCalendarStore((state) => state.confirmAndExpand);

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
				<Label htmlFor="cart-loop-years">Loop years</Label>
				<Select
					value={String(loopYears)}
					onValueChange={(value) => setLoopYears(Number(value))}>
					<SelectTrigger id="cart-loop-years" className="w-full max-w-xs">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{LOOP_YEAR_PRESETS.map((years) => (
							<SelectItem key={years} value={String(years)}>
								{years} years ({years + 1} occurrences)
							</SelectItem>
						))}
					</SelectContent>
				</Select>
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
			</div>
		</div>
	);
};

export { CartStep };
