type ModalDialogElement = HTMLElement & {
  open: boolean;
  showModal?: () => void;
};

export function openModal(element: HTMLElement | undefined): void {
  const dialog = element as ModalDialogElement | undefined;

  if (!dialog || dialog.open) {
    return;
  }

  if (typeof dialog.showModal === 'function') {
    dialog.showModal();
  } else {
    dialog.setAttribute('open', '');
  }
}
