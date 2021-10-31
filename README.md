# @react-lit/alert-dialog

An alert dialog is a modal dialog that interrupts the user's workflow to
communicate an important message and acquire a response.
Examples include action confirmation prompts and error message confirmations.

When a Dialog opens, the least destructive action should be focused so that
if a user accidentally hits enter when the dialog opens no damage is done.
This is accomplished with the `leastDestructiveRef` prop.

## Installation

```bash
$ npm i @react-lit/alert-dialog
# or
$ yarn add @react-lit/alert-dialog
```

## Example

```js
import * as React from 'react';
import { AlertDialog, AlertDialogLabel, AlertDialogDescription } from '@react-lit/alert-dialog';

function Example() {
  const [showDialog, setShowDialog] = React.useState(false);
  const cancelRef = React.useRef();
  const open = () => setShowDialog(true);
  const close = () => setShowDialog(false);

  return (
    <div>
      <button onClick={open}>Delete something</button>

      {showDialog && (
        <AlertDialog leastDestructiveRef={cancelRef}>
          <AlertDialogLabel>Please Confirm!</AlertDialogLabel>

          <AlertDialogDescription>
            Are you sure you want to delete something? This action is permanent,
            and we're totally not soft deleting something!
          </AlertDialogDescription>

          <div>
            <button onClick={close}>Yes, delete</button>{" "}
            <button ref={cancelRef} onClick={close}>
              Abort! Don't delete
            </button>
          </div>
        </AlertDialog>
      )}
    </div>
  );
}
```

## Development

(1) Install dependencies

```bash
$ npm i
# or
$ yarn
```

(2) Run initial validation

```bash
$ ./Taskfile.sh validate
```

(3) Run tests in watch-mode to validate functionality.

```bash
$ ./Taskfile test -w
```

---

_This project was set up by @jvdx/core_
