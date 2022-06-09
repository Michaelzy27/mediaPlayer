export const handleMenuBlur = (e: any, closeFn: (visible: boolean) => void) => {
  // close the menu if focusing away from it and any of its children
  if (!e?.currentTarget.contains(e.relatedTarget)) {
    closeFn(false);
  }
};

export const setFocusFormInput = (formItemName?: string) => {
  if (formItemName) {
    setTimeout(() => {
      const inputElement = document.getElementById(
        formItemName
      ) as HTMLInputElement;
      if (inputElement) {
        inputElement.focus();
        inputElement.select();
      }
    }, 250);
  }
};
