import { generateLunarCalendarIcs } from '@ics';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo, useState } from 'react';
import { YearPreviewGrid } from '@/components/preview/YearPreviewGrid';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCalendarStore } from '@/store/calendar-store';

const PreviewStep = () => {
	const expandedEvents = useCalendarStore((state) => state.expandedEvents);
	const setStep = useCalendarStore((state) => state.setStep);

	const availableYears = useMemo(() => {
		if (!expandedEvents?.length) {
			return [] as number[];
		}
		return [...new Set(expandedEvents.map((event) => event.date[0]))].sort(
			(a, b) => a - b,
		);
	}, [expandedEvents]);

	const [yearIndex, setYearIndex] = useState(0);
	const selectedYear = availableYears[yearIndex] ?? new Date().getFullYear();

	const handleDownload = (): void => {
		if (!expandedEvents?.length) {
			return;
		}
		const icsFile = generateLunarCalendarIcs(expandedEvents);
		const blob = new Blob([icsFile], { type: 'text/calendar;charset=utf-8' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = 'lunar-calendar.ics';
		link.click();
		URL.revokeObjectURL(url);
	};

	if (!expandedEvents?.length) {
		return (
			<div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
				<p className="text-muted-foreground">No expanded events to preview.</p>
				<Button type="button" variant="outline" onClick={() => setStep('cart')}>
					Back to cart
				</Button>
			</div>
		);
	}

	return (
		<div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h2 className="text-2xl font-semibold">Preview</h2>
					<p className="text-muted-foreground mt-1">
						{expandedEvents.length} events across {availableYears.length} years
					</p>
				</div>
				<Button type="button" onClick={handleDownload}>
					Download ICS
				</Button>
			</div>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between gap-4">
					<CardTitle className="flex items-center gap-2">
						<Button
							type="button"
							variant="outline"
							size="icon"
							onClick={() => setYearIndex((index) => Math.max(0, index - 1))}
							disabled={yearIndex === 0}
							aria-label="Previous year">
							<ChevronLeft className="size-4" />
						</Button>
						<span>{selectedYear}</span>
						<Button
							type="button"
							variant="outline"
							size="icon"
							onClick={() =>
								setYearIndex((index) =>
									Math.min(availableYears.length - 1, index + 1),
								)
							}
							disabled={yearIndex >= availableYears.length - 1}
							aria-label="Next year">
							<ChevronRight className="size-4" />
						</Button>
					</CardTitle>
				</CardHeader>
				<CardContent>
					<YearPreviewGrid year={selectedYear} events={expandedEvents} />
				</CardContent>
			</Card>

			<div className="flex justify-start">
				<Button type="button" variant="outline" onClick={() => setStep('cart')}>
					Back to cart
				</Button>
			</div>
		</div>
	);
};

export { PreviewStep };
