import { Avatar, Button } from 'antd';
import ChangeAvatarModal from 'components/common/ChangeAvatarModal';
import { useEffect, useState } from 'react';
import ConfirmationModal from './ConfirmationModal';

interface IEditableAvatar {
  value?: string;
  onChange?: (avatar: any) => void;
  maxWidth?: number;
  maxHeight?: number;
  inlineButtons?: boolean;
  displaySize?: number;
  saveText?: string;
  loading?: boolean;
}

const EditableAvatar: React.FunctionComponent<IEditableAvatar> = ({
  value,
  onChange,
  maxWidth,
  maxHeight,
  inlineButtons = false,
  displaySize = 64,
  saveText,
  loading,
  ...props
}) => {
  const defaultAvatar = 'images/avatar-default-sm.png';

  const [showChangeAvatarModal, setShowChangeAvatarModal] =
    useState<boolean>(false);
  const [avatar, setAvatar] = useState<string | null>();
  const [showConfirmRemove, setShowConfirmRemove] = useState<boolean>(false);

  useEffect(() => {
    setAvatar(value);
  }, [value]);

  const setNewAvatar = (newAvatar: string) => {
    if (onChange) {
      onChange(newAvatar);
    }
    setAvatar(newAvatar);
  };

  const handleUpdateAvatar = (avatar: any) => {
    let newAvatar = avatar;
    if (maxWidth || maxHeight) {
      // we need to resize this image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.src = avatar;
      img.onload = () => {
        // resize to the smallest width/height
        let newWidth = img.width;
        let newHeight = img.height;

        // Note: we don't cater for weird proportions like maxWidth=1000 maxHeight=1
        if (
          maxWidth &&
          img.width > maxWidth &&
          (img.width >= img.height || !maxHeight)
        ) {
          newWidth = maxWidth;
          newHeight = Math.round((maxWidth / img.width) * img.height);
        } else if (
          maxHeight &&
          img.height > maxHeight &&
          (img.height >= img.width || !maxWidth)
        ) {
          newHeight = maxHeight;
          newWidth = Math.round((maxHeight / img.height) * img.width);
        }

        if (img.width !== newWidth && img.height !== newHeight) {
          canvas.height = newHeight;
          canvas.width = newWidth;
          ctx?.drawImage(img, 0, 0, newWidth, newHeight);
          newAvatar = canvas.toDataURL();
        }
        canvas.remove();

        setNewAvatar(newAvatar);
      };
    } else {
      setNewAvatar(newAvatar);
    }
    setShowChangeAvatarModal(false);
  };

  const removePhoto = () => {
    if (onChange) {
      onChange(null);
    }
    setAvatar(null);
    setShowConfirmRemove(false);
  };

  const actionButtons = (
    <>
      <Button
        type="text"
        onClick={() => setShowChangeAvatarModal(true)}
        className="px-1 -ml-1"
        loading={loading}
      >
        {value ? 'Change picture' : 'Upload picture'}
      </Button>
      {value && (
        <Button
          type="text"
          onClick={() => setShowConfirmRemove(true)}
          className="px-1 ml-3"
          loading={loading}
        >
          Remove picture
        </Button>
      )}
    </>
  );

  return (
    <div>
      <div className="flex items-center">
        <div style={{ maxWidth: '200px' }}>
          <Avatar
            size={displaySize}
            icon={
              props.children || <img src={defaultAvatar} alt="default avatar" />
            }
            src={avatar}
            style={{ alignSelf: 'center' }}
          />
        </div>
        {inlineButtons && (
          <div className="flex items-center ml-2">{actionButtons}</div>
        )}
      </div>
      {!inlineButtons && (
        <div className="flex items-center mt-3">{actionButtons}</div>
      )}
      <ChangeAvatarModal
        showModal={showChangeAvatarModal}
        onCancel={() => setShowChangeAvatarModal(false)}
        onSave={handleUpdateAvatar}
        saveText={saveText}
      />
      <ConfirmationModal
        visible={showConfirmRemove}
        title="Remove profile picture"
        confirmText="Remove picture"
        onConfirm={removePhoto}
        onCancel={() => setShowConfirmRemove(false)}
      >
        Are you sure you want to remove your profile picture?
      </ConfirmationModal>
    </div>
  );
};

export default EditableAvatar;
