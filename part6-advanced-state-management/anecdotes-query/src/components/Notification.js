import { useNotificationValue } from '../NotificationContext';

const Notification = () => {
  const notification = useNotificationValue();
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5,
  };

  if (!notification) return null;

  return notification.content ? (
    <div style={style}>{notification.content} voted</div>
  ) : (
    <div style={style}>{notification} created</div>
  );
};

export default Notification;
