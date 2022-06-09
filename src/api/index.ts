import InvitationApi from 'api/invitation';
import SettingsApi from 'api/settings';
import UserApi from 'api/user';
import NotificationsApi from 'api/notifications';

const API = {
  Invitation: InvitationApi,
  User: UserApi,
  Notification: NotificationsApi,
  Settings: SettingsApi,
};

export default API;
