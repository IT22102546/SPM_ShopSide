import { Sidebar } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiArchive, HiArrowSmRight, HiDocument, HiFolderAdd, HiGift, HiOutlineUserGroup, HiUser, HiUserGroup} from 'react-icons/hi';
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { signOut } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";


export default function DashSideBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentUser } = useSelector(state => state.user);
  const location = useLocation();
  const [tab, setTab] = useState();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  const handleSignOut = async () => {
    try {
      await fetch('/api/user/signout');
      dispatch(signOut());
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Sidebar className="w-full md:w-56 bg-gray-900 text-white h-full shadow-lg rounded-lg transition-transform duration-300 ease-in-out p-1.5">
  <Sidebar.Items>
    <Sidebar.ItemGroup>

      <Link to='/dashboard?tab=profile' key="profile">
        <Sidebar.Item 
          active={tab === 'profile'} 
          icon={HiUser} 
          label={currentUser?.isAdmin ? 'Admin' : 'User'} 
          labelColor='light'
          className={`hover:bg-gray-700 hover:text-white transition-all duration-200 ease-in-out 
                      ${tab === 'profile' ? 'bg-blue-500 text-white shadow-md scale-105' : ''} p-4 mb-4`}
          as='div'
        >
          Profile
        </Sidebar.Item>
      </Link>

      <Link to='/dashboard?tab=products' key="products">
        <Sidebar.Item
          active={tab === 'products'}
          icon={HiGift}
          className={`hover:bg-gray-700 hover:text-white transition-all duration-200 ease-in-out 
                      ${tab === 'products' ? 'bg-blue-500 text-white shadow-md scale-105' : ''} p-4 mb-4`}
          as='div'
        >
          Products
        </Sidebar.Item>
      </Link>

      <Link to='/dashboard?tab=crowd' key="crowd">
        <Sidebar.Item
          active={tab === 'crowd'}
          icon={HiUserGroup}
          className={`hover:bg-gray-700 hover:text-white transition-all duration-200 ease-in-out 
                      ${tab === 'crowd' ? 'bg-blue-500 text-white shadow-md scale-105' : ''} p-4 mb-4`}
          as='div'
        >
          Crowd Status
        </Sidebar.Item>
      </Link>

      <Link to='/dashboard?tab=staff' key="staff">
        <Sidebar.Item
          active={tab === 'staff'}
          icon={HiDocument}
          className={`hover:bg-gray-700 hover:text-white transition-all duration-200 ease-in-out 
                      ${tab === 'staff' ? 'bg-blue-500 text-white shadow-md scale-105' : ''} p-4 mb-4`}
          as='div'
        >
          Staff Management
        </Sidebar.Item>
      </Link>

      <Sidebar.Item 
        icon={HiArrowSmRight} 
        className="cursor-pointer mt-8 p-4 hover:bg-red-600 hover:text-white transition-all duration-200 ease-in-out rounded-lg shadow-md"
        onClick={handleSignOut}
        key="signout"
      >
        Sign Out
      </Sidebar.Item>
    </Sidebar.ItemGroup>
  </Sidebar.Items>
</Sidebar>

  

  );
}
