export interface ISettingsGetResponse {
  notificationSettings: INotificationSettingType[];
}

export interface INotificationSettingType {
  code: string;
  value: any;
}

export interface ISettingsPostRequest {
  notificationSettings: Record<string, any>;
}
