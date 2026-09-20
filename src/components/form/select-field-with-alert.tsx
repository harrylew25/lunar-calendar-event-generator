import type { ReactElement, ReactNode } from 'react';

type SelectFieldWithAlertProps = {
	children: ReactNode;
	alert?: ReactNode;
	showAlert?: boolean;
};

const selectRowClass = (hasAlert: boolean): string =>
	hasAlert
		? 'grid grid-cols-1 gap-2 md:grid-cols-[minmax(0,95%)_minmax(1.25rem,5%)] md:items-end'
		: 'grid grid-cols-1';

const SelectFieldWithAlert = ({
	children,
	alert,
	showAlert = true,
}: SelectFieldWithAlertProps): ReactElement => (
	<div className={selectRowClass(Boolean(alert))}>
		{children}
		{showAlert && alert ? (
			<div className="flex h-9 w-full items-center justify-center">{alert}</div>
		) : null}
	</div>
);

export default SelectFieldWithAlert;
