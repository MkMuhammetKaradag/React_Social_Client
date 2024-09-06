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
} from 'react-icons/ai';
import { Link } from 'react-router-dom';

interface MenuItem {
  icon: IconType;
  text: string;
  link: string;
}

const menuItems: MenuItem[] = [
  { icon: AiFillHome, text: 'Ana Sayfa', link: '/' },
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
  const [searchQuery, setSearchQuery] = useState('');

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full bg-black text-white p-2 flex flex-col transition-all duration-300 ${
          isExpanded ? 'w-64' : 'w-16'
        }`}
      >
        <div className="mb-10 flex justify-between items-center">
          {isExpanded ? (
            <h1 className="text-2xl font-bold">Instagram</h1>
          ) : (
            <img
              src="/instagram-icon.png"
              alt="Instagram"
              className="w-8 h-8"
            />
          )}
          <button onClick={toggleSidebar} className="text-2xl">
            <AiOutlineMenu />
          </button>
        </div>
        <nav className="flex-grow">
          <ul>
            {menuItems.map((item, index) => (
              <li key={index} className="mb-4">
                {item.text === 'Ara' ? (
                  <button
                    onClick={toggleSearch}
                    className="flex items-center hover:bg-gray-800 p-2 rounded w-full"
                  >
                    <item.icon
                      className={`text-2xl ${isExpanded ? 'mr-4' : 'mx-auto'}`}
                    />
                    {isExpanded && <span>{item.text}</span>}
                  </button>
                ) : (
                  <Link
                    to={item.link}
                    className="flex items-center hover:bg-gray-800 p-2 rounded"
                  >
                    <item.icon
                      className={`text-2xl ${isExpanded ? 'mr-4' : 'mx-auto'}`}
                    />
                    {isExpanded && <span>{item.text}</span>}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-auto">
          <button className="flex items-center hover:bg-gray-800 p-2 rounded w-full">
            <AiOutlineUser
              className={`text-2xl ${isExpanded ? 'mr-4' : 'mx-auto'}`}
            />
            {isExpanded && <span>Daha fazla</span>}
          </button>
        </div>
      </div>

      {/* Search Panel */}
      <div
        className={`fixed top-0 left-${
          isExpanded ? '64' : '16'
        } h-full w-80 bg-gray-900 text-white p-4 transition-all duration-300 transform ${
          isSearchOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center mb-4">
          <input
            type="text"
            placeholder="Ara"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 bg-gray-800 text-white border border-gray-700 rounded"
          />
          <button onClick={toggleSearch} className="ml-2 text-white">
            Kapat
          </button>
        </div>
        {/* Arama sonuçları */}
        <div className="mt-4">
          {/* Örnek arama sonuçları */}
          <div className="flex items-center mb-2">
            <img
              src="https://via.placeholder.com/40"
              alt="User"
              className="rounded-full mr-2"
            />
            <div>
              <p className="font-bold">Kullanıcı Adı</p>
              <p className="text-sm text-gray-400">Tam Ad</p>
            </div>
          </div>
          {/* Daha fazla sonuç... */}
        </div>
      </div>

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
