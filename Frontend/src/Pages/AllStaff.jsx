import { Label, TextInput, Modal, Button } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

export default function AllStaff() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser, loading } = useSelector((state) => state.user);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [staffRecords, setStaffRecords] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updatedStaffDetails, setUpdatedStaffDetails] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
  });

  // Fetch all staff data using useEffect
  useEffect(() => {
    const fetchAllStaff = async () => {
      try {
        const res = await fetch(
          `/api/staff/getAllStaff/${currentUser.brnumber}`
        );
        const data = await res.json();

        if (data.success) {
          setStaffRecords(data.staff); // Set the fetched staff records
        } else {
          setErrorMessage("Failed to fetch staff records");
        }
      } catch (error) {
        console.error("Error fetching staff records:", error);
        setErrorMessage("Failed to fetch staff records");
      }
    };

    if (currentUser.brnumber) {
      fetchAllStaff();
    }
  }, [currentUser.brnumber]);

  // Handle assigning job
  const handleAssignJobClick = (staff) => {
    setSelectedStaff(staff);
    setIsModalOpen(true);
  };

  const handleSubmitJob = async () => {
    if (!jobDescription.trim()) {
      setErrorMessage("Job description cannot be empty.");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch(
        `/api/staff/assign-staff/${selectedStaff.phone}/${currentUser.brnumber}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ jobDescription }),
        }
      );
      const data = await res.json();

      if (data.success) {
        setSuccessMessage("Job assigned successfully.");
        setIsModalOpen(false);
        fetchAllStaff(); // Refresh staff records
      } else {
        setErrorMessage("Failed to assign job.");
      }
    } catch (error) {
      console.error("Error assigning job:", error);
      setErrorMessage("Failed to assign job.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to remove a job from the staff
  const handleRemoveJobClick = async (staff) => {
    try {
      setIsSubmitting(true);
      const res = await fetch(
        `/api/staff/remove-assigned-job/${staff.phone}/${currentUser.brnumber}`,
        {
          method: "PUT",
        }
      );
      const data = await res.json();

      if (data.success) {
        setSuccessMessage("Job removed successfully.");
        fetchAllStaff(); // Refresh staff records
      } else {
        setErrorMessage("Failed to remove job.");
      }
    } catch (error) {
      console.error("Error removing job:", error);
      setErrorMessage("Failed to remove job.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // REMOVE STAFF MEMBERS
  const handleRemoveStaff = async (staff) => {
    try {
      setIsSubmitting(true);
      const res = await fetch(
        `/api/staff/delete-staff/${staff.phone}/${currentUser.brnumber}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();

      if (data.success) {
        setSuccessMessage("Staff removed successfully.");
        fetchAllStaff(); // Refresh staff records
      } else {
        setErrorMessage("Failed to remove staff member.");
      }
    } catch (error) {
      console.error("Error removing staff:", error);
      setErrorMessage("Failed to remove staff.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to fetch all staff (can be reused to refresh staff data)
  const fetchAllStaff = async () => {
    try {
      const res = await fetch(`/api/staff/getAllStaff/${currentUser.brnumber}`);
      const data = await res.json();
      if (data.success) {
        setStaffRecords(data.staff);
      } else {
        setErrorMessage("Failed to fetch staff records");
      }
    } catch (error) {
      console.error("Error fetching staff records:", error);
      setErrorMessage("Failed to fetch staff records");
    }
  };

  // Open the update staff modal and pre-fill staff details
  const handleUpdateStaffClick = (staff) => {
    setSelectedStaff(staff);
    setUpdatedStaffDetails({
      name: staff.name,
      email: staff.email,
      phone: staff.phone,
      age: staff.age,
    });
    setIsUpdateModalOpen(true);
  };

  // Submit updated staff details
  const handleSubmitUpdate = async () => {
    try {
      setIsSubmitting(true);
      const res = await fetch(
        `/api/staff/update-staff/${selectedStaff.phone}/${currentUser.brnumber}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedStaffDetails),
        }
      );
      const data = await res.json();

      if (data.success) {
        setSuccessMessage("Staff updated successfully.");
        setIsUpdateModalOpen(false);
        fetchAllStaff(); // Refresh staff records after update
      } else {
        setErrorMessage("Failed to update staff.");
      }
    } catch (error) {
      console.error("Error updating staff:", error);
      setErrorMessage("Failed to update staff.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
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

        <h1 className="text-xl px-10 pb-4 font-sans">Staff Records</h1>
        <Link to="/dashboard?tab=staff" className="p-10">
          <button className="p-2 px-3 rounded-lg bg-gradient-to-r from-purple-700 to-purple-900 text-white hover:bg-gradient-to-r hover:from-purple-700 hover:to-purple-800 transition duration-300">
            Return
          </button>
        </Link>

        <div className="p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {staffRecords.map((staff) => (
            <div key={staff.id} className="bg-white p-5 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold">{staff.name}</h2>
              <p>Email: {staff.email}</p>
              <p>Gender: {staff.gender}</p>
              <p>Phone: {staff.phone}</p>
              <p>Age: {staff.age} yrs</p>
              <p>Assigned Job: {staff.jobDescription}</p>
              <div className="flex justify-between mt-3">
                <button
                  className="p-1 px-2 rounded-lg bg-gradient-to-r from-purple-700 to-purple-900 text-white hover:bg-gradient-to-r hover:from-purple-700 hover:to-purple-800 transition duration-100"
                  onClick={() => handleAssignJobClick(staff)}
                >
                  Assign Job
                </button>
                <button
                  className="p-1 px-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition duration-100"
                  onClick={() => handleRemoveJobClick(staff)}
                >
                  Remove Job
                </button>
              </div>
              <div className="flex justify-between mt-3">
                <button
                  className="p-1 px-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition duration-100"
                  onClick={() => handleUpdateStaffClick(staff)}
                >
                  Update
                </button>
                <button
                  className="p-1 px-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition duration-100"
                  onClick={() => handleRemoveStaff(staff)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal to assign a job */}
      <Modal 
  show={isModalOpen} 
  onClose={() => setIsModalOpen(false)} 
  className="rounded-lg shadow-lg transition-all duration-300 ease-in-out transform scale-105"
>
  <Modal.Header className="text-lg font-bold text-white bg-blue-600 rounded-t-lg p-4 shadow-md">
    Assign Job to {selectedStaff?.name}
  </Modal.Header>
  <Modal.Body className="bg-gray-50 p-6 space-y-6">
    <div>
      <Label 
        htmlFor="jobDescription" 
        className="text-sm font-semibold text-gray-600"
      >
        Job Description
      </Label>
      <TextInput
        id="jobDescription"
        type="text"
        className="border-2 border-blue-400 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        placeholder="Enter job description"
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
      />
    </div>
  </Modal.Body>
  <Modal.Footer className="flex justify-between bg-gray-100 p-4 rounded-b-lg">
    <Button 
      onClick={handleSubmitJob} 
      disabled={isSubmitting} 
      className={`bg-blue-600 text-white p-2 px-4 rounded-lg hover:bg-blue-700 transition duration-150 ease-in-out ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {isSubmitting ? "Assigning..." : "Assign"}
    </Button>
    <Button 
      color="gray" 
      className="text-gray-600 hover:text-gray-900 hover:bg-gray-200 p-2 rounded-lg transition duration-150 ease-in-out"
      onClick={() => setIsModalOpen(false)}
    >
      Cancel
    </Button>
  </Modal.Footer>
</Modal>

{/* Update Staff Modal */}
<Modal 
  show={isUpdateModalOpen} 
  onClose={() => setIsUpdateModalOpen(false)} 
  className="rounded-lg shadow-lg transition-all duration-300 ease-in-out transform scale-105"
>
  <Modal.Header className="text-lg font-bold text-white bg-green-600 rounded-t-lg p-4 shadow-md">
    Update Staff Details for {selectedStaff?.name}
  </Modal.Header>
  <Modal.Body className="bg-gray-50 p-6 space-y-6">
    <div>
      <Label htmlFor="staffName" className="text-sm font-semibold text-gray-600">
        Name
      </Label>
      <TextInput
        id="staffName"
        type="text"
        className="border-2 border-green-400 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition"
        placeholder="Enter staff name"
        value={updatedStaffDetails.name}
        onChange={(e) =>
          setUpdatedStaffDetails((prevDetails) => ({
            ...prevDetails,
            name: e.target.value,
          }))
        }
      />
    </div>
    <div>
      <Label htmlFor="staffEmail" className="text-sm font-semibold text-gray-600">
        Email
      </Label>
      <TextInput
        id="staffEmail"
        type="email"
        className="border-2 border-green-400 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition"
        placeholder="Enter staff email"
        value={updatedStaffDetails.email}
        onChange={(e) =>
          setUpdatedStaffDetails((prevDetails) => ({
            ...prevDetails,
            email: e.target.value,
          }))
        }
      />
    </div>
    <div>
      <Label htmlFor="staffPhone" className="text-sm font-semibold text-gray-600">
        Phone
      </Label>
      <TextInput
        id="staffPhone"
        type="text"
        className="border-2 border-green-400 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition"
        placeholder="Enter staff phone"
        value={updatedStaffDetails.phone}
        onChange={(e) =>
          setUpdatedStaffDetails((prevDetails) => ({
            ...prevDetails,
            phone: e.target.value,
          }))
        }
      />
    </div>
    <div>
      <Label htmlFor="staffAge" className="text-sm font-semibold text-gray-600">
        Age
      </Label>
      <TextInput
        id="staffAge"
        type="number"
        className="border-2 border-green-400 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition"
        placeholder="Enter staff age"
        value={updatedStaffDetails.age}
        onChange={(e) =>
          setUpdatedStaffDetails((prevDetails) => ({
            ...prevDetails,
            age: e.target.value,
          }))
        }
      />
    </div>
  </Modal.Body>
  <Modal.Footer className="flex justify-between bg-gray-100 p-4 rounded-b-lg">
    <Button 
      onClick={handleSubmitUpdate} 
      disabled={isSubmitting} 
      className={`bg-green-600 text-white p-2 px-4 rounded-lg hover:bg-green-700 transition duration-150 ease-in-out ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {isSubmitting ? "Updating..." : "Update"}
    </Button>
    <Button 
      color="gray" 
      className="text-gray-600 hover:text-gray-900 hover:bg-gray-200 p-2 rounded-lg transition duration-150 ease-in-out"
      onClick={() => setIsUpdateModalOpen(false)}
    >
      Cancel
    </Button>
  </Modal.Footer>
</Modal>

    </>
  );
}
