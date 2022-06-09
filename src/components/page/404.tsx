import { Layout, Result } from 'antd';
import CenteredContainer from 'components/common/CenteredContainer';

import PublicFooter from 'components/layout/PublicFooter';
import PublicHeader from 'components/layout/PublicHeader';
import useBreakpoints from 'hooks/useBreakpoints';

const NotFoundPage = () => {
  const { breakpoints } = useBreakpoints();

  return (
    <div className="App">
      <Layout>
        <Layout.Header
          style={{
            position: breakpoints.sm ? 'fixed' : 'relative',
            top: 0,
            width: '100vw',
            height: '72px',
          }}
          className="px-8 sm:px-20"
        >
          <PublicHeader />
        </Layout.Header>
        <Layout.Content>
          <CenteredContainer>
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
          </CenteredContainer>
        </Layout.Content>
        <Layout.Footer
          style={{
            position: breakpoints.sm ? 'fixed' : 'relative',
            bottom: 0,
            width: '100%',
          }}
        >
          <PublicFooter />
        </Layout.Footer>
      </Layout>
    </div>
  );
};

export default NotFoundPage;
