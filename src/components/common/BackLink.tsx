import { Typography } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from 'antd';

interface IBackLinkProps {
  href?: string;
  text: string;
  className?: string;
}

const BackLink = ({ href, text, className = '' }: IBackLinkProps) => {
  const navigate = useNavigate();
  const innerContent = (
    <Typography.Text type="secondary">
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'middle',
        }}
      >
        <i className="ri-arrow-left-line" style={{ marginRight: '6px' }}></i>
        {text}
      </div>
    </Typography.Text>
  );

  return (
    <div className={className}>
      {href && (
        <Link to={href} aria-label="Back" style={{ textDecoration: 'none' }}>
          {innerContent}
        </Link>
      )}
      {!href && (
        <Button
          type="text"
          onClick={() => navigate(-1)}
          aria-label="Back"
          className="px-1 -ml-1"
        >
          {innerContent}
        </Button>
      )}
    </div>
  );
};

export default BackLink;
