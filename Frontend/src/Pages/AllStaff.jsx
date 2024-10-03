import { Label, TextInput, Table, Modal, Button } from "flowbite-react";
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

  // Handle assigning job (already exists in your code)
  const handleAssignJobClick = (staff) => {
    setSelectedStaff(staff);
    setIsModalOpen(true);
  };

  // Submit job assignment (already exists in your code)
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
        // Refresh staff records after successful job assignment
        fetchAllStaff(); // Fetch staff records to show the update
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
        // Refresh staff records after successful job removal
        fetchAllStaff(); // Fetch staff records to reflect the removed job
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

  //REMOVE STAFF MEMBERS
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
        // Refresh staff records after successful job removal
        fetchAllStaff(); // Fetch staff records to reflect the removed job
      } else {
        setErrorMessage("Failed to remove Staff member.");
      }
    } catch (error) {
      console.error("Error removing job:", error);
      setErrorMessage("Failed to remove job.");
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
        fetchAllStaff(); // Refresh staff records after successful update
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
        <div className="p-10">
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          <Table>
            <Table.Head className="text-center">
              <Table.HeadCell>Name</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Gender</Table.HeadCell>
              <Table.HeadCell>Phone</Table.HeadCell>
              <Table.HeadCell>Age</Table.HeadCell>
              <Table.HeadCell>Assigned Job</Table.HeadCell>
              <Table.HeadCell>Actions</Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {staffRecords.map((staff) => (
                <Table.Row key={staff.id} className="text-center">
                  <Table.Cell>{staff.name}</Table.Cell>
                  <Table.Cell>{staff.email}</Table.Cell>
                  <Table.Cell>{staff.gender}</Table.Cell>
                  <Table.Cell>{staff.phone}</Table.Cell>
                  <Table.Cell>{staff.age} yrs</Table.Cell>
                  <Table.Cell>{staff.jobDescription}</Table.Cell>
                  <Table.Cell>
                    <button
                      className="p-2 px-3 rounded-lg bg-gradient-to-r from-purple-700 to-purple-900 text-white hover:bg-gradient-to-r hover:from-purple-700 hover:to-purple-800 transition duration-300"
                      onClick={() => handleAssignJobClick(staff)}
                    >
                      Assign Job
                    </button>
                    <button
                      className="mx-1 p-2 px-3 rounded-lg bg-gradient-to-r from-pink-700 to-pink-900 text-white hover:bg-gradient-to-r hover:from-pink-700 hover:to-pink-800 transition duration-300"
                      onClick={() => handleRemoveJobClick(staff)}
                    >
                      Remove Job
                    </button>
                    <button
                      className="mx-1 p-2 px-3 rounded-lg bg-gradient-to-r from-green-700 to-green-900 text-white hover:bg-gradient-to-r hover:from-green-700 hover:to-green-800 transition duration-300"
                      onClick={() => handleUpdateStaffClick(staff) }
                    >
                      Update
                    </button>
                    <button
                      className=" p-2 px-3 rounded-lg bg-gradient-to-r from-red-700 to-red-900 text-white hover:bg-gradient-to-r hover:from-red-700 hover:to-red-800 transition duration-300"
                      onClick={() => handleRemoveStaff(staff)}
                    >
                      Remove
                    </button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      </div>

      {/* Modal for Assigning Job */}
      {isModalOpen && (
        <Modal
          show={isModalOpen}
          size="lg"
          popup={true}
          onClose={() => setIsModalOpen(false)}
        >
          <Modal.Header />
          <Modal.Body>
            <div className="space-y-6">
              <h3 className="text-xl font-medium text-gray-900">
                Assign Job to:{" "}
                <span className="text-purple-700">{selectedStaff?.name}</span>
              </h3>
              <div>
                <Label htmlFor="jobDescription" value="Job Description" />
                <TextInput
                  id="jobDescription"
                  placeholder="Enter job description"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  required={true}
                />
              </div>
              <div className="w-full flex justify-end gap-2">
                <Button
                  className="p-2 px-3 rounded-lg bg-gradient-to-r from-purple-700 to-purple-900 text-white hover:bg-gradient-to-r hover:from-purple-700 hover:to-purple-800 transition duration-300"
                  onClick={handleSubmitJob}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
                <Button
                  className="p-2 px-3 rounded-lg bg-gradient-to-r from-gray-600 to-gray-700 text-white"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      )}

      {/* Modal for Updating Staff */}
      <Modal show={isUpdateModalOpen} onClose={() => setIsUpdateModalOpen(false)}>
        <Modal.Header>Update Staff</Modal.Header>
        <Modal.Body>
          <div>
            <Label htmlFor="staff-name" value="Name" />
            <TextInput
              id="staff-name"
              value={updatedStaffDetails.name}
              onChange={(e) => setUpdatedStaffDetails({ ...updatedStaffDetails, name: e.target.value })}
              required
            />
            <Label htmlFor="staff-email" value="Email" />
            <TextInput
              id="staff-email"
              type="email"
              value={updatedStaffDetails.email}
              onChange={(e) => setUpdatedStaffDetails({ ...updatedStaffDetails, email: e.target.value })}
              required
            />
            <Label htmlFor="staff-phone" value="Phone" />
            <TextInput
              id="staff-phone"
              value={updatedStaffDetails.phone}
              readOnly // Read-only since we don't want to change the phone
            />
            <Label htmlFor="staff-age" value="Age" />
            <TextInput
              id="staff-age"
              value={updatedStaffDetails.age}
              onChange={(e) => setUpdatedStaffDetails({ ...updatedStaffDetails, age: e.target.value })}
              required
            />
            {errorMessage && (
              <p className="text-red-500">{errorMessage}</p>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            disabled={isSubmitting}
            onClick={handleSubmitUpdate}
            className="p-1 rounded-lg bg-gradient-to-r from-purple-700 to-purple-900 text-white hover:bg-gradient-to-r hover:from-purple-700 hover:to-purple-800 transition duration-300"
          >
            {isSubmitting ? "Updating..." : "Update"}
          </Button>
          <Button color="gray" onClick={() => setIsUpdateModalOpen(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
