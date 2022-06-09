import { Modal } from 'antd';
import { ReactFragment, useEffect, useState, useCallback } from 'react';
import SubmitCancelButtons from './SubmitCancelButtons';

interface IConfirmationModalProps {
  visible: boolean;
  title: ReactFragment;
  confirmText?: string;
  cancelText?: string;
  onConfirm: any;
  onCancel: any;
  submitting?: boolean;
  submitButtonProps?: any;
  forceRender?: boolean;
  maskClosable?: boolean;
}

const ConfirmationModal: React.FunctionComponent<IConfirmationModalProps> = ({
  title,
  visible,
  onConfirm,
  onCancel,
  submitButtonProps,
  cancelText = 'Cancel',
  confirmText = 'Confirm',
  submitting = false,
  forceRender = false,
  maskClosable = true,
  ...props
}) => {
  const [focusOnCloseElement, setFocusOnCloseElement] = useState<any>();

  const findFocusableAncestor: any = useCallback((element: HTMLElement) => {
    if (!element) {
      return null;
    }
    if (
      !element.offsetParent ||
      !element.offsetHeight ||
      !element.offsetWidth
    ) {
      // element or its parent is not visible, recurse
      return findFocusableAncestor(element.parentElement);
    }

    const focusableChildren =
      element.querySelectorAll(`:scope > a[href]:not([tabindex='-1']),
    :scope > area[href]:not([tabindex='-1']),
    :scope > input:not([disabled]):not([tabindex='-1']),
    :scope > select:not([disabled]):not([tabindex='-1']),
    :scope > textarea:not([disabled]):not([tabindex='-1']),
    :scope > button:not([disabled]):not([tabindex='-1']),
    :scope > iframe:not([tabindex='-1']),
    :scope > [tabindex]:not([tabindex='-1']),
    :scope > [contentEditable=true]:not([tabindex='-1'])`);

    if (focusableChildren.length) {
      return focusableChildren[focusableChildren.length - 1] as HTMLElement;
    }

    return null;
  }, []);

  useEffect(() => {
    // antd Modal's focusTriggerAfterClose property doesn't handle
    // focusing on a menu after its menu item triggers a modal and collapses the menu
    if (visible && document.activeElement) {
      setFocusOnCloseElement(document.activeElement);
    }

    return () => {
      let focusElement = focusOnCloseElement;
      if (focusElement && !focusElement.offsetParent) {
        focusElement = findFocusableAncestor(focusElement?.parentElement);
      }
      if (focusElement) {
        setTimeout(() => {
          focusElement.focus();
        }, 100);
      }
    };
  }, [visible, focusOnCloseElement, findFocusableAncestor]);

  return (
    <Modal
      title={title}
      visible={visible}
      onCancel={onCancel}
      forceRender={forceRender}
      maskClosable={maskClosable}
      focusTriggerAfterClose={false}
      footer={
        <SubmitCancelButtons
          buttonClassName="px-6 h-12"
          cancelText={cancelText}
          submitText={confirmText}
          onCancel={onCancel}
          onSubmit={onConfirm}
          submitting={submitting}
          {...submitButtonProps}
        />
      }
    >
      {props.children}
    </Modal>
  );
};

export default ConfirmationModal;
