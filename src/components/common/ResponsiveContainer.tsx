import { Row, Col } from 'antd';

interface IResponsiveContainerProps {
  children?: React.ReactNode;
  className?: string;
  wide?: boolean;
}

const defaultOffsets = {
  xs: 0,
  lg: 1,
  xl: 2,
  xxl: 3,
};
const wideOffsets = {
  xs: 0,
  lg: 1,
  xl: 1,
  xxl: 1,
};

const ResponsiveContainer: React.FC<IResponsiveContainerProps> = ({
  children,
  wide = false,
  ...props
}) => {
  const offsets = wide ? wideOffsets : defaultOffsets;
  const calculateMain = (offset: number) => {
    return 24 - offset * 2;
  };

  return (
    <Row className={`px-4 sm:px-8 ${props.className || ''}`}>
      <Col
        xs={offsets.xs}
        lg={offsets.lg}
        xl={offsets.xl}
        xxl={offsets.xxl}
      ></Col>
      <Col
        xs={calculateMain(offsets.xs)}
        lg={calculateMain(offsets.lg)}
        xl={calculateMain(offsets.xl)}
        xxl={calculateMain(offsets.xxl)}
      >
        {children}
      </Col>
    </Row>
  );
};

export default ResponsiveContainer;
