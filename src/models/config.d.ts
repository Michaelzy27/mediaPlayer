export interface IConfigGetResponse {
  notificationSettingValues: INotificationSettingValueType[];
}

export interface INotificationSettingValueType {
  code: string;
  title: string;
  type: 'boolean' | 'string' | 'number'; // 'number' is a suggestive type, BE may have another type for this
  defaultValue?: any;
}
