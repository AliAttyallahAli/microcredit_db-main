import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { notificationsAPI } from '../utils/api';

function Notifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const data = await notificationsAPI.getByUser(user.id);
      setNotifications(data);
      
      // Calculer le nombre de notifications non lues
      const unread = data.filter(n => !n.is_read).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await notificationsAPI.markAsRead(id);
      fetchNotifications(); // Rafraîchir la liste
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      for (const notification of notifications.filter(n => !n.is_read)) {
        await notificationsAPI.markAsRead(notification.id);
      }
      fetchNotifications(); // Rafraîchir la liste
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  return (
    <div className="dropdown">
      <button 
        className="btn btn-primary position-relative"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <i className="bi bi-bell"></i>
        {unreadCount > 0 && (
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            {unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="dropdown-menu show" style={{width: '300px', right: 0, left: 'auto'}}>
          <div className="dropdown-header">
            <div className="d-flex justify-content-between align-items-center">
              <span>Notifications</span>
              {unreadCount > 0 && (
                <button 
                  className="btn btn-sm btn-link"
                  onClick={markAllAsRead}
                >
                  Tout marquer comme lu
                </button>
              )}
            </div>
          </div>
          <div className="dropdown-divider"></div>
          
          {notifications.length > 0 ? (
            <>
              {notifications.slice(0, 5).map(notification => (
                <div 
                  key={notification.id} 
                  className={`dropdown-item ${notification.is_read ? '' : 'bg-light'}`}
                  onClick={() => !notification.is_read && markAsRead(notification.id)}
                >
                  <div className="d-flex justify-content-between">
                    <small className={notification.is_read ? 'text-muted' : 'text-primary'}>
                      {notification.message}
                    </small>
                    {!notification.is_read && (
                      <span className="badge bg-primary">Nouveau</span>
                    )}
                  </div>
                  <small className="text-muted d-block">
                    {new Date(notification.created_at).toLocaleDateString()}
                  </small>
                </div>
              ))}
              <div className="dropdown-divider"></div>
              <div className="dropdown-item text-center">
                <a href="#">Voir toutes les notifications</a>
              </div>
            </>
          ) : (
            <div className="dropdown-item text-center">
              <small className="text-muted">Aucune notification</small>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Notifications;