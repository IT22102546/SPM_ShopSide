import { Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function CrowdStatistics() {
  const { currentUser, loading1 } = useSelector((state) => state.user); // Redux state for user
  const [crowdStats, setCrowdStats] = useState([]); // State to hold crowd statistics
  const [loading, setLoading] = useState(true); // State for loading state
  const [error, setError] = useState(null); // State for handling errors

  // Function to fetch crowd statistics
  const fetchCrowdStatistics = async () => {
    try {
      setLoading(true); // Start loading when refetching
      const res = await fetch(
        `/api/crowd/crowd-statistics/${currentUser.brnumber}`
      );
      const data = await res.json();

      console.log(data); // Log the API response for debugging

      if (data.success && Array.isArray(data.crowdStatistics)) {
        setCrowdStats(data.crowdStatistics); // Set the fetched crowd statistics
      } else {
        setCrowdStats([]); // Ensure it's set to an empty array if no data is found
        setError("Failed to fetch crowd statistics");
      }
    } catch (error) {
      console.error("Error fetching crowd statistics:", error);
      setError("Failed to fetch crowd statistics"); // Set error message
      setCrowdStats([]); // Set crowdStats to an empty array on error
    } finally {
      setLoading(false); // Set loading to false after the request
    }
  };

  // UseEffect to fetch crowd statistics when the component first loads
  useEffect(() => {
    if (currentUser?.brnumber) {
      fetchCrowdStatistics(); // Fetch crowd statistics if the brnumber is provided
    }
  }, [currentUser]);

  if (loading1 || loading) {
    return <div>Loading...</div>; // Show loading if user or data is still being fetched
  }

  if (error) {
    return <div>Error: {error}</div>; // Show error message if there was an error fetching data
  }

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
        <div className="flex flex-col lg:flex-row lg:justify-between items-start gap-5">
          <div className="flex-1">
            <div>
              <h1 className="text-xl font-semibold">Store Crowd Statistics</h1> <br />
              {/* Refresh Button */}
              <button
                className="p-2 px-3 rounded-lg bg-gradient-to-r from-purple-700 to-purple-900 text-white hover:bg-gradient-to-r hover:from-purple-700 hover:to-purple-800 transition duration-300"
                onClick={fetchCrowdStatistics} // Trigger data fetch when the button is clicked
              >
                Refresh
              </button>
            </div>
            <div className="mt-2 flex flex-wrap justify-start gap-5">
              {/* Display Crowd Statistics */}
              {Array.isArray(crowdStats) && crowdStats.length > 0 ? (
                <Table striped={true}>
                  <Table.Head>
                    <Table.HeadCell>Timestamp</Table.HeadCell>
                    <Table.HeadCell>Previous Crowd Count</Table.HeadCell>
                  </Table.Head>
                  <Table.Body className="divide-y">
                    {crowdStats.map((report) => (
                      <Table.Row key={report.id} className="bg-white">
                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900">
                          {new Date(
                            report.timestamp._seconds * 1000
                          ).toLocaleString()}
                        </Table.Cell>
                        <Table.Cell>{report.previousCrowdCount}</Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              ) : (
                <p>No crowd statistics available for this shop.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
