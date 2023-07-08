import { useSelector } from 'react-redux';

const Notification = () => {
  const notification = useSelector((state) => state.notification);
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
  };

  if (notification.returned.length) {
    return (
      <div style={style}>you voted '{notification.returned[0].content}'</div>
    );
  }
};

export default Notification;
