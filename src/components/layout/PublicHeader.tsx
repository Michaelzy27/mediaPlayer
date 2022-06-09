import { Row, Col } from 'antd';
import ResponsiveContainer from 'components/common/ResponsiveContainer';

const PublicHeader = () => {
  return (
    <ResponsiveContainer>
      <Row>
        <Col>
          <img src="/images/sound-rig-logo.svg" alt="sound-rig logo" />
        </Col>
      </Row>
    </ResponsiveContainer>
  );
};

export default PublicHeader;
