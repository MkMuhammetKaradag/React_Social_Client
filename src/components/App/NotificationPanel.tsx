import React, { useEffect, useState, useCallback } from 'react';
import SlidingPanel from './SlidingPanel';
import { useMutation, useQuery } from '@apollo/client';
import { GET_NOTIFICATIONS } from '../../graphql/queries/GetNotifications';
import {
  NotificationArray,
  AnyNotification,
  NotificationType,
} from '../../utils/types';
import { Link, useLocation } from 'react-router-dom';
import { MARK_NOTIFICATION_AS_READ } from '../../graphql/mutations/MarkNotificationAsRead';
import { NEW_NOTIFICATION_SUBSCRIPTION } from '../../graphql/subscriptions/NewNotification';
import { FiFilter } from 'react-icons/fi';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface GroupedNotifications {
  [key: string]: AnyNotification[];
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({
  isOpen,
  onClose,
}) => {
  const { data, loading, error, subscribeToMore } = useQuery(GET_NOTIFICATIONS);
  const [notifications, setNotifications] = useState<NotificationArray>([]);
  const [markNotificationAsRead] = useMutation(MARK_NOTIFICATION_AS_READ);
  const location = useLocation();
  const [activeFilter, setActiveFilter] = useState<NotificationType | 'ALL'>(
    'ALL'
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (data && data.getNotifications) {
      setNotifications(data.getNotifications);
    }
  }, [data]);

  const addNewNotification = useCallback((newNotification: AnyNotification) => {
    setNotifications((prevNotifications) => {
      if (newNotification.type === NotificationType.DIRECT_MESSAGE) {
        const existingGroupIndex = prevNotifications.findIndex(
          (notif) =>
            notif.type === NotificationType.DIRECT_MESSAGE &&
            notif.content._id === newNotification.content._id
        );

        if (existingGroupIndex !== -1) {
          const updatedNotifications = [...prevNotifications];
          updatedNotifications.splice(existingGroupIndex, 0, newNotification);
          return updatedNotifications;
        }
      }

      return [newNotification, ...prevNotifications];
    });
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToMore({
      document: NEW_NOTIFICATION_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const newNotification = subscriptionData.data.newNotification;

        console.log('New notification received:', newNotification);
        addNewNotification(newNotification);

        return prev;
      },
      onError: (error) => {
        console.error('Subscription error:', error);
      },
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [subscribeToMore, addNewNotification]);

  const groupNotifications = useCallback(
    (notifs: NotificationArray): GroupedNotifications => {
      return notifs.reduce((acc, notification) => {
        if (notification.type === NotificationType.DIRECT_MESSAGE) {
          const key = `dm_${notification.content._id}`;
          if (!acc[key]) {
            acc[key] = [];
          }
          acc[key].push(notification);
        } else {
          const key = `other_${notification._id}`;
          acc[key] = [notification];
        }
        return acc;
      }, {} as GroupedNotifications);
    },
    []
  );
  const filteredNotifications =
    activeFilter === 'ALL'
      ? notifications
      : notifications.filter(
          (notification) => notification.type === activeFilter
        );

  const groupedNotifications = groupNotifications(filteredNotifications);
  const markGroupAsRead = useCallback(
    (groupId: string) => {
      const group = groupedNotifications[groupId];
      if (group) {
        group.forEach((notification) => {
          if (!notification.isRead) {
            markNotificationAsRead({
              variables: { notificationId: notification._id },
            })
              .then(() => {
                setNotifications((prevNotifications) =>
                  prevNotifications.map((notif) =>
                    notif._id === notification._id
                      ? { ...notif, isRead: true }
                      : notif
                  )
                );
              })
              .catch((err) => {
                console.log(err);
              });
          }
        });
      }
    },
    [markNotificationAsRead, groupedNotifications]
  );

  const handleFilterChange = (filter: NotificationType | 'ALL') => {
    setActiveFilter(filter);
    setIsDropdownOpen(false);
  };

  const renderNotification = useCallback(
    (notification: AnyNotification, isGrouped: boolean = false) => (
      <div key={notification._id} className="flex items-center mb-2">
        <img
          src={
            notification.sender.profilePhoto || 'https://via.placeholder.com/40'
          }
          alt="User"
          className="w-10 h-10 rounded-full mr-2 object-cover"
        />
        <div>
          <Link to={`/user/${notification.sender._id}`}>
            <p
              className={`font-bold ${
                notification.isRead ? 'text-gray-400' : 'text-white'
              }`}
            >
              {notification.sender.userName}
            </p>
          </Link>
          <Link
            to={`${
              notification.type !== NotificationType.DIRECT_MESSAGE
                ? '/p/' + notification.content._id
                : '/direct/'
            }`}
            state={
              notification.type !== NotificationType.DIRECT_MESSAGE
                ? { backgroundLocation: location }
                : undefined
            }
            onClick={() => {
              if (isGrouped) {
                markGroupAsRead(`dm_${notification.content._id}`);
              } else if (!notification.isRead) {
                markNotificationAsRead({
                  variables: { notificationId: notification._id },
                });
              }
            }}
          >
            <p
              className={`text-sm ${
                notification.isRead ? 'text-gray-400' : 'text-white'
              }`}
            >
              {notification.message}
            </p>
          </Link>
        </div>
      </div>
    ),
    [location, markGroupAsRead, markNotificationAsRead]
  );

  const renderGroupedNotifications = useCallback(() => {
    return Object.entries(groupedNotifications).map(([key, notifications]) => {
      if (notifications[0].type === NotificationType.DIRECT_MESSAGE) {
        const latestNotification = notifications[0];
        const unreadCount = notifications.filter((n) => !n.isRead).length;
        return (
          <div key={key} className="mb-4 p-2 border rounded">
            <h3 className="font-bold mb-2">
              Mesajlar ({notifications.length})
              {unreadCount > 0 && (
                <span className="ml-2 text-red-500">
                  ({unreadCount} okunmamış)
                </span>
              )}
            </h3>
            {renderNotification(latestNotification, true)}
          </div>
        );
      } else {
        return renderNotification(notifications[0]);
      }
    });
  }, [groupedNotifications, renderNotification]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <SlidingPanel isOpen={isOpen} position="right">
      <h2 className="text-xl font-bold">Bildirimler</h2>
      <div className="relative  flex justify-end">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className=" items-center px-3 py-2 border rounded"
        >
          <FiFilter size={18} className="" />
        </button>
        {isDropdownOpen && (
          <div className="absolute right-0 mt-5 w-48 bg-white rounded-md shadow-lg z-10">
            <button
              onClick={() => handleFilterChange('ALL')}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            >
              Tümü
            </button>
            <button
              onClick={() =>
                handleFilterChange(NotificationType.DIRECT_MESSAGE)
              }
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            >
              Mesajlar
            </button>
            <button
              onClick={() => handleFilterChange(NotificationType.LIKE)}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            >
              Beğeniler
            </button>
            <button
              onClick={() => handleFilterChange(NotificationType.COMMENT)}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            >
              Yorumlar
            </button>
          </div>
        )}
      </div>
      <div
        className="overflow-y-auto custom-scrollbar"
        style={{
          maxHeight: 'calc(100vh - 100px)',
        }}
      >
        {renderGroupedNotifications()}
      </div>
    </SlidingPanel>
  );
};

export default NotificationPanel;
