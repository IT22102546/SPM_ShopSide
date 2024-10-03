import { Label, TextInput, Table } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function AllStaff() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser, loading } = useSelector((state) => state.user);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [staffRecords, setStaffRecords] = useState([]); // State to hold staff records

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

    // Fetch staff data if brnumber is available
    if (currentUser.brnumber) {
      fetchAllStaff();
    }
  }, [currentUser.brnumber]);

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

        <h1 className='text-xl px-10 pb-4 font-sans'>Staff Records</h1>
        
        <div className='p-10'>
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          <Table>
            <Table.Head className='text-center'>
              <Table.HeadCell>Name</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Gender</Table.HeadCell>
              <Table.HeadCell>Phone</Table.HeadCell>
              <Table.HeadCell>Age</Table.HeadCell>
              <Table.HeadCell>Assigned Job</Table.HeadCell>
              <Table.HeadCell>Actions</Table.HeadCell>
            </Table.Head>
            <Table.Body >
              {staffRecords.map((staff) => (
                <Table.Row key={staff.id} className='text-center'>
                  <Table.Cell>{staff.name}</Table.Cell>
                  <Table.Cell>{staff.email}</Table.Cell>
                  <Table.Cell>{staff.gender}</Table.Cell>
                  <Table.Cell>{staff.phone}</Table.Cell>
                  <Table.Cell>{staff.age} yrs</Table.Cell>
                  <Table.Cell>{staff.jobDescription}</Table.Cell>
                  <Table.Cell>
                    {/* Add buttons for assign/remove job actions here */}
                    <button className="p-2 px-3 rounded-lg bg-gradient-to-r from-purple-700 to-purple-900 text-white hover:bg-gradient-to-r hover:from-purple-700 hover:to-purple-800 transition duration-300">Assign Job</button>
                    <button className="mx-2 p-2 px-3 rounded-lg bg-gradient-to-r from-red-700 to-red-900 text-white hover:bg-gradient-to-r hover:from-red-700 hover:to-red-800 transition duration-300">Remove Job</button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      </div>
    </>
  );
}
