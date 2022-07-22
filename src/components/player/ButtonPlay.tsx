import {
  LoadingOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined
} from '@ant-design/icons';
import { Button } from 'antd';
import { RefObject, useCallback, useEffect, useState } from 'react';
import { IPlayFunctions } from './Player';

export interface IFile extends Record<string, any> {
  src: string;
}

const ButtonPlay = (props: {
  isPlaying: boolean;
  onClick: () => void;
}) => {
  let icon = props.isPlaying ? <PauseCircleOutlined className='text-2xl' />
    : <PlayCircleOutlined className='text-2xl' />;
  // if (isCurrent) {
  //   if (isPlaying) {
  //   } else if (!isLoaded) {
  //     icon = <LoadingOutlined className="text-2xl" />;
  //   }
  // }

  return (
    <Button
      icon={icon}
      className='w-12 h-12'
      onClick={props.onClick}
    />
  );
};

export default ButtonPlay;
