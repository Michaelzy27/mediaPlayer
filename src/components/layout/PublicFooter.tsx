import { Row, Col } from 'antd';
import ResponsiveContainer from 'components/common/ResponsiveContainer';
import FooterLinks from './FooterLinks';

const PublicFooter = () => {
  return (
    <ResponsiveContainer className="app-footer">
      <Row className="mt-4">
        <img src="/images/sound-rig-logo-white.svg" alt="sound-rig logo" />
      </Row>
      <Row className="my-8">
        <Col span={12} lg={10}>
          Sound Rig acknowledges the First Peoples of Australia, their Elders
          past, present and emerging. We pay our respects to the traditional
          owners of the land on which we live and work.
        </Col>
      </Row>
      <Row justify="space-between">
        <Col xs={{ order: 2 }} sm={{ order: 1 }}>
          © 2021 Sound Rig
        </Col>
        <Col className="mb-4" xs={{ order: 1 }} sm={{ order: 2 }}>
          <FooterLinks />
        </Col>
      </Row>
    </ResponsiveContainer>
  );
};

export default PublicFooter;
