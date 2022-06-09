import { ReactFragment } from 'react';
import SubmitCancelButtons from './SubmitCancelButtons';

interface IConfirmationBottomBarProps {
  visible: boolean;
  title: ReactFragment;
  confirmText?: string;
  cancelText?: string;
  onConfirm: any;
  onCancel: any;
  submitting?: boolean;
  submitButtonProps?: any;
}

const ConfirmationBottomBar: React.FunctionComponent<
  IConfirmationBottomBarProps
> = ({
  title,
  visible,
  onConfirm,
  onCancel,
  submitButtonProps,
  cancelText = 'Cancel',
  confirmText = 'Confirm',
  submitting = false,
  ...props
}) => {
  return (
    <div
      className="fixed left-0 bottom-0 py-4 px-8 flex flex-col items-center w-full"
      style={{
        background: '#f3f4f5',
        boxShadow: '0px -4px 8px rgba(0, 0, 0, 0.08)',
      }}
    >
      <div className="w-full md:w-[37rem]">
        <div className="flex flex-row justify-between items-center">
          {title}
          <SubmitCancelButtons
            buttonClassName="px-6 h-12"
            cancelText={cancelText}
            submitText={confirmText}
            onCancel={onCancel}
            onSubmit={onConfirm}
            submitting={submitting}
            {...submitButtonProps}
          />
        </div>
      </div>
    </div>
  );
};

export default ConfirmationBottomBar;
