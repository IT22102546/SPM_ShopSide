import { useEffect, useState } from "react";
import { Alert, Button, Modal, TextInput } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { deleteUserFailure, deleteUserStart, deleteUserSuccess, signOut, updateUserFailure, updateUserStart, updateUserSuccess } from "../redux/user/userSlice";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

export default function DashProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser, loading } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [showModel, setShowModel] = useState(false);

 
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch(`/api/shop/current`);
        const data = await res.json();
        if (data.success) {
          dispatch(updateUserSuccess(data.user)); 
          setFormData(data.user); 
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    if (!currentUser) {
      fetchUserData();
    } else {
      setFormData(currentUser); 
    }
  }, [currentUser, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/shop/update/${currentUser.brnumber}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        setUpdateUserError(data.message);
        setUpdateSuccess(null);
        return;
      }
      dispatch(updateUserSuccess(data.user)); 
      setUpdateSuccess("User profile updated successfully");
      setUpdateUserError(null);
    } catch (error) {
      dispatch(updateUserFailure(error));
      setUpdateUserError(error.message);
      setUpdateSuccess(null);
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser.uid}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure());
        return;
      }
      dispatch(deleteUserSuccess());
      navigate("/sign-in");
    } catch (error) {
      dispatch(deleteUserFailure(error));
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch("/api/user/signout");
      dispatch(signOut());
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <TextInput
          type="text"
          id="shopname"
          placeholder="Shop Name"
          value={formData.shopname || currentUser.shopname || ''}
          onChange={handleChange}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="Email"
          value={formData.email || currentUser.email || ''}
          onChange={handleChange}
        />
        <TextInput
          type="text"
          id="brnumber"
          placeholder="Business Registration Number"
          value={formData.brnumber || currentUser.brnumber || ''}
          onChange={handleChange}
          readOnly
        />
        <Button type="submit" gradientDuoTone="purpleToBlue" outline className="bg-slate-400 text-black" disabled={loading}>
          {loading ? "Loading.." : "Update Account"}
        </Button>
        <Button type="button" gradientDuoTone="purpleToBlue" className="w-full bg-slate-400 text-black" outline>
          Manage Shop
        </Button>
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span onClick={() => setShowModel(true)} className="cursor-pointer">
          Delete Account
        </span>
        <span onClick={handleSignOut} className="cursor-pointer">
          Sign Out
        </span>
      </div>
      {updateSuccess && <Alert color="success" className="mt-5">{updateSuccess}</Alert>}
      {updateUserError && <Alert color="failure" className="mt-5">{updateUserError}</Alert>}
      <Modal show={showModel} onClose={() => setShowModel(false)} popup size="md">
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-200">
              Are you sure you want to Delete your Account
            </h3>
          </div>
          <div className="flex justify-center gap-4">
            <Button color="failure" onClick={handleDeleteUser} className="bg-red-600">
              Yes, I am sure
            </Button>
            <Button color="gray" onClick={() => setShowModel(false)} className="bg-green-600">
              No, cancel
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
