import React from 'react';
import { Outlet } from 'react-router-dom';
import ChatList from '../../components/App/ChatList';

const DirectPage = () => {
  return (
    <div className="flex  h-[95vh] ">
      <div className="w-1/3 border-r">
        <ChatList />
      </div>
      <div className="w-2/3 h-full ">
        <Outlet />
      </div>
    </div>
  );
};

export default DirectPage;
