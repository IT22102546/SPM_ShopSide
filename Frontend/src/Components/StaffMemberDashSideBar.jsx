import { Button, Sidebar } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiArchive, HiArrowSmRight, HiDocument, HiFolderAdd, HiGift, HiOutlineUserGroup, HiUser, HiUserGroup} from 'react-icons/hi';
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { signOut } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";


export default function StaffMemberDashSideBar() {
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


  

  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
         
              <Link to='/dashboard?tab=products' key="products">
                <Sidebar.Item
                  active={tab === 'products'}
                  icon={HiGift}
                  as='div'
                >
                  Products
                </Sidebar.Item>
              </Link>

             
             
              <Link to='/all-task-to-staff'>
                <Sidebar.Item
                  active={tab === 'staff'}
                  icon={HiDocument}
                  as='div'
                >
                 View Tasks
                </Sidebar.Item>
              </Link>
          <Button 
          href="/staffSignIn"
          >
            Sign Out
          </Button>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
