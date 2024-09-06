// NotificationPanel.tsx
import React from 'react';
import SlidingPanel from './SlidingPanel';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <SlidingPanel isOpen={isOpen} onClose={onClose} position="right">
      <h2 className="text-xl font-bold mb-4">Bildirimler</h2>
      {/* Bildirim içeriği */}
      <div className="space-y-4">
        <div className="flex items-center">
          <img
            src="https://via.placeholder.com/40"
            alt="User"
            className="rounded-full mr-2"
          />
          <div>
            <p className="font-bold">Kullanıcı Adı</p>
            <p className="text-sm">Gönderinizi beğendi</p>
          </div>
        </div>
        {/* Daha fazla bildirim... */}
      </div>
    </SlidingPanel>
  );
};

export default NotificationPanel;
