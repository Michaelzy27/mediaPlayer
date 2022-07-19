import { Button, Col, notification, Row } from 'antd';
import API from 'api';
import Auth from 'auth/Auth';
import useBreakpoints from 'hooks/useBreakpoints';
import useCardano, { CARDANO_WALLET_PROVIDER } from 'hooks/useCardano';
import useRouteParams from 'hooks/useRouteParams';
import useUser from 'hooks/useUser';
import { Link } from 'react-router-dom';
import { MENU_ITEMS } from 'routes';
import { signOut } from 'utils/auth';
import { getErrorMessageObj } from 'utils/response';
import { Menu } from '../common/Menu';

const UserLogin = () => {
  const { user } = useUser('header');
  const cardano = useCardano();
  const walletProvider = CARDANO_WALLET_PROVIDER.NAMI;

  const pingAuth = async () => {
    const [data, error] = await API.User.pingAuth();
    if (error) {
      notification['error'](getErrorMessageObj(error));
      return;
    }

    notification['success']({
      message: 'ping successfully',
    });
  };

  const sendAuth = async (
    addressHex: string,
    signature: string,
    key?: string
  ) => {
    const [data, error] = await API.User.sendAuth(addressHex, signature, key);
    if (error) {
      notification['error'](getErrorMessageObj(error));
      return;
    }

    const token = data.token;
    Auth.initSession(addressHex, token);

    /// try pinging
    await pingAuth();
  };

  const handleConnectWallet = async () => {
    await cardano.enable(walletProvider);
    const usedAddresses = await cardano.getUsedAddresses(walletProvider);
    console.log('used', usedAddresses);
    const addressHex = usedAddresses[0];

    const [data, error] = await API.User.getAuth(addressHex);
    if (error) {
      notification['error'](getErrorMessageObj(error));
      return;
    }

    const payload = data.message;

    const { signature, key } = await cardano.signData(
      walletProvider,
      addressHex,
      payload
    );
    await sendAuth(addressHex, signature, key);
  };

  return (
    <div>
      {!user.walletAddress && (
        <Button
          type="text"
          className="px-1 -ml-1"
          onClick={handleConnectWallet}
        >
          Connect wallet
        </Button>
      )}
      {user.walletAddress && (
        <Button type="text" className="px-1 -ml-1" onClick={signOut}>
          Sign out
        </Button>
      )}
    </div>
  );
};

export const AppHeader = () => {
  const { breakpoints } = useBreakpoints();
  const { navMenuKey } = useRouteParams();

  // const logoSrc = breakpoints.xs
  //   ? 'sound-rig-logo-sm.svg'
  //   : 'sound-rig-logo.png';
  const logoSrc = 'SoundRig-logo-2.png';

  return (
    <Row align="middle" justify="space-between" className="px-0">
      <Col className='hidden sm:flex'>
        <Link to="/" aria-label="Home">
          <img
            src={`/images/${logoSrc}`}
            alt="sound-rig logo"
            className="app-logo h-10 pl-2"
          />
        </Link>
      </Col>
      <Col className="pl-4" style={{ paddingTop: '2px' }}>
        <Menu
          selectedKey={navMenuKey}
          items={MENU_ITEMS.map((i) => {
            return {
              label: i.text,
              key: i.key,
              path: i.path,
            }
          })}
        />
      </Col>
      <Col>
        <UserLogin />
      </Col>
    </Row>
  );
};
