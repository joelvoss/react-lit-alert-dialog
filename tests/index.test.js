import * as React from 'react';
import { render, userEvent } from './test-utils';

import {
	AlertDialog,
	AlertDialogLabel,
	AlertDialogDescription,
} from '../src/index';

////////////////////////////////////////////////////////////////////////////////

describe('<AlertDialog />', () => {
	const Comp = ({ show = false }) => {
		const close = React.useRef();
		const [showDialog, setShowDialog] = React.useState(show);

		return (
			<div>
				<button onClick={() => setShowDialog(true)}>Show</button>
				{showDialog && (
					<AlertDialog
						leastDestructiveRef={close}
						data-testid="dialog"
						id="my-custom-dialog-id"
					>
						<AlertDialogLabel>Confirmation!</AlertDialogLabel>
						<AlertDialogDescription>
							Are you sure you want to have that milkshake?
						</AlertDialogDescription>
						<div>
							<button>Confirm</button>
							<button ref={close} onClick={() => setShowDialog(false)}>
								Cancel
							</button>
						</div>
					</AlertDialog>
				)}
			</div>
		);
	};

	it('should not have ARIA violations', async () => {
		let { container } = render(<Comp />);
		await expect(container).toHaveNoAxeViolations();
	});

	it('should open an alert dialog', async () => {
		const { queryByText } = render(<Comp />);
		expect(queryByText(/cancel/i)).toBeNull();
		userEvent.click(queryByText(/show/i));
		expect(queryByText(/cancel/i)).toBeTruthy();
	});

	it('should focus the least destructive ref', async () => {
		const { queryByText } = render(<Comp />);
		userEvent.click(queryByText(/show/i));
		expect(document.activeElement).toBe(queryByText(/cancel/i));
	});

	it('should render correct aria labels', async () => {
		let { getByTestId } = render(<Comp show />);
		const dialog = getByTestId('dialog');

		const labelledBy = dialog.getAttribute('aria-labelledby');
		const describedBy = dialog.getAttribute('aria-describedby');

		expect(labelledBy).toBe('alert-dialog--my-custom-dialog-id');
		expect(describedBy).toBe('alert-dialog-description--my-custom-dialog-id');

		expect(document.getElementById(labelledBy).innerHTML).toBe('Confirmation!');
		expect(document.getElementById(describedBy).innerHTML).toBe(
			'Are you sure you want to have that milkshake?',
		);
	});
});
