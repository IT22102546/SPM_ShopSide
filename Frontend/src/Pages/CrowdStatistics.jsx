import { Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
import jsPDF from "jspdf";
import html2canvas from "html2canvas";


export default function CrowdStatistics() {
    const { currentUser, loading1 } = useSelector((state) => state.user);
    const [crowdStats, setCrowdStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    const fetchCrowdStatistics = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/crowd/crowd-statistics/${currentUser.brnumber}`
        );
        const data = await res.json();
  
        console.log(data);
  
        if (data.success && Array.isArray(data.crowdStatistics)) {
          setCrowdStats(data.crowdStatistics);
        } else {
          setCrowdStats([]);
          setError("Failed to fetch crowd statistics");
        }
      } catch (error) {
        console.error("Error fetching crowd statistics:", error);
        setError("Failed to fetch crowd statistics");
        setCrowdStats([]);
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      if (currentUser?.brnumber) {
        fetchCrowdStatistics();
      }
    }, [currentUser]);
  
    if (loading1 || loading) {
      return <div>Loading...</div>;
    }
  
    if (error) {
      return <div>Error: {error}</div>;
    }

    const generatePdfReport = async () => {
        const pdf = new jsPDF();
      
        // Add a title to the PDF
        pdf.setFontSize(18);
        pdf.text("Store Crowd Report", 20, 20);
      
        // Capture the chart as an image
        const chartElement = document.getElementById("crowd-chart");
        const chartCanvas = await html2canvas(chartElement);
        const chartImage = chartCanvas.toDataURL("image/png");
      
        // Add the chart image to the PDF
        pdf.addImage(chartImage, "PNG", 20, 30, 170, 80); // Adjust dimensions and position as needed

        // Add the peak and least busy hour information
        const hourlyCrowd = calculateHourlyCrowd(crowdStats); // Reuse the crowd calculation
        const { peakHour, leastBusyHour, maxCrowd, minCrowd } = findPeakAndLeastBusyHours(hourlyCrowd);

        pdf.setFontSize(16);
        pdf.text("Crowd Analysis", 20, 120);
        pdf.setFontSize(12);
        pdf.text(`Peak Hour: ${peakHour}:00 with ${maxCrowd} people.`, 20, 130);
        pdf.text(`Least Busy Hour: ${leastBusyHour}:00 with ${minCrowd} people.`, 20, 140);
      
        // Capture the table as an image
        const tableElement = document.getElementById("crowd-table");
        const tableCanvas = await html2canvas(tableElement);
        const tableImage = tableCanvas.toDataURL("image/png");
      
        // Add a space before the table
        pdf.addPage();
        pdf.setFontSize(16);
        pdf.text("Crowd Statistics Table", 20, 20);
      
        // Add the table image to the PDF
        pdf.addImage(tableImage, "PNG", 20, 30, 170, 120); // Adjust dimensions and position as needed
      
        // Download the PDF
        pdf.save("crowd_report.pdf");
      };
  
    // Calculate hourly crowd data
    const calculateHourlyCrowd = (crowdStats) => {
      const hourlyCrowd = {};
  
      crowdStats.forEach((report) => {
        const date = new Date(report.timestamp._seconds * 1000);
        const hour = date.getHours();
  
        if (hourlyCrowd[hour]) {
          hourlyCrowd[hour] += report.previousCrowdCount;
        } else {
          hourlyCrowd[hour] = report.previousCrowdCount;
        }
      });
  
      return hourlyCrowd;
    };
  
    const findPeakAndLeastBusyHours = (hourlyCrowd) => {
      let peakHour = null;
      let leastBusyHour = null;
      let maxCrowd = -Infinity;
      let minCrowd = Infinity;
  
      for (const [hour, crowdCount] of Object.entries(hourlyCrowd)) {
        if (crowdCount > maxCrowd) {
          maxCrowd = crowdCount;
          peakHour = hour;
        }
        if (crowdCount < minCrowd) {
          minCrowd = crowdCount;
          leastBusyHour = hour;
        }
      }
  
      return { peakHour, leastBusyHour, maxCrowd, minCrowd };
    };
  
    const hourlyCrowd = calculateHourlyCrowd(crowdStats);
    const { peakHour, leastBusyHour, maxCrowd, minCrowd } = findPeakAndLeastBusyHours(hourlyCrowd);
  
    const chartData = {
      labels: crowdStats.map((report) => {
        const date = new Date(report.timestamp._seconds * 1000);
        return `${date.getHours()}:00`;
      }),
      datasets: [
        {
          label: "Number of People",
          data: crowdStats.map((report) => report.previousCrowdCount),
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    };
  
    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Store Crowd Over Time",
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Time (Hours)",
          },
        },
        y: {
          title: {
            display: true,
            text: "Number of People",
          },
          beginAtZero: true,
        },
      },
    };
  
    return (
      <div className="bg-gray-100 w-full p-10">
        <div className="">
        {/* Left Side: Bar Chart */}
        <div className="w-full lg:w-1/2">
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
          <h1 className="text-xl font-semibold mt-3">Store Crowd Statistics</h1>{" "}
          <br />
          {/* Refresh Button */}
          <button
            className="p-2 px-3 mx-2 rounded-lg bg-gradient-to-r from-purple-700 to-purple-900 text-white hover:bg-gradient-to-r hover:from-purple-700 hover:to-purple-800 transition duration-300"
            onClick={fetchCrowdStatistics} // Trigger data fetch when the button is clicked
          >
            Refresh
          </button>
          <button
            className="p-2 px-3 rounded-lg bg-gradient-to-r from-blue-700 to-blue-900 text-white hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-800 transition duration-300"
            onClick={generatePdfReport} // Trigger data fetch when the button is clicked
          >
            Download Report
          </button>
        </div>
      </div>
  
        <div className="mt-5">
          <h2 className="text-xl font-semibold">Crowd Report Summary</h2>
          <p>Peak Hour: {peakHour}:00 with {maxCrowd} people</p>
          <p>Least Busy Hour: {leastBusyHour}:00 with {minCrowd} people</p>
        </div>
  
        <div className="mt-5 w-2/4" id="crowd-chart">
          <Bar data={chartData} options={options} />
        </div>
  
        <div className="mt-5" id="crowd-table">
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
                      {new Date(report.timestamp._seconds * 1000).toLocaleString()}
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
    );
  }
  