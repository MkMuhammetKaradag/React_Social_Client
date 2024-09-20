import React from 'react';
import { Outlet } from 'react-router-dom';

const AccountPage = () => {
  return (
    <div className="flex  h-[95vh] ">
      <div className="w-1/4 bg-white border-r">hello ayar</div>
      <div className="w-3/4 bg-red-100 h-full ">
        <Outlet />
      </div>
    </div>
  );
};

export default AccountPage;
