import { Row, Result } from 'antd';
import { Link } from 'react-router-dom';
import CenteredContainer from './CenteredContainer';

const NotFound = () => {
  return (
    <CenteredContainer>
      <Row justify="center">
        <Result
          icon={
            <img
              src="/images/torn-paper.png"
              alt="torn paper"
              aria-hidden="true"
            />
          }
          title={`Sorry, this page isn't available`}
          subTitle="The link you followed may be broken, or you may no longer have permission to access this page."
        />
      </Row>
      <Row justify="center">
        <Link to="/">Go to homepage</Link>
      </Row>
    </CenteredContainer>
  );
};

export default NotFound;
