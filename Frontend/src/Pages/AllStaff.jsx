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
        <Link to='/dashboard?tab=staff' className="p-10">
          <button
            className="p-2 px-3 rounded-lg bg-gradient-to-r from-purple-700 to-purple-900 text-white hover:bg-gradient-to-r hover:from-purple-700 hover:to-purple-800 transition duration-300"
          >
            Return
          </button>
        </Link>
        <div className="p-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {staffRecords.map((staff) => (
            <div key={staff.id} className="bg-white rounded-lg shadow-md p-5">
              <h2 className="text-xl font-bold">{staff.name}</h2>
              <p>Email: {staff.email}</p>
              <p>Gender: {staff.gender}</p>
              <p>Phone: {staff.phone}</p>
              <p>Age: {staff.age} yrs</p>
              <p>Assigned Job: {staff.jobDescription}</p>
              <div className="mt-4 flex space-x-2">
                <button
                  className="p-2 px-3 rounded-lg bg-gradient-to-r from-purple-700 to-purple-900 text-white hover:bg-gradient-to-r hover:from-purple-700 hover:to-purple-800 transition duration-300"
                  onClick={() => handleAssignJobClick(staff)}
                >
                  Assign Job
                </button>
                <button
                  className="p-2 px-3 rounded-lg bg-red-600 text-white hover:bg-red-700 transition duration-300"
                  onClick={() => handleRemoveJobClick(staff)}
                >
                  Remove Job
                </button>
                <button
                  className="p-2 px-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition duration-300"
                  onClick={() => handleUpdateStaffClick(staff)}
                >
                  Update
                </button>
                <button
                  className="p-2 px-3 rounded-lg bg-red-600 text-white hover:bg-red-700 transition duration-300"
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
      >
        <Modal.Header>Assign Job to {selectedStaff?.name}</Modal.Header>
        <Modal.Body>
          <Label htmlFor="job-description" value="Job Description" />
          <TextInput
            id="job-description"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Enter job description"
          />
          {errorMessage && <p className="text-red-600">{errorMessage}</p>}
          {successMessage && <p className="text-green-600">{successMessage}</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={handleSubmitJob}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Assigning..." : "Assign"}
          </Button>
          <Button
            color="gray"
            onClick={() => {
              setIsModalOpen(false);
              setJobDescription("");
            }}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Update Staff Modal */}
      <Modal
        show={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
      >
        <Modal.Header>Update Staff Details</Modal.Header>
        <Modal.Body>
          <Label htmlFor="name" value="Name" />
          <TextInput
            id="name"
            value={updatedStaffDetails.name}
            onChange={(e) =>
              setUpdatedStaffDetails({ ...updatedStaffDetails, name: e.target.value })
            }
          />
          <Label htmlFor="email" value="Email" />
          <TextInput
            id="email"
            type="email"
            value={updatedStaffDetails.email}
            onChange={(e) =>
              setUpdatedStaffDetails({ ...updatedStaffDetails, email: e.target.value })
            }
          />
          <Label htmlFor="phone" value="Phone" />
          <TextInput
            id="phone"
            value={updatedStaffDetails.phone}
            onChange={(e) =>
              setUpdatedStaffDetails({ ...updatedStaffDetails, phone: e.target.value })
            }
          />
          <Label htmlFor="age" value="Age" />
          <TextInput
            id="age"
            value={updatedStaffDetails.age}
            onChange={(e) =>
              setUpdatedStaffDetails({ ...updatedStaffDetails, age: e.target.value })
            }
          />
          {errorMessage && <p className="text-red-600">{errorMessage}</p>}
          {successMessage && <p className="text-green-600">{successMessage}</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={handleSubmitUpdate}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating..." : "Update"}
          </Button>
          <Button
            color="gray"
            onClick={() => setIsUpdateModalOpen(false)}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
