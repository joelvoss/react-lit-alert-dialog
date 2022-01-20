import * as React from 'react';
import { DialogOverlay, DialogContent } from '@react-lit/dialog';
import { useId } from '@react-lit/auto-id';
import {
	getOwnerDocument,
	createNamedContext,
	makeId,
	useComposeRefs,
} from '@react-lit/helper';

////////////////////////////////////////////////////////////////////////////////

/**
 * @typedef {Object} AlertDialogContextValue
 * @prop {string | undefined} labelId
 * @prop {string | undefined} descriptionId
 * @prop {React.MutableRefObject<HTMLDivElement | null>} overlayRef
 * @prop {React.RefObject<HTMLElement>} [leastDestructiveRef]
 */

const AlertDialogContext = createNamedContext('AlertDialogContext', {});

////////////////////////////////////////////////////////////////////////////////

/**
 * AlertDialogOverlay renders a low-level component if you need more control
 * over the styles or rendering of the dialog overlay.
 *
 * Note: You must render an `<AlertDialogContent>` inside.
 */
const AlertDialogOverlay = React.forwardRef(
	({ leastDestructiveRef, ...props }, forwardedRef) => {
		const ownRef = React.useRef(null);
		const ref = useComposeRefs(forwardedRef, ownRef);
		const id = useId(props.id);
		const labelId = id ? makeId('alert-dialog', id) : undefined;
		const descriptionId = id
			? makeId('alert-dialog-description', id)
			: undefined;

		return (
			<AlertDialogContext.Provider
				value={{
					labelId,
					descriptionId,
					overlayRef: ownRef,
					leastDestructiveRef,
				}}
			>
				<DialogOverlay
					{...props}
					ref={ref}
					initialFocusRef={leastDestructiveRef}
				/>
			</AlertDialogContext.Provider>
		);
	},
);

////////////////////////////////////////////////////////////////////////////////

/**
 * AlertDialogContent renders a low-level component if you need more control
 * over the styles or rendering of the dialog content.
 *
 * Note: Must be a child of `AlertDialogOverlay`.
 */
const AlertDialogContent = React.forwardRef(
	({ children, ...props }, parentRef) => {
		/** @type {AlertDialogContextValue} */
		const { descriptionId, labelId, leastDestructiveRef, overlayRef } =
			React.useContext(AlertDialogContext);

		React.useEffect(() => {
			const ownerDocument = getOwnerDocument(overlayRef.current);

			if (labelId && ownerDocument.getElementById(labelId) == null) {
				throw new Error(
					`'<AlertDialogLabel>' must be rendered inside a '<AlertDialog>'`,
				);
			}

			if (leastDestructiveRef == null) {
				throw new Error(
					`'leastDestructiveRef' must be provided to '<AlertDialog>' or '<AlertDialogOverlay>'`,
				);
			}
		}, [labelId, leastDestructiveRef, overlayRef]);

		return (
			<DialogContent
				role="alertdialog"
				aria-describedby={descriptionId}
				aria-labelledby={props['aria-label'] ? undefined : labelId}
				{...props}
				ref={parentRef}
			>
				{children}
			</DialogContent>
		);
	},
);

////////////////////////////////////////////////////////////////////////////////

/**
 * AlertDialogLabel renders the first thing a screen reader will read when the
 * dialog opens. It is usually the title of the dialog.
 *
 * Note: This is required. The `<AlertDialog>` will throw an error of no label
 * is rendered.
 */
export const AlertDialogLabel = React.forwardRef(
	({ as: Comp = 'div', ...props }, parentRef) => {
		/** @type {AlertDialogContextValue} */
		const { labelId } = React.useContext(AlertDialogContext);
		return <Comp {...props} ref={parentRef} id={labelId} />;
	},
);

////////////////////////////////////////////////////////////////////////////////

/**
 * AlertDialogDescription renders additional content read by screen readers,
 * usually a longer description about what you need from the user.
 */
export const AlertDialogDescription = React.forwardRef(
	({ as: Comp = 'div', ...props }, parentRef) => {
		/** @type {AlertDialogContextValue} */
		const { descriptionId } = React.useContext(AlertDialogContext);
		return <Comp {...props} ref={parentRef} id={descriptionId} />;
	},
);

////////////////////////////////////////////////////////////////////////////////

/**
 * AlertDialog renders a high-level component to render an alert dialog.
 */
export const AlertDialog = React.forwardRef(
	({ id, isOpen, onDismiss, leastDestructiveRef, ...props }, parentRef) => (
		<AlertDialogOverlay {...{ isOpen, onDismiss, leastDestructiveRef, id }}>
			<AlertDialogContent ref={parentRef} {...props} />
		</AlertDialogOverlay>
	),
);
