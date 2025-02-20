import { Label, TextInput, Table, Modal, Button } from "flowbite-react";
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import logo from '../Pages/Images/staffMember.jpg';
import { useReactToPrint } from 'react-to-print';

export default function AllTaskToStaff() {
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
  const [searchkey,setsearchkey]=useState('');

  const componentPDF = useRef(); // Ref to the component to print

  // Fetch all staff data using useEffect
  useEffect(() => {
    const fetchAllStaff = async () => {
      try {
        const res = await fetch(`/api/staff/getAllStaff`);
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

    fetchAllStaff();
  }, []);
  const handlesearch = (e) => {

    filterdata(searchkey);
}
const filterdata = (searchKey) => {
    const filteredData = staffRecords.filter(customer =>
        customer && customer.name && customer.name.toLowerCase().includes(searchKey.toLowerCase())
    );
    setStaffRecords(filteredData);
}

  const generatePDF = useReactToPrint({
    content: () => componentPDF.current,
    documentTitle: 'Total Task Report',
    onBeforeGetContent: () => {
      return Promise.resolve();
    },
    onAfterPrint: () => {
      alert('Data saved in PDF');
    }
  });

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
        fetchAllStaff(); // Refresh staff records after successful job assignment
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
      <div className="bg-cover bg-center min-h-screen" style={{ backgroundImage: `url(${logo})` }}>
      <div className='flex justify-center items-center mb-4'>
  <input
    type="search"
    onChange={(e) => setsearchkey(e.target.value)}
    placeholder='Search staff by name'
    className='border border-gray-300 rounded-l-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-purple-600'
  />
  <button
    id='search-btn'
    onClick={handlesearch}
    className='bg-gradient-to-r from-purple-700 to-purple-900 text-white rounded-r-lg py-2 px-4 hover:bg-gradient-to-r hover:from-purple-800 hover:to-purple-600 transition duration-300'
  >
    Search
  </button>
</div>

        <div className="bg-black bg-opacity-50 min-h-screen py-10">
          <h1 className="text-3xl text-white px-10 pb-4 font-sans">Staff Records</h1>
          <Link to='/' className="p-10">
            <button
              className="p-2 px-3 rounded-lg bg-gradient-to-r from-purple-700 to-purple-900 text-white hover:bg-gradient-to-r hover:from-purple-700 hover:to-purple-800 transition duration-300"
            >
              Log Out
            </button>
          </Link>
          
         
            <div className="p-40">
              {errorMessage && <p className="text-red-700">{errorMessage}</p>}
              <div ref={componentPDF} style={{ width: '100%' }}>
              <Table>
                <Table.Head className="text-center">
                  <Table.HeadCell>Name</Table.HeadCell>
                  <Table.HeadCell>Email</Table.HeadCell>
                  <Table.HeadCell>Gender</Table.HeadCell>
                  <Table.HeadCell>Phone</Table.HeadCell>
                  <Table.HeadCell>Age</Table.HeadCell>
                  <Table.HeadCell>Assigned Job</Table.HeadCell>
                  <Table.HeadCell>Status</Table.HeadCell>
                </Table.Head>
                <Table.Body>
                  {staffRecords.map((staff) => (
                    <Table.Row key={staff.id} className="text-center">
                      <Table.Cell className="text-white">{staff.name}</Table.Cell>
                      <Table.Cell className="text-white">{staff.email}</Table.Cell>
                      <Table.Cell className="text-white">{staff.gender}</Table.Cell>
                      <Table.Cell className="text-white">{staff.phone}</Table.Cell>
                      <Table.Cell className="text-white">{staff.age} yrs</Table.Cell>
                      <Table.Cell className="text-white">{staff.jobDescription}</Table.Cell>
                      <Table.Cell>
                        <button
                          className="mx-1 p-2 px-3 rounded-lg bg-gradient-to-r from-green-700 to-green-900 text-white hover:bg-gradient-to-r hover:from-green-700 hover:to-green-800 transition duration-300"
                          onClick={() => handleUpdateStaffClick(staff)}
                        >
                          Assign Task
                        </button>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>
          </div>
          
          <Button onClick={generatePDF} className="mt-4">Generate Report</Button>

          {/* Modal for Assigning Job */}
          {isModalOpen && (
            <Modal show={isModalOpen} size="lg" popup={true} onClose={() => setIsModalOpen(false)}>
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

          {/* Modal for Updating Staff
          {isUpdateModalOpen && (
            <Modal show={isUpdateModalOpen} size="lg" popup={true} onClose={() => setIsUpdateModalOpen(false)}>
              <Modal.Header />
              <Modal.Body>
                <div className="space-y-6">
                  <h3 className="text-xl font-medium text-gray-900">
                    Update Staff Details for:{" "}
                    <span className="text-purple-700">{selectedStaff?.name}</span>
                  </h3>
                  <div>
                    <Label htmlFor="name" value="Name" />
                    <TextInput
                      id="name"
                      placeholder="Enter name"
                      value={updatedStaffDetails.name}
                      onChange={(e) => setUpdatedStaffDetails({ ...updatedStaffDetails, name: e.target.value })}
                      required={true}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" value="Email" />
                    <TextInput
                      id="email"
                      type="email"
                      placeholder="Enter email"
                      value={updatedStaffDetails.email}
                      onChange={(e) => setUpdatedStaffDetails({ ...updatedStaffDetails, email: e.target.value })}
                      required={true}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" value="Phone" />
                    <TextInput
                      id="phone"
                      placeholder="Enter phone"
                      value={updatedStaffDetails.phone}
                      onChange={(e) => setUpdatedStaffDetails({ ...updatedStaffDetails, phone: e.target.value })}
                      required={true}
                    />
                  </div>
                  <div>
                    <Label htmlFor="age" value="Age" />
                    <TextInput
                      id="age"
                      placeholder="Enter age"
                      value={updatedStaffDetails.age}
                      onChange={(e) => setUpdatedStaffDetails({ ...updatedStaffDetails, age: e.target.value })}
                      required={true}
                    />
                  </div>
                  <div className="w-full flex justify-end gap-2">
                    <Button
                      className="p-2 px-3 rounded-lg bg-gradient-to-r from-purple-700 to-purple-900 text-white hover:bg-gradient-to-r hover:from-purple-700 hover:to-purple-800 transition duration-300"
                      onClick={handleSubmitUpdate}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Updating..." : "Update"}
                    </Button>
                    <Button
                      className="p-2 px-3 rounded-lg bg-gradient-to-r from-gray-600 to-gray-700 text-white"
                      onClick={() => setIsUpdateModalOpen(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </Modal.Body>
            </Modal>
          )} */}
        </div>
      </div>
    </>
  );
}
