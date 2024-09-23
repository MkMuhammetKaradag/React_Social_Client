import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

const AccountPage = () => {
  const navigate = useNavigate();
  return (
    <div className="flex  h-[95vh] ">
      <div className="w-1/4 border-r">
        <div className="bg-gray-100 p-3  rounded-md m-2 hover:bg-gray-200">
          Edit
        </div>
        <div
          onClick={() => navigate('followRequest')}
          className="bg-gray-100 p-3  rounded-md m-2 hover:bg-gray-200"
        >
          fallowRequest
        </div>
        <div className="bg-gray-100 p-3  rounded-md m-2 hover:bg-gray-200">
          fallowingRequest
        </div>
      </div>
      <div className="w-3/4  h-full  items-center  justify-center flex">
        <Outlet />
      </div>
    </div>
  );
};

export default AccountPage;
