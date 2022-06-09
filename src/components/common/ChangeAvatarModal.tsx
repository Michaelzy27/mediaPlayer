import { PlusOutlined } from '@ant-design/icons';
import { message, Modal, Upload, Avatar } from 'antd';
import { useState } from 'react';
import FileUtils from 'utils/file';

import './changeAvatarModal.less';

interface ISelectAvatarModal {
  showModal: boolean;
  onCancel: () => void;
  onSave: (data: any) => void;
  maxWidth?: number;
  maxHeight?: number;
  saveText?: string;
}

const SelectAvatarModal = ({
  showModal,
  onCancel,
  onSave,
  maxWidth,
  maxHeight,
  saveText = 'Save changes',
}: ISelectAvatarModal) => {
  const [showFileList, setShowFileList] = useState<boolean>(false);
  const [avatar, setAvatar] = useState<string | null>();
  const beforeUpload = (file: any) => {
    setShowFileList(false);
    const regex = /^image\/(png|jpeg|jpg){1}$/gi;

    if (file.status === undefined) {
      if (!file.type.match(regex)) {
        const error = `${file.name} is not a JPG or PNG file`;
        message.error(error);
        file.status = 'error';
        file.response = error;
        setShowFileList(true);
        return false;
      }

      FileUtils.getBase64(file, (res: any) => {
        let newAvatar = res;
        if (maxWidth || maxHeight) {
          // we need to resize this image
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const img = new Image();
          img.src = res;
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
          };
        }

        setAvatar(newAvatar);
      });
    }
    return false;
  };

  const handleChange = (info: any) => {
    if (info.file.status === 'removed') {
      setShowFileList(false);
    }
  };

  return (
    <Modal
      title="Change profile picture"
      visible={showModal}
      onCancel={() => {
        setAvatar(null);
        onCancel();
      }}
      okText={saveText}
      okButtonProps={{ disabled: !avatar }}
      onOk={() => {
        onSave(avatar);
        setAvatar(null);
      }}
    >
      <p>We accept JPG or PNG files.</p>
      <Upload.Dragger
        className={`sound-rig-profile-photo-upload ${
          avatar != null ? 'image-selected' : ''
        }`}
        multiple={false}
        accept="image/png,image/jpg,image/jpeg"
        maxCount={1}
        beforeUpload={beforeUpload}
        onChange={handleChange}
        showUploadList={showFileList}
      >
        {avatar && (
          <Avatar size={140} src={avatar} style={{ alignSelf: 'center' }} />
        )}
        {!avatar && (
          <>
            <p className="ant-upload-drag-icon">
              <PlusOutlined />
            </p>
            <p className="ant-upload-hint text--secondary">Upload</p>
          </>
        )}
      </Upload.Dragger>
    </Modal>
  );
};

export default SelectAvatarModal;
