import { Layout } from 'antd';
import Auth from 'auth/Auth';
import AppFooter from 'components/layout/AppFooter';
import AppHeader from 'components/layout/AppHeader';
import useIdleTimeout from 'hooks/useIdleTimeout';
import { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import 'remixicon/fonts/remixicon.css';
import { ROUTES } from 'routes';

const INACTIVITY_TIMEOUT = parseInt(
  process.env.REACT_APP_INACTIVITY_TIMEOUT_MS || '3600000'
);

const RouteComponentWithTitle = (props: {
  title: string;
  element: () => JSX.Element;
}) => {
  useEffect(() => {
    document.title = (props.title ? `${props.title} - ` : '') + 'Sound Rig';
  }, [props.title]);
  const Component = props.element;
  return <Component />;
};

const createRoute = (route: any, index: number) => {
  const Component = () =>
    RouteComponentWithTitle({ title: route.title, element: route.component });
  if (route.subs) {
    return (
      <Route key={`route-${index}`} path={route.path} element={<Component />}>
        {route.subs.map(createRoute)}
      </Route>
    );
  } else {
    return (
      <Route key={`route-${index}`} path={route.path} element={<Component />} />
    );
  }
};

/// NOTE: this is utilized to prevent wasted re-rendering by the use of useNavigate
const AuthedAppIdleTimeoutWrapper = (props: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  // TODO
  const user = {
    userId: 'TODO',
  };

  // useIdleTimeout(
  //   INACTIVITY_TIMEOUT,
  //   ['mousedown', 'keydown', 'touchstart'],
  //   () => {
  //     signOut().then(() => {
  //       // TODO: signout action
  //       navigate('/');
  //     });
  //   },
  //   user?.userId
  // );
  return <>{props.children}</>;
};

const AuthedApp = () => {
  return (
    <div className="App">
      <AuthedAppIdleTimeoutWrapper>
        <Layout>
          <Layout.Header className="pl-0 pr-4">
            <AppHeader />
          </Layout.Header>
          <Layout.Content>
            <Routes>{ROUTES.map(createRoute)}</Routes>
          </Layout.Content>
          {/* <Layout.Footer>
            <AppFooter />
          </Layout.Footer> */}
        </Layout>
      </AuthedAppIdleTimeoutWrapper>
    </div>
  );
};

export default AuthedApp;
