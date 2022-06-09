import { useCallback, useEffect, useState } from 'react';
import API from '../api';
import { notification } from 'antd';
import { ISettingsGetResponse, ISettingsPostRequest } from 'models/settings';

export const useSettings = () => {
  const [settings, setSettings] = useState<ISettingsGetResponse | null>(null);
  const [updatingSettings, setUpdatingSettings] = useState<boolean>(false);

  useEffect(() => {
    API.Settings.getSettings().then(([data, error]) => {
      if (error) {
        notification['error']({
          message: error.errorMessage,
        });
      } else {
        setSettings(data);
      }
    });
  }, []);

  const updateSettings = useCallback(
    async (values: ISettingsPostRequest['notificationSettings'], callback?: () => void) => {
      setUpdatingSettings(true);
      const [data, error] = await API.Settings.updateSettings({
        ...settings,
        notificationSettings: values,
      });

      if (error) {
        notification['error']({
          message: 'Error',
          description: error.response?.data?.errorMessage,
        });
      } else {
        notification['success']({
          message: 'Settings updated successfully',
        });
        setSettings(data);
        callback?.();
      }
      setUpdatingSettings(false);
    },
    [settings]
  );

  return { settings, updatingSettings, updateSettings };
};
