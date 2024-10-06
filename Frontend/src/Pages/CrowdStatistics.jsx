import { useEffect, useState } from "react";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function HourlyCrowdReport() {
  const [crowdStats, setCrowdStats] = useState([]); // State to hold crowd statistics
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState(null); // State for errors

  // Function to fetch crowd statistics (replace with your actual fetch logic)
  const fetchCrowdStatistics = async () => {
    try {
      setLoading(true); 
      // Simulated API call (replace this with your actual API call)
      const res = await fetch('/api/crowd/crowd-statistics/your-shop-id');
      const data = await res.json();

      if (data.success && Array.isArray(data.crowdStatistics)) {
        setCrowdStats(data.crowdStatistics);
      } else {
        setCrowdStats([]);
        setError("Failed to fetch crowd statistics");
      }
    } catch (error) {
      setError("Failed to fetch crowd statistics");
      setCrowdStats([]);
    } finally {
      setLoading(false);
    }
  };

  // UseEffect to fetch crowd statistics on component mount
  useEffect(() => {
    fetchCrowdStatistics(); // Fetch crowd statistics
  }, []);

  // Helper function to aggregate data by hour
  const aggregateDataByHour = () => {
    const hourlyData = {};

    crowdStats.forEach((report) => {
      const date = new Date(report.timestamp._seconds * 1000); // Convert timestamp to JS Date
      const hour = date.getHours(); // Extract hour from the date (0 to 23)

      // Initialize the hour if not already in the object
      if (!hourlyData[hour]) {
        hourlyData[hour] = 0;
      }

      // Add the crowd count to the appropriate hour
      hourlyData[hour] += report.previousCrowdCount;
    });

    return hourlyData;
  };

  // Aggregated hourly data
  const hourlyData = aggregateDataByHour();

  // Prepare data for the Bar chart
  const chartData = {
    labels: Object.keys(hourlyData).map((hour) => `${hour}:00`), // Labels (hours)
    datasets: [
      {
        label: 'Number of People',
        data: Object.values(hourlyData), // Crowd count for each hour
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Hourly Crowd Report',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Hour of the Day',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Number of People',
        },
        beginAtZero: true, // Start y-axis at 0
      },
    },
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="bg-gray-100 w-full p-10">
      <h1 className="text-2xl font-semibold">Hourly Crowd Report</h1>
      {/* Bar Chart for Hourly Crowd Report */}
      <div className="mt-5">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}
