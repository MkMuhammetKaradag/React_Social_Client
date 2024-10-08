import React, { useState } from 'react';
import { IconType } from 'react-icons';
import {
  AiOutlineSearch,
  AiFillCompass,
  AiFillVideoCamera,
  AiFillMessage,
  AiFillHeart,
  AiOutlinePlusSquare,
  AiOutlineUser,
  AiFillLinkedin,
} from 'react-icons/ai';
import { Link, useLocation } from 'react-router-dom';
import SearchPanel from './SearchPanel';
import NotificationPanel from './NotificationPanel';
import CreatePostModal from './CreatePostModal';

import { useAppDispatch, useAppSelector } from '../../context/hooks';
import { LOGOUT_USER } from '../../graphql/mutations';
import { useMutation } from '@apollo/client';
import { logout } from '../../context/slices/AuthSlice';

interface MenuItem {
  icon: IconType;
  text: string;
  link: string;
}

const menuItems: MenuItem[] = [
  { icon: AiOutlineUser, text: 'Ana Sayfa', link: '/' },

  { icon: AiOutlineSearch, text: 'Ara', link: 'search' },

  { icon: AiFillCompass, text: 'Keşfet', link: '/explore' },
  { icon: AiFillVideoCamera, text: 'Reels', link: '/reels' },
  { icon: AiFillMessage, text: 'Mesajlar', link: '/direct' },
  { icon: AiFillHeart, text: 'Bildirimler', link: '/notifications' },
  { icon: AiOutlinePlusSquare, text: 'Oluştur', link: '/create' },
  { icon: AiOutlineUser, text: 'Profil', link: '/user' },
];

const Sidebar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const user = useAppSelector((s) => s.auth.user);
  const pathname = useLocation().pathname;
  const [logoutUser] = useMutation(LOGOUT_USER);
  const dispatch = useAppDispatch();
  const handleLogout = async () => {
    try {
      await logoutUser();
      dispatch(logout());
    } catch (err) {
      console.error('Logout error:', err);
    }
  };
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
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
                    className={`${
                      pathname == item.link && 'bg-red-900'
                    } flex items-center hover:bg-gray-900 p-2 rounded w-full transition-all duration-300 ease-in-out`}
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
                    to={
                      item.link == '/user'
                        ? `${item.link}/${user?._id}`
                        : item.link
                    }
                    className={`${
                      item.link == '/user'
                        ? pathname == `${item.link}/${user?._id}` &&
                          'bg-red-900'
                        : pathname == item.link && 'bg-red-900'
                    } flex items-center hover:bg-gray-900 p-2 rounded transition-all duration-300 ease-in-out overflow-hidden`}
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

        <div className="relative">
          <button
            onClick={toggleMenu}
            className="flex items-center hover:bg-gray-900 p-2 rounded w-full transition-all duration-300 ease-in-out overflow-hidden"
          >
            <AiOutlineUser className="text-2xl min-w-[1.5rem] flex-shrink-0" />
            <span
              className={`ml-4 transition-all duration-300 ease-in-out whitespace-nowrap ${
                isExpanded ? 'max-w-[200px] opacity-100' : 'max-w-0 opacity-0'
              }`}
            >
              Daha fazla
            </span>
          </button>
          {isMenuOpen && (
            <div className="absolute bottom-full left-0 w-full bg-gray-800 rounded-t-md shadow-lg overflow-hidden">
              <Link
                to={`/user/${user?._id}`}
                className="block px-4 py-2 hover:bg-gray-700"
                onClick={toggleMenu}
              >
                Profil
              </Link>
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-700"
                onClick={() => {
                  toggleMenu();
                  handleLogout();
                }}
              >
                Çıkış Yap
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Search Panel */}
      <SearchPanel isOpen={isSearchOpen} onClose={toggleSearch} />

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

      <div className="fixed bottom-0 left-0 right-0 bg-black text-white p-2 z-50 flex justify-around md:hidden">
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
