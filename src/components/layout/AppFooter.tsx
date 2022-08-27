import { Row } from 'antd';
import FooterLinks from './FooterLinks';

export const AppFooter = () => {
  return (
    <Row
      className="app-footer px-4 md:px-8 py-6"
      align="middle"
      justify="space-between"
    >
      <Row align="middle">
        <img src="/images/sound-rig-logo-white.svg" alt="sound-rig logo" />
        <span className="ml-4 pt-1">© 2022 Sound Rig • <a>Discord</a> • <a>Twitter</a></span>
      </Row>
      <Row justify="end" className="mt-4 md:mt-0">
        <FooterLinks />
      </Row>
    </Row>
  );
};

