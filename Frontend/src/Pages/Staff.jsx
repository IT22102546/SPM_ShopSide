import { TextInput, Modal, Button } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import logo from '../Pages/Images/staff.jpg'; // Import the image

export default function Staff() {
  const [crowdCountFromDB, setCrowdCountFromDB] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const brnumber = currentUser.brnumber;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [staffName, setStaffName] = useState("");
  const [staffEmail, setStaffEmail] = useState("");
  const [staffGender, setStaffGender] = useState("");
  const [staffPhone, setStaffPhone] = useState("");
  const [staffAge, setStaffAge] = useState("");

  useEffect(() => {
    const fetchCrowdCountFromDB = async () => {
      try {
        const res = await fetch(
          `/api/crowd/getCountfromDB/${currentUser.brnumber}`
        );
        const data = await res.json();

        if (data.success) {
          setCrowdCountFromDB(data.crowdCount);
        } else {
          setError("Failed to fetch crowd count");
        }
      } catch (error) {
        console.error("Error fetching crowd count:", error);
        setError("Failed to fetch crowd count");
      } finally {
        setLoading(false);
      }
    };

    if (brnumber) {
      fetchCrowdCountFromDB();
    }
  }, [brnumber]);

  const handleAddStaffClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/staff/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        brnumber: currentUser.brnumber,
        name: staffName,
        email: staffEmail,
        gender: staffGender,
        phone: staffPhone,
        age: staffAge,
      }),
    });

    const data = await res.json();
    if (data.success) {
      alert("Staff added successfully");
      setIsModalOpen(false);
      setStaffName("");
      setStaffEmail("");
    } else {
      alert("Failed to add staff");
    }
  };

  return (
    <div 
      className="w-full min-h-screen bg-cover bg-center relative"
      style={{
        backgroundImage: `url(${logo})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed", // Keeps the background fixed while scrolling
      }}
    >
      <div className="bg-gray-900 bg-opacity-60 w-full h-full absolute top-0 left-0"></div> {/* Overlay for text contrast */}

      <div className="relative p-10 flex flex-col justify-between gap-32">
      <div className="p-8 flex flex-wrap justify-between gap-12">
      <div className="p-6 bg-white/50 backdrop-blur-lg rounded-xl shadow-lg border border-gray-200">
  <h1 className="text-4xl font-cinzel font-bold text-gray-900">
    Welcome back,{" "}
    <span className="bg-gradient-to-r from-purple-600 to-purple-800 text-transparent bg-clip-text">
      {currentUser.shopname}
    </span>
  </h1>
  <div className="text-md font-sans font-light mt-6 space-y-4">
    <h2 className="text-gray-600">
      Email{" "}
      <span className="text-gray-700 font-medium">
        : {currentUser.email}
      </span>
    </h2>
    <h2 className="text-gray-600">
      BR Number{" "}
      <span className="text-gray-700 font-medium">
        : {currentUser.brnumber}
      </span>
    </h2>
  </div>
</div>
</div>

        <div className="relative p-10">
          <div className="flex lg:flex-row lg:justify-between items-start gap-5">
          <div className="flex flex-row gap-5">
  <button
    onClick={handleAddStaffClick}
    className="p-3 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-purple-900 text-white font-semibold shadow-lg hover:shadow-xl hover:from-purple-500 hover:to-purple-800 transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-100"
  >
    Add Staff
  </button>

  <Link to="/all-staff">
    <button
      type="submit"
      className="p-3 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-purple-900 text-white font-semibold shadow-lg hover:shadow-xl hover:from-purple-500 hover:to-purple-800 transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-100"
    >
      Manage Staff
    </button>
  </Link>
</div>


          
          </div>
        </div>

        <Modal show={isModalOpen} onClose={handleCloseModal}>
          <Modal.Header className="bg-purple-700 text-white py-3">
            <h3 className="bg-purple-700 text-white py-3">Add New Staff</h3>
          </Modal.Header>
          <Modal.Body className="bg-gray-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="mb-4">
                <label
                  htmlFor="staffName"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Enter Name
                </label>
                <TextInput
                  id="staffName"
                  placeholder="Enter Staff Name"
                  required
                  value={staffName}
                  onChange={(e) => setStaffName(e.target.value)}
                  className="bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5 shadow-sm"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="staffAge"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Enter Age
                </label>
                <TextInput
                  id="staffAge"
                  type="number"
                  placeholder="Enter Staff Age"
                  required
                  value={staffAge}
                  onChange={(e) => setStaffAge(e.target.value)}
                  className="bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5 shadow-sm"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="staffGender"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Select Gender
                </label>
                <select
                  id="staffGender"
                  required
                  value={staffGender}
                  onChange={(e) => setStaffGender(e.target.value)}
                  className="bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5 shadow-sm"
                >
                  <option value="" disabled>
                    -- Select Gender --
                  </option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="staffPhone"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Enter Phone Number
                </label>
                <TextInput
                  id="staffPhone"
                  placeholder="Enter Staff Phone"
                  type="number"
                  required
                  value={staffPhone}
                  onChange={(e) => setStaffPhone(e.target.value)}
                  className="bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5 shadow-sm"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="staffEmail"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Enter Email
                </label>
                <TextInput
                  id="staffEmail"
                  placeholder="Enter Staff Email"
                  type="email"
                  required
                  value={staffEmail}
                  onChange={(e) => setStaffEmail(e.target.value)}
                  className="bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5 shadow-sm"
                />
              </div>

              <div className="flex justify-end mt-6">
                <Button
                  type="submit"
                  className="bg-purple-700 hover:bg-purple-800 text-white px-5 py-2 rounded-lg shadow-md"
                >
                  Submit
                </Button>
              </div>
            </form>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
}
