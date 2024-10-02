import { Label, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

export default function Crowd() {
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

  // Handle input change for the crowd count
  const handleChange = (e) => {
    setCrowdCountMicroService(e.target.value); // Update crowd count state based on user input
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send a PUT request to update the crowd count
      const res = await fetch(`/api/crowd/update/${brnumber}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ crowdCount: Number(crowdCountMicroService) }), // Ensure crowdCountFromDB is sent as a number
      });

      const data = await res.json();

      if (!data.success) {
        setError("Already updated.");

        // Clear the error message after 3 seconds
        setTimeout(() => {
          setError(null);
        }, 3000);

        return;
      }

      setError(null); // Clear any existing error messages
      setUpdateMessage("Crowd count updated successfully!"); // Show success message

      // Clear the success message after 3 seconds
      setTimeout(() => {
        setUpdateMessage(null);
      }, 3000);

      // Redirect to /dashboard?tab=crowd after 2 seconds
      setTimeout(() => {
        navigate("/dashboard?tab=crowd");
      }, 2000);
    } catch (error) {
      setError("An error occurred while updating the crowd count.");

      // Clear the error message after 3 seconds
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };

  //Handle submit on microservice
  const handleSubmitMicroservice = async (e) => {
    e.preventDefault();

    try {
      // Make a request to your backend API to get the crowd count from the Python microservice
      const res = await fetch("/api/crowd/getCountMicroservice");

      // Parse the response
      const data = await res.json();

      if (res.ok && data.crowdCount && data.device_mac) {
        // Set the crowd count from the microservice to the state
        setCrowdCountMicroService(data.crowdCount);
        setCrowdDeviceMacMicroservice(data.device_mac)
        setError(null); // Clear any previous errors

        // Set the last fetched time to the current time
        const currentTime = new Date().toLocaleString();
        setLastFetchedTime(currentTime);
      } else {
        setError("Failed to fetch crowd count from the microservice.");
      }
    } catch (error) {
      console.error("Error fetching crowd count from microservice:", error);
      setError("An error occurred while fetching crowd count.");
    }
  };

  // Automatically fetch crowd count every 10 minutes (600,000 ms)
  useEffect(() => {
    const intervalId = setInterval(() => {
      handleSubmitMicroservice();
    }, 600000); // 10 minutes

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

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

        <div className="flex flex-col justify-center items-center gap-2">
          <h1 className="font-cinzel">Live crowd in store: </h1>
          <h1 className="text-5xl font-bold font-sans text-purple-700">
            {crowdCountMicroService || "0"}
          </h1>

          {/* Display the last fetched time */}
          <div className="">
            <p className="text-xs text-gray-500 mt-2">
              Last updated: {lastFetchedTime || "Fetching..."}
            </p>
          </div>
          <div className="  mt-4">
            {/* Form to update crowd count */}
            <form onSubmit={handleSubmit}>
              <div className="">
                <TextInput
                  id="crowdCountFromDB"
                  type="number"
                  placeholder="Enter new crowd count"
                  // Input value is bound to crowdCountMicroService state
                  value={crowdCountMicroService}
                  onChange={handleChange}
                  className="hidden"
                />
              </div>
              <button
                type="submit"
                className="p-2 px-3 rounded-lg bg-gradient-to-r from-purple-700 to-purple-900 text-white hover:bg-gradient-to-r hover:from-purple-700 hover:to-purple-800 transition duration-300"
              >
                Update live count now
              </button>
              <br />
              <div>
                {updateMessage && (
                  <p className="text-green-500 mt-2 text-xs">{updateMessage}</p>
                )}
                {error && <p className="text-red-500 mt-2 text-xs">*{error}</p>}
              </div>
            </form>
            {/* Success or error message */}
          </div>
        </div>
      </div>

      <div className="p-10">
        <div className="flex flex-col lg:flex-row lg:justify-between items-start gap-5">
          {/* Left Side: H1, buttons, and instructions */}
          <div className="flex-1">
            <h1 className="text-lg font-sans">
              Earlier crowd count <span>: {crowdCountFromDB}</span>
            </h1>

            <div className="mt-2 flex flex-wrap justify-start gap-5">
              <form onSubmit={handleSubmitMicroservice}>
                <button className="p-3 px-3 rounded-lg bg-gradient-to-r from-purple-700 to-purple-900 text-white hover:bg-gradient-to-r hover:from-purple-700 hover:to-purple-800 transition duration-300">
                  Get live crowd count now
                </button>
              </form>

              <Link to="/create-record-crowd">
                <button className="p-3 px-3 rounded-lg bg-gradient-to-r from-blue-700 to-blue-900 text-white hover:bg-blue-700">
                  Create crowd record
                </button>
                <br />
                <span className="text-red-800 text-xs font-sans block">
                  *if you're new to the system, then create only a crowd record
                </span>
              </Link>
            </div>

            <hr />
            <h1 className="text-lg font-sans mt-8">List of device mac addreses</h1>
            <div className="mt-8">
                
                <ul>
                    {CrowdDeviceMacMicroservice.map((macAddress, index) => (
                        <li key={index} className="text-gray-600">{macAddress}</li>
                    ))}
                </ul>
            </div>
          </div>

          {/* Right Side: Image */}
          <div className="flex-1 -mt-10 lg:mt-0 lg:ml-10 ">
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
