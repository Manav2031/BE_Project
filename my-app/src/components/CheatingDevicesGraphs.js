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

  // Prepare stacked bar chart data
  const macAddresses = [...new Set(graphData.map((item) => item.mac_address))];
  const cheatingTypes = [
    ...new Set(graphData.map((item) => item.type_of_cheating)),
  ];

  // Count occurrences of each cheating type per MAC address
  const stackedBarChartData = {
    labels: cheatingTypes, // Cheating types for the x-axis
    datasets: macAddresses.map((mac, index) => ({
      label: mac, // Label each MAC address
      data: cheatingTypes.map((cheatingType) => {
        // Count occurrences of the cheating type for the current MAC address
        return graphData.filter(
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
    <div style={styles.centerContainer}>
      {graphData.length > 0 ? (
        <div style={styles.chartContainer}>
          <Bar data={stackedBarChartData} options={stackedBarChartOptions} />
        </div>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

// CSS styles for centering and ensuring visibility
const styles = {
  centerContainer: {
    display: 'flex',
    justifyContent: 'center', // Centers horizontally
    alignItems: 'center', // Centers vertically
    height: '100vh', // Takes full viewport height
    margin: 0, // Removes any default margins
  },
  chartContainer: {
    width: '80%', // Adjust width as needed
    height: '70%', // Adjust height as needed
    maxWidth: '1000px', // Limits the chart's max width
    maxHeight: '600px', // Limits the chart's max height
  },
};

export default CheatingDevicesGraphs;
