import { TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

export default function Staff() {
    const [crowdCountFromDB, setCrowdCountFromDB] = useState(null); // State to hold the crowd count
  const [crowdCountMicroService, setCrowdCountMicroService] = useState(null);
  const [error, setError] = useState(null); // State to show error
  const [loading, setLoading] = useState(true);
  const [updateMessage, setUpdateMessage] = useState();
  const navigate = useNavigate();
  const { currentUser, loading1 } = useSelector((state) => state.user);
  const brnumber = currentUser.brnumber;
  const [showModel, setShowModel] = useState(false);
  const [lastFetchedTime, setLastFetchedTime] = useState(null);
  const [CrowdDeviceMacMicroservice,setCrowdDeviceMacMicroservice] = useState(null);

  //console.log(CrowdDeviceMacMicroservice);

  useEffect(() => {
    const fetchCrowdCountFromDB = async () => {
      try {
        // Make a request to the backend API with the brnumber in the URL
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
        setError("Failed to fetch crowd count"); // Set error message
      } finally {
        setLoading(false); // Set loading to false after the request
      }
    };

    if (brnumber) {
      fetchCrowdCountFromDB(); // Fetch crowd count if the brnumber is provided
    }
  }, [brnumber]);

  

  
  
  
  return (
    <div className="bg-gray-100 w-full">
      <div className="p-10 bg-gray-50 flex flex-wrap justify-between gap-32">
        <div>
          <h1 className="text-2xl font-cinzel font-semibold">
            Welcom back!,{" "}
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
          {/* Left Side: H1, buttons, and instructions */}
          <div className="gap-5">
            <Link to=''>
              <button
                type="submit"
                className="p-2 px-3 rounded-lg bg-gradient-to-r from-purple-700 to-purple-900 text-white hover:bg-gradient-to-r hover:from-purple-700 hover:to-purple-800 transition duration-300"
              >
                Add Staff
              </button>
            </Link>

            <Link to=''>
              <button
                type="submit"
                className="p-2 px-3 rounded-lg bg-gradient-to-r from-purple-700 to-purple-900 text-white hover:bg-gradient-to-r hover:from-purple-700 hover:to-purple-800 transition duration-300"
              >
                Staff
              </button>
            </Link>

            <Link to=''>
              <button
                type="submit"
                className="p-2 px-3 rounded-lg bg-gradient-to-r from-purple-700 to-purple-900 text-white hover:bg-gradient-to-r hover:from-purple-700 hover:to-purple-800 transition duration-300"
              >
                Task Management
              </button>
            </Link>
          </div>

          {/* Right Side: Image */}
          <div className="flex-1 lg:mt-0 lg:ml-10 ">
            <img
              src="/img/crowd.png"
              alt="crowd-image"
              className="max-w-full h-auto object-contain opacity-80"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
