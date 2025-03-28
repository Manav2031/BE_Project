import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import '../styles/ViewGraphs.css';
// Register required components in Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const CheatingDevicesGraphs = () => {
  const [graphData, setGraphData] = useState([]);
  const [barStartTimestamp, setBarStartTimestamp] = useState('');
  const [barEndTimestamp, setBarEndTimestamp] = useState('');

  const fetchData = async () => {
    try {
      const response = await axios.get(
        'https://electron-eye.onrender.com/api/display-cheating-devices'
      );
      setGraphData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Use useEffect to fetch data periodically
  useEffect(() => {
    fetchData(); // Fetch data immediately on component mount
    const interval = setInterval(fetchData, 5000); // Fetch data every 5 seconds
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  // Filter data based on timestamps for bar chart
  const filterBarDataByTimestamp = (data) => {
    if (!barStartTimestamp || !barEndTimestamp) return data;

    const startDate = new Date(barStartTimestamp);
    const endDate = new Date(barEndTimestamp);

    return data.filter((item) => {
      const itemDate = new Date(item.timestamp);
      return itemDate >= startDate && itemDate <= endDate;
    });
  };

  // Prepare bar chart data
  const filteredGraphData = filterBarDataByTimestamp(graphData);

  // Prepare stacked bar chart data
  const macAddresses = [
    ...new Set(filteredGraphData.map((item) => item.mac_address)),
  ];
  const cheatingTypes = [
    ...new Set(filteredGraphData.map((item) => item.type_of_cheating)),
  ];

  // Count occurrences of each cheating type per MAC address
  const stackedBarChartData = {
    labels: cheatingTypes, // Cheating types for the x-axis
    datasets: macAddresses.map((mac, index) => ({
      label: mac, // Label each MAC address
      data: cheatingTypes.map((cheatingType) => {
        // Count occurrences of the cheating type for the current MAC address
        return filteredGraphData.filter(
          (item) =>
            item.mac_address === mac && item.type_of_cheating === cheatingType
        ).length;
      }),
      backgroundColor: `rgba(${(index * 100) % 255}, ${(index * 150) % 255}, ${
        (index * 200) % 255
      }, 0.6)`, // Dynamic color with transparency
      borderColor: `rgba(${(index * 100) % 255}, ${(index * 150) % 255}, ${
        (index * 200) % 255
      }, 1)`, // Dynamic border color
      borderWidth: 1,
    })),
  };

  const stackedBarChartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Ensures that the chart adjusts to the container's height and width
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Types of Cheating by MAC Addresses',
      },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const mac = macAddresses[ctx.datasetIndex];
            const cheatingType = cheatingTypes[ctx.dataIndex];
            const count = ctx.dataset.data[ctx.dataIndex];
            return `${mac}: ${cheatingType} - ${count} occurrence(s)`;
          },
        },
      },
    },
    scales: {
      x: {
        stacked: true, // Enable stacking for the x-axis
        title: {
          display: true,
          text: 'Types of Cheating',
        },
      },
      y: {
        stacked: true, // Enable stacking for the y-axis
        title: {
          display: true,
          text: 'Count',
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="graph-container">
      {/* Bar Chart Section */}
      <div className="timestamp-filters" style={{ marginTop: '100px' }}>
        <h3 className="h3bar">Stacked Bar Chart Filters</h3>
        <label>
          Start Timestamp:
          <input
            type="datetime-local"
            value={barStartTimestamp}
            onChange={(e) => setBarStartTimestamp(e.target.value)}
          />
        </label>
        <label>
          End Timestamp:
          <input
            type="datetime-local"
            value={barEndTimestamp}
            onChange={(e) => setBarEndTimestamp(e.target.value)}
          />
        </label>
      </div>
      <div className="stackedchart-container">
        {filteredGraphData.length > 0 ? (
          <Bar
            data={stackedBarChartData}
            options={stackedBarChartOptions}
            className="bargraph"
          />
        ) : (
          <p>No data available for the selected time range.</p>
        )}
      </div>
    </div>
  );
};

export default CheatingDevicesGraphs;
