import { UserOutlined } from '@ant-design/icons';
import { Button, Card, notification } from 'antd';
import API from 'api';
import { Auth } from 'aws-amplify';
import BackLink from 'components/common/BackLink';
import EditableAvatar from 'components/common/EditableAvatar';
import ResponsiveContainer from 'components/common/ResponsiveContainer';
import useCardano, { CARDANO_WALLET_PROVIDER } from 'hooks/useCardano';
import useUser from 'hooks/useUser';
import { useCallback, useMemo, useState } from 'react';
import { deriveFirstLastName, getInitials } from 'utils/name';
import { nameRule } from 'utils/validators/rules';
import ChangePasswordModal from './ChangePasswordModal';
import InlineEditField from './InlineEditField';

const UserMain = () => {
  const { user } = useUser();

  const [showChangePassword, setShowChangePassword] = useState<boolean>(false);
  // const [mfaStatus, setMfaStatus] = useState<string>();
  const [avatarLoading, setAvatarLoading] = useState<boolean>(false);

  const setUser = useCallback((_user: any) => {
    /// TODO: action set user
  }, []);

  const defaultAvatar = useMemo(() => {
    if (user) {
      const { first, last } = deriveFirstLastName(user);
      return getInitials(first, last);
    }
    return <UserOutlined />;
  }, [user]);

  const updateUserAttributes = useCallback(
    async (propKey, value, successMessage) => {
      const trimmedValue = value ? value.trim() : '';

      const _user = await Auth.currentUserInfo();
      const [, error] = await API.User.updateUser(propKey, trimmedValue);

      if (error) {
        console.error(error);
        notification['error']({ message: error.message });
        return false;
      }

      const newUser = {
        ..._user,
      };
      newUser.attributes = { ...newUser.attributes, [propKey]: value };

      setUser(newUser);
      if (successMessage) {
        notification['success']({ message: successMessage });
      }
      return true;
    },
    [setUser]
  );

  const onSubmitImage = useCallback(
    async (picture: any) => {
      // picture is received as base64 image string
      if (!picture) {
        updateUserAttributes('picture', '', 'Profile picture removed');
        return;
      }

      setAvatarLoading(true);
      const [response, error] = await API.User.uploadPicture(picture);
      if (error) {
        console.error(error);
        notification['error']({ message: 'Could not upload photo' });
      }

      await updateUserAttributes(
        'picture',
        response.url,
        'Profile picture updated'
      );
      setAvatarLoading(false);
    },
    [updateUserAttributes]
  );

  const cardano = useCardano();

  const handleConnectWallet = async () => {
    const walletProvider = CARDANO_WALLET_PROVIDER.NAMI;
    const payload = 'from sound-rig with love';

    await cardano.enable(walletProvider);
    const usedAddresses = await cardano.getUsedAddresses(walletProvider);
    console.log('used', usedAddresses);
    const addressHex = usedAddresses[0];
    const sig = await cardano.signData(walletProvider, addressHex, payload);
    console.log('sig', sig);
  };

  return (
    <>
      <ResponsiveContainer className="my-6">
        <BackLink text="Back" />
        <h2>Account settings</h2>
        <Card title="Test Wallet Connect">
          <div>
            <h3>Connect your wallet</h3>
            <Button
              type="text"
              className="px-1 -ml-1"
              onClick={handleConnectWallet}
            >
              Connect wallet
            </Button>
            <ChangePasswordModal
              showModal={showChangePassword}
              onCancel={() => setShowChangePassword(false)}
              onSaved={() => setShowChangePassword(false)}
            />
          </div>
        </Card>
        <Card title="Personal" className="mb-6">
          <h3>Profile picture</h3>
          <EditableAvatar
            value={user?.picture}
            onChange={onSubmitImage}
            displaySize={64}
            maxWidth={640}
            maxHeight={640}
            loading={avatarLoading}
          >
            <div style={{ fontSize: '1.25rem' }}>{defaultAvatar}</div>
          </EditableAvatar>

          <div className="my-6">
            <InlineEditField
              className="mb-4"
              name="displayName"
              label="Display name"
              hint="Display name is the name you prefer to be known by. It often consists of a first name and last name. Clear this value to revert to your original name."
              value={
                user?.displayName || `${user?.givenName} ${user?.familyName}`
              }
              onSave={(value) => {
                return updateUserAttributes(
                  'custom:display_name',
                  value,
                  value ? 'Display name updated' : 'Display name reset'
                );
              }}
              rules={[nameRule]}
              maxLength={32}
            />
          </div>

          <div className="mb-6">
            <div>
              <span className="label">Email and username</span>
            </div>
            <p className="footnote mb-1">
              The email address used to identify your Sound Rig Account. You
              can’t change this.
            </p>
            <div className="value">{user?.email}</div>
          </div>

          {/* 
          Temporarily removed - setting an email requires a verification process
          <div>
            <Row>
              <Col span={24} md={12} lg={8}>
                <InlineEditField
                  name="contactEmail"
                  label="Contact email"
                  hint="The email address where you get information about your account"
                  value={user?.contactEmail || user?.email}
                  onSave={(value) => {
                    return updateUserAttributes(
                      'custom:contact_email',
                      value,
                      'Contact email updated'
                    );
                  }}
                  rules={[requiredRule, emailRule]}
                />
              </Col>
            </Row>
          </div> */}
        </Card>

        <Card title="Security">
          <div>
            <h3>Password</h3>
            <Button
              type="text"
              className="px-1 -ml-1"
              onClick={() => setShowChangePassword(true)}
            >
              Change password
            </Button>
            <ChangePasswordModal
              showModal={showChangePassword}
              onCancel={() => setShowChangePassword(false)}
              onSaved={() => setShowChangePassword(false)}
            />
          </div>
        </Card>
      </ResponsiveContainer>
    </>
  );
};

export default UserMain;
