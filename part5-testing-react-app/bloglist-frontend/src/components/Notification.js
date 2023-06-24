import React from 'react';

const Notification = ({ notification }) => {
  const notificationStylePositive = {
    color: 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  };

  const notificationStyleNegative = {
    color: 'red',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  };

  return notification.type === 'success' ? (
    <div style={notificationStylePositive}>{`${notification.message}`}</div>
  ) : notification.type === 'error' ? (
    <div style={notificationStyleNegative}>{`${notification.message}`}</div>
  ) : null;
};

export default Notification;
