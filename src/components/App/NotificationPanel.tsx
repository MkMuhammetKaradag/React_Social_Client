import React, { useEffect, useState } from 'react';
import SlidingPanel from './SlidingPanel';
import { useMutation, useQuery } from '@apollo/client';
import { GET_NOTIFICATIONS } from '../../graphql/queries/GetNotifications';
import { NotificationArray, NotificationType } from '../../utils/types';
import { Link, useLocation } from 'react-router-dom';
import { MARK_NOTIFICATION_AS_READ } from '../../graphql/mutations/MarkNotificationAsRead';
import { NEW_NOTIFICATION_SUBSCRIPTION } from '../../graphql/subscriptions/NewNotification';
import { FiFilter } from 'react-icons/fi';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({
  isOpen,
  onClose,
}) => {
  const { data, loading, error, subscribeToMore } = useQuery(GET_NOTIFICATIONS);
  const [markNotificationAsRead] = useMutation(MARK_NOTIFICATION_AS_READ, {
    refetchQueries: [{ query: GET_NOTIFICATIONS }],
    awaitRefetchQueries: true,
  });
  const location = useLocation();
  const [activeFilter, setActiveFilter] = useState<NotificationType | 'ALL'>(
    'ALL'
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToMore({
      document: NEW_NOTIFICATION_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const newNotification = subscriptionData.data.newNotification;
        return {
          ...prev,
          getNotifications: {
            ...prev.getNotifications,
            newNotification,
          },
        };
      },
      onError: (err) => {
        console.log(err);
      },
    });
    return () => unsubscribe();
  }, [subscribeToMore]);

  if (!data) return <div>Empty notification</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (loading) return <div>Loading...</div>;

  const remarkAsReadHandle = (notificationId: string) => {
    markNotificationAsRead({ variables: { notificationId } })
      .then((res) => console.log(res))
      .catch((err) => {
        console.log(err);
      });
  };

  const notifications = data.getNotifications as NotificationArray;
  console.log(notifications);
  const filteredNotifications =
    activeFilter === 'ALL'
      ? notifications
      : notifications.filter(
          (notification) => notification.type === activeFilter
        );
  const handleFilterChange = (filter: NotificationType | 'ALL') => {
    setActiveFilter(filter);
    setIsDropdownOpen(false);
  };
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
              Messajlar
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

      {filteredNotifications.map((item) => (
        <div key={item._id} className="flex items-center">
          <img
            src={item.sender.profilePhoto || 'https://via.placeholder.com/40'}
            alt="User"
            className="w-10 h-10 rounded-full mr-2 object-cover"
          />
          <div>
            <Link to={`/user/${item.sender._id}`}>
              <p
                className={`font-bold  ${
                  item.isRead ? 'text-gray-400' : 'text-white'
                }`}
              >
                {item.sender.userName}
              </p>
            </Link>
            <Link
              to={`/p/${item.content._id}`}
              state={{ backgroundLocation: location }}
              onClick={() =>
                !item.isRead
                  ? remarkAsReadHandle(item._id)
                  : console.log('isReaded')
              }
            >
              <p
                className={`text-sm  ${
                  item.isRead ? 'text-gray-400' : 'text-white'
                }`}
              >
                {item.message}
              </p>
            </Link>
          </div>
        </div>
      ))}
    </SlidingPanel>
  );
};

export default NotificationPanel;
