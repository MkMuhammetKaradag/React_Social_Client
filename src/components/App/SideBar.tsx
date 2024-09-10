import React, { useState } from 'react';
import { IconType } from 'react-icons';
import {
  AiFillHome,
  AiOutlineSearch,
  AiFillCompass,
  AiFillVideoCamera,
  AiFillMessage,
  AiFillHeart,
  AiOutlinePlusSquare,
  AiOutlineUser,
  AiOutlineMenu,
  AiFillLinkedin,
} from 'react-icons/ai';
import { Link } from 'react-router-dom';
import SearchPanel from './SearchPanel';
import NotificationPanel from './NotificationPanel';
import CreatePostModal from './CreatePostModal';

interface MenuItem {
  icon: IconType;
  text: string;
  link: string;
}

const menuItems: MenuItem[] = [
  { icon: AiOutlineUser, text: 'Ana Sayfa', link: '/' },

  { icon: AiOutlineSearch, text: 'Ara', link: '/search' },

  { icon: AiFillCompass, text: 'Keşfet', link: '/explore' },
  { icon: AiFillVideoCamera, text: 'Reels', link: '/reels' },
  { icon: AiFillMessage, text: 'Mesajlar', link: '/messages' },
  { icon: AiFillHeart, text: 'Bildirimler', link: '/notifications' },
  { icon: AiOutlinePlusSquare, text: 'Oluştur', link: '/create' },
  { icon: AiOutlineUser, text: 'Profil', link: '/profile' },
];

const Sidebar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);

  const toggleSearch = () => {
    setIsExpanded((prev) => !prev);
    setIsSearchOpen((prev) => !prev);
    // setIsNotificationOpen(false);
  };

  const toggleNotification = () => {
    setIsNotificationOpen((prev) => !prev);
    // setIsSearchOpen(false);
  };
  const toggleCreatePostModal = () => {
    setIsCreatePostModalOpen((prev) => !prev);
  };
  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={`fixed left-0 z-10 top-0 h-full bg-black text-white p-2 md:flex flex-col hidden transition-all duration-300 ease-in-out ${
          isExpanded ? 'w-64' : 'w-16'
        }`}
      >
        <div className="mb-10 flex items-center h-14">
          <h1
            className={`text-2xl font-bold absolute left-2 transition-all duration-300 ease-in-out ${
              isExpanded ? 'opacity-100' : 'opacity-0 -translate-x-full'
            }`}
          >
            Instagram
          </h1>
          <AiFillLinkedin
            size={32}
            className={`absolute left-2 transition-all duration-300 ease-in-out ${
              isExpanded ? 'opacity-0 translate-x-full' : 'opacity-100'
            }`}
          />
        </div>

        <nav className="flex-grow">
          <ul>
            {menuItems.map((item, index) => (
              <li key={index} className="mb-4">
                {item.text === 'Ara' ? (
                  <div
                    onClick={toggleSearch}
                    className="flex items-center hover:bg-gray-900 p-2 rounded w-full transition-all duration-300 ease-in-out"
                  >
                    <item.icon className="text-2xl min-w-[1.5rem]" />
                    <span
                      className={`ml-4 transition-all duration-300 ease-in-out ${
                        isExpanded
                          ? 'opacity-100'
                          : 'opacity-0 w-0 overflow-hidden'
                      }`}
                    >
                      {item.text}
                    </span>
                  </div>
                ) : item.text === 'Bildirimler' ? (
                  <div
                    onClick={toggleNotification}
                    className="flex items-center hover:bg-gray-900 p-2 rounded w-full transition-all duration-300 ease-in-out"
                  >
                    <item.icon className="text-2xl min-w-[1.5rem]" />
                    <span
                      className={`ml-4 transition-all duration-300 ease-in-out ${
                        isExpanded
                          ? 'opacity-100'
                          : 'opacity-0 w-0 overflow-hidden'
                      }`}
                    >
                      {item.text}
                    </span>
                  </div>
                ) : item.text === 'Oluştur' ? (
                  <div
                    onClick={toggleCreatePostModal}
                    className="flex items-center hover:bg-gray-900 p-2 rounded w-full transition-all duration-300 ease-in-out"
                  >
                    <item.icon className="text-2xl min-w-[1.5rem]" />
                    <span
                      className={`ml-4 transition-all duration-300 ease-in-out ${
                        isExpanded
                          ? 'opacity-100'
                          : 'opacity-0 w-0 overflow-hidden'
                      }`}
                    >
                      {item.text}
                    </span>
                  </div>
                ) : (
                  <Link
                    to={item.link}
                    className="flex items-center hover:bg-gray-900 p-2 rounded transition-all duration-300 ease-in-out overflow-hidden"
                  >
                    <item.icon className="text-2xl min-w-[1.5rem]" />
                    <span
                      className={`ml-4 transition-all duration-300 ease-in-out whitespace-nowrap ${
                        isExpanded
                          ? 'max-w-[200px] opacity-100'
                          : 'max-w-0 opacity-0'
                      }`}
                    >
                      {item.text}
                    </span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="">
          <button className="flex items-center hover:bg-gray-900 p-2 rounded w-full transition-all duration-300 ease-in-out overflow-hidden">
            <AiOutlineUser className="text-2xl min-w-[1.5rem] flex-shrink-0" />
            <span
              className={`ml-4 transition-all duration-300 ease-in-out whitespace-nowrap ${
                isExpanded ? 'max-w-[200px] opacity-100' : 'max-w-0 opacity-0'
              }`}
            >
              Daha fazla
            </span>
          </button>
        </div>
      </div>

      {/* Search Panel */}
      <SearchPanel
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Notification Panel */}
      <NotificationPanel
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isCreatePostModalOpen}
        onClose={() => setIsCreatePostModalOpen(false)}
      />

      {/* Mobile Bottom Bar */}

      <div className="fixed bottom-0 left-0 right-0 bg-black text-white p-2 flex justify-around md:hidden">
        {menuItems.slice(0, 5).map((item, index) => (
          <button
            key={index}
            onClick={item.text === 'Ara' ? toggleSearch : undefined}
            className="flex flex-col items-center"
          >
            <item.icon className="text-2xl" />
          </button>
        ))}
      </div>
    </>
  );
};

export default Sidebar;
