import { TextInput, Modal, Button } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

export default function Staff() {
  const [crowdCountFromDB, setCrowdCountFromDB] = useState(null); // State to hold the crowd count
  const [error, setError] = useState(null); // State to show error
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const brnumber = currentUser.brnumber;

  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
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
          setCrowdCountFromDB(data.crowdCount); // Set the fetched crowd count
        } else {
          setError("Failed to fetch crowd count");
        }
      } catch (error) {
        console.error("Error fetching crowd count:", error);
        setError("Failed to fetch crowd count");
      } finally {
        setLoading(false); // Set loading to false after the request
      }
    };

    if (brnumber) {
      fetchCrowdCountFromDB();
    }
  }, [brnumber]);

  // Toggle modal visibility
  const handleAddStaffClick = () => {
    setIsModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Submit form to add staff to the database
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Add logic to post staff details to your backend API
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
      setIsModalOpen(false); // Close the modal after submission
      setStaffName(""); // Clear input fields
      setStaffEmail("");
    } else {
      alert("Failed to add staff");
    }
  };

  return (
    <div className="bg-gray-100 w-full">
      <div className="p-10 bg-gray-50 flex flex-wrap justify-between gap-32">
        <div>
          <h1 className="text-2xl font-cinzel font-semibold">
            Welcome back!,{" "}
            <span className="text-gradient-to-r from-purple-700 to-purple-900 font-normal">
              {currentUser.shopname}
            </span>
            <br />
            <div className="text-sm font-sans font-normal mt-5">
              <h1>
                Shop ID{" "}
                <span className="text-gray-600 font-normal mx-10">
                  : {currentUser.shopID}
                </span>
              </h1>
              <h1>
                Email{" "}
                <span className="text-gray-600 font-normal mx-14">
                  : {currentUser.email}
                </span>
              </h1>
              <h1>
                BR Number{" "}
                <span className="text-gray-600 font-normal mx-4">
                  : {currentUser.brnumber}
                </span>
              </h1>
            </div>
          </h1>
        </div>
      </div>

      <div className="p-10">
        <div className="flex lg:flex-row lg:justify-between items-start gap-5">
          {/* Left Side: Buttons */}
          <div className="flex flex-row gap-5">
            <button
              onClick={handleAddStaffClick} // Show modal when clicked
              className="p-2 px-3 rounded-lg bg-gradient-to-r from-purple-700 to-purple-900 text-white hover:bg-gradient-to-r hover:from-purple-700 hover:to-purple-800 transition duration-300"
            >
              Add Staff
            </button>

            <Link to="">
              <button
                type="submit"
                className="p-2 px-3 rounded-lg bg-gradient-to-r from-purple-700 to-purple-900 text-white hover:bg-gradient-to-r hover:from-purple-700 hover:to-purple-800 transition duration-300"
              >
                Staff
              </button>
            </Link>
            <Link to="">
              <button
                type="submit"
                className="p-2 px-3 rounded-lg bg-gradient-to-r from-purple-700 to-purple-900 text-white hover:bg-gradient-to-r hover:from-purple-700 hover:to-purple-800 transition duration-300"
              >
                Task Management
              </button>
            </Link>
          </div>

          {/* Right Side: Image */}
          <div className="flex-1 lg:mt-0 lg:ml-10">
            <img
              src="/img/crowd.png"
              alt="crowd-image"
              className="max-w-full h-auto object-contain opacity-80"
            />
          </div>
        </div>
      </div>

      {/* Modal to add staff */}
      <Modal show={isModalOpen} onClose={handleCloseModal}>
        <Modal.Header>Add New Staff</Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="staffGender"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Enter Name
              </label>
              <TextInput
                id="staffName"
                placeholder="Enter Staff Name"
                required
                value={staffName}
                onChange={(e) => setStaffName(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="staffGender"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Enter Age
              </label>
              <TextInput
                id="staffAge"
                placeholder="Enter Staff Age"
                type="number"
                required
                value={staffAge}
                onChange={(e) => setStaffAge(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="staffGender"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Select Gender
              </label>
              <select
                id="staffGender"
                required
                value={staffGender}
                onChange={(e) => setStaffGender(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5"
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
                htmlFor="staffGender"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Enter Phone Number
              </label>
              <TextInput
                id="staffAge"
                placeholder="Enter Staff Phone"
                required
                type="number"
                value={staffPhone}
                onChange={(e) => setStaffPhone(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="staffGender"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Enter Email
              </label>
              <TextInput
                id="staffEmail"
                type="email"
                placeholder="Enter Staff Email"
                required
                value={staffEmail}
                onChange={(e) => setStaffEmail(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              className="mx-auto w-full px-3 rounded-lg bg-gradient-to-r from-purple-700 to-purple-900 text-white hover:bg-gradient-to-r hover:from-purple-700 hover:to-purple-800 transition duration-300"
            >
              Add Staff
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
