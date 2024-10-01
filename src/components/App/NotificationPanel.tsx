// NotificationPanel.tsx
import React, { useEffect } from 'react';
import SlidingPanel from './SlidingPanel';
import { useMutation, useQuery } from '@apollo/client';
import { GET_NOTIFICATIONS } from '../../graphql/queries/GetNotifications';
import { NotificationArray } from '../../utils/types';
import { Link, useLocation } from 'react-router-dom';
import { MARK_NOTIFICATION_AS_READ } from '../../graphql/mutations/MarkNotificationAsRead';
import { NEW_NOTIFICATION_SUBSCRIPTION } from '../../graphql/subscriptions/NewNotification';

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
    refetchQueries: [
      {
        query: GET_NOTIFICATIONS,
      },
    ],
    awaitRefetchQueries: true,
  });
  const location = useLocation();

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

  if (!data) {
    return <div>empty notification</div>;
  }
  if (error) {
    return <div>error</div>;
  }
  if (loading) {
    return <div>Loading...</div>;
  }
  const remarkAsReadHandle = (notificationId: string) => {
    markNotificationAsRead({ variables: { notificationId } })
      .then((res) => console.log(res))
      .catch((err) => {
        console.log(err);
      });
  };

  const notifications = data.getNotifications as NotificationArray;

  return (
    <SlidingPanel isOpen={isOpen} position="right">
      <h2 className="text-xl font-bold mb-4">Bildirimler</h2>
      {/* Bildirim içeriği */}
      <div className="space-y-4">
        {notifications.map((item) => (
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

        {/* Daha fazla bildirim... */}
      </div>
    </SlidingPanel>
  );
};

export default NotificationPanel;
