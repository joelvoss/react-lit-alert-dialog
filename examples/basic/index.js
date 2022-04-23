import * as React from 'react';
import {
	AlertDialog,
	AlertDialogLabel,
	AlertDialogDescription,
} from '../../src/index';

export function Example() {
	const [showDialog, setShowDialog] = React.useState(false);
	const cancelRef = React.useRef();
	const open = () => setShowDialog(true);
	const close = () => setShowDialog(false);

	return (
		<>
			<h2>Example: Basic</h2>
			<div>
				<button onClick={open}>Delete something</button>

				{showDialog && (
					<AlertDialog
						leastDestructiveRef={cancelRef}
						style={{
							boxShadow: '0 4px 6px #000',
							borderRadius: 6,
							padding: '0.5rem',
						}}
					>
						<AlertDialogLabel>Please Confirm!</AlertDialogLabel>

						<AlertDialogDescription>
							Are you sure you want to delete something? This action is
							permanent, and we're totally not soft deleting something!
						</AlertDialogDescription>

						<div>
							<button onClick={close}>Yes, delete</button>{' '}
							<button ref={cancelRef} onClick={close}>
								Abort! Don't delete
							</button>
						</div>
					</AlertDialog>
				)}
			</div>
		</>
	);
}
