import { Label, TextInput, Modal, Button } from "flowbite-react";
import React, { useEffect, useState,useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import backgroundImage from '../Pages/Images/manageStaff.jpg';
import { useReactToPrint } from 'react-to-print';

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
  const componentPDF = useRef();
  // Fetch all staff data using useEffect
  useEffect(() => {
    const fetchAllStaff = async () => {
      try {
        const res = await fetch(`/api/staff/getAllStaff/${currentUser.brnumber}`);
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
  const generatePDF = useReactToPrint({
    content: () => componentPDF.current,
    documentTitle: 'Total Item Report',
    onBeforeGetContent: () => {
        setIsGeneratingPDF(true);
        return Promise.resolve();
    },
    onAfterPrint: () => {
        setIsGeneratingPDF(false);
        alert('Data saved in PDF');
    }
});
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
alert("job assign successfully")
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
        alert("removed job successfully")
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
      alert("staff memeber removed successfully")
      if (data.success) {
        setSuccessMessage("Staff removed successfully.");
        fetchAllStaff(); // Refresh staff records
        alert("staff memeber removed successfully")
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
        alert("updated successfully")
         // Refresh staff records after update
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
      <div
        className="bg-gray-100 w-full"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          // Make sure the background covers the full viewport height
        }}
      >
        <div className="p-10 bg-gray-50 bg-opacity-75 rounded-lg">
        <div className="p-8 flex flex-wrap justify-between gap-12">
  <div className="p-8 bg-white rounded-xl shadow-lg border border-gray-200">
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

<div ref={componentPDF} style={{ width: '100%' }}>
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
          {/* Assign Job Modal */}
          <Modal
  show={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  className="rounded-lg shadow-lg border border-gray-200"
>
  <Modal.Header className="bg-blue-500 text-white text-center rounded-t-lg p-4">
    <h3 className="text-xl font-semibold">Assign Job</h3>
  </Modal.Header>
  <Modal.Body className="p-6 bg-gray-50">
    <div className="flex flex-col gap-4">
      <Label htmlFor="jobDescription" className="text-lg font-medium text-gray-700">
        Job Description
      </Label>
      <TextInput
        id="jobDescription"
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        className="border-2 border-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-md p-2 shadow-sm"
        placeholder="Enter job description"
      />
    </div>
  </Modal.Body>
  <Modal.Footer className="bg-gray-100 flex justify-end gap-4 p-4 rounded-b-lg">
    <Button
      onClick={handleSubmitJob}
      disabled={isSubmitting}
      className={`bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-300 ease-in-out ${
        isSubmitting
          ? "opacity-50 cursor-not-allowed"
          : "hover:bg-blue-600 hover:shadow-lg"
      }`}
    >
      
      {isSubmitting ? "Submitting..." : "Assign"}
    </Button>
    <Button
      color="gray"
      onClick={() => setIsModalOpen(false)}
      className="bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-gray-500 hover:shadow-lg transition-all duration-300 ease-in-out"
    >
      Cancel
    </Button>
  </Modal.Footer>
</Modal>


          {/* Update Staff Modal */}
          <Modal
  show={isUpdateModalOpen}
  onClose={() => setIsUpdateModalOpen(false)}
  className="rounded-xl shadow-lg border border-gray-300"
>
  <Modal.Header className="bg-green-500 text-white rounded-t-xl p-4">
    <h3 className="text-lg font-semibold text-center">Update Staff</h3>
  </Modal.Header>
  <Modal.Body className="p-6 bg-gray-50">
    <div className="flex flex-col gap-5">
      <Label htmlFor="name" className="text-md font-medium text-gray-700">
        Name
      </Label>
      <TextInput
        id="name"
        value={updatedStaffDetails.name}
        onChange={(e) => setUpdatedStaffDetails({ ...updatedStaffDetails, name: e.target.value })}
        className="border-2 border-green-400 rounded-md p-2 focus:ring-2 focus:ring-green-500 focus:outline-none shadow-sm"
        placeholder="Enter name"
      />
      
      <Label htmlFor="email" className="text-md font-medium text-gray-700">
        Email
      </Label>
      <TextInput
        id="email"
        value={updatedStaffDetails.email}
        onChange={(e) => setUpdatedStaffDetails({ ...updatedStaffDetails, email: e.target.value })}
        className="border-2 border-green-400 rounded-md p-2 focus:ring-2 focus:ring-green-500 focus:outline-none shadow-sm"
        placeholder="Enter email"
      />
      
      <Label htmlFor="phone" className="text-md font-medium text-gray-700">
        Phone
      </Label>
      <TextInput
        id="phone"
        value={updatedStaffDetails.phone}
        onChange={(e) => setUpdatedStaffDetails({ ...updatedStaffDetails, phone: e.target.value })}
        className="border-2 border-green-400 rounded-md p-2 focus:ring-2 focus:ring-green-500 focus:outline-none shadow-sm"
        placeholder="Enter phone number"
      />
      
      <Label htmlFor="age" className="text-md font-medium text-gray-700">
        Age
      </Label>
      <TextInput
        id="age"
        value={updatedStaffDetails.age}
        onChange={(e) => setUpdatedStaffDetails({ ...updatedStaffDetails, age: e.target.value })}
        className="border-2 border-green-400 rounded-md p-2 focus:ring-2 focus:ring-green-500 focus:outline-none shadow-sm"
        placeholder="Enter age"
      />
    </div>
  </Modal.Body>
  <Modal.Footer className="bg-gray-100 flex justify-end gap-4 p-4 rounded-b-xl">
    <Button
      onClick={handleSubmitUpdate}
      disabled={isSubmitting}
      className={`bg-green-500 text-white font-semibold py-2 px-5 rounded-lg shadow-md transition-all duration-300 ease-in-out ${
        isSubmitting
          ? "opacity-50 cursor-not-allowed"
          : "hover:bg-green-600 hover:shadow-lg"
      }`}
    >
      {isSubmitting ? "Updating..." : "Update"}
    </Button>
    <Button
      color="gray"
      onClick={() => setIsUpdateModalOpen(false)}
      className="bg-gray-400 text-white font-semibold py-2 px-5 rounded-lg shadow-md hover:bg-gray-500 hover:shadow-lg transition-all duration-300 ease-in-out"
    >
      Cancel
    </Button>
  </Modal.Footer>
</Modal>

        </div>
      </div>
    </>
  );
}
