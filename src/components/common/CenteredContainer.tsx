// this only works when it's the only child element in the <main> or <Layout.Content> container.
const CenteredContainer: React.FC = ({ ...props }) => {
  return (
    <div
      className="centered-container flex flex-col items-center justify-center"
      style={{ position: 'absolute', height: '100%', width: '100%' }}
    >
      {props.children}
    </div>
  );
};

export default CenteredContainer;
