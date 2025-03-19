import React, { useEffect, useState } from 'react';
import { Bar, Scatter, Line, Doughnut, PolarArea } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { useLocation } from 'react-router-dom';
import '../styles/ViewGraphs.css';
import axios from 'axios';

// Register required components in Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ViewGraphs = () => {
  const [processData, setProcessData] = useState([]);
  const [deviceSignalData, setDeviceSignalData] = useState([]); // State for device signal data
  const [systemUsageData, setSystemUsageData] = useState([]);
  const [networkDetailsData, setNetworkDetailsData] = useState([]);
  const [networkRequestsData, setNetworkRequestsData] = useState([]);
  const [browserHistoryData, setBrowserHistoryData] = useState([]);
  const [barStartTimestamp, setBarStartTimestamp] = useState('');
  const [barEndTimestamp, setBarEndTimestamp] = useState('');
  const [scatterStartTimestamp, setScatterStartTimestamp] = useState('');
  const [scatterEndTimestamp, setScatterEndTimestamp] = useState('');
  const location = useLocation();
  const macAddress = location.state?.macAddress; // Get MAC address from state

  const fetchProcessData = async () => {
    try {
      const response = await axios.post(
        'https://electron-eye.onrender.com/api/getTracking',
        {
          macAddress: macAddress,
        }
      );
      setProcessData(response.data);
    } catch (error) {
      console.error('Error fetching process data:', error);
    }
  };

  // Use useEffect to fetch data periodically
  useEffect(() => {
    fetchProcessData(); // Fetch data immediately on component mount
    const interval = setInterval(fetchProcessData, 5000); // Fetch data every 5 seconds
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [macAddress]);

  const fetchDeviceSignalData = async () => {
    try {
      const response = await axios.post(
        'https://electron-eye.onrender.com/api/display-connected-devices',
        { macAddress: macAddress }
      );

      // Extract device name and signal strength and store in state
      const extractedData = response.data.map((item) => ({
        deviceName: item['Device Name'],
        signalStrength: item['Signal Strength'],
        timestamp: item.timestamp,
      }));
      setDeviceSignalData(extractedData);
    } catch (error) {
      console.error('Error fetching device signal data:', error);
    }
  };

  // Use useEffect to fetch data periodically
  useEffect(() => {
    fetchDeviceSignalData(); // Fetch data immediately on component mount
    const interval = setInterval(fetchDeviceSignalData, 5000); // Fetch data every 5 seconds
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [macAddress]);

  const fetchSystemUsageData = async () => {
    try {
      const response = await axios.post(
        'https://electron-eye.onrender.com/api/check-system-health',
        {
          macAddress: macAddress,
        }
      );
      setSystemUsageData(response.data);
    } catch (error) {
      console.error('Error fetching device signal data:', error);
    }
  };

  // Use useEffect to fetch data periodically
  useEffect(() => {
    fetchSystemUsageData(); // Fetch data immediately on component mount
    const interval = setInterval(fetchSystemUsageData, 5000); // Fetch data every 5 seconds
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [macAddress]);

  const fetchNetworkDetailsData = async () => {
    try {
      const response = await axios.post(
        'https://electron-eye.onrender.com/api/display-network-details',
        {
          macAddress: macAddress,
        }
      );
      setNetworkDetailsData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Use useEffect to fetch data periodically
  useEffect(() => {
    fetchNetworkDetailsData(); // Fetch data immediately on component mount
    const interval = setInterval(fetchNetworkDetailsData, 5000); // Fetch data every 5 seconds
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [macAddress]);

  const fetchNetworkRequestsData = async () => {
    try {
      const response = await axios.post(
        'https://electron-eye.onrender.com/api/display-network-requests',
        {
          macAddress: macAddress,
        }
      );
      setNetworkRequestsData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Use useEffect to fetch data periodically
  useEffect(() => {
    fetchNetworkRequestsData(); // Fetch data immediately on component mount
    const interval = setInterval(fetchNetworkRequestsData, 5000); // Fetch data every 5 seconds
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [macAddress]);

  const fetchBrowserHistoryData = async () => {
    try {
      const response = await axios.post(
        'https://electron-eye.onrender.com/api/display-browser-history',
        {
          macAddress: macAddress,
        }
      );
      setBrowserHistoryData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Use useEffect to fetch data periodically
  useEffect(() => {
    fetchBrowserHistoryData(); // Fetch data immediately on component mount
    const interval = setInterval(fetchBrowserHistoryData, 5000); // Fetch data every 5 seconds
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [macAddress]);

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

  // Filter data based on timestamps for scatter chart
  const filterScatterDataByTimestamp = (data) => {
    if (!scatterStartTimestamp || !scatterEndTimestamp) return data;

    const startDate = new Date(scatterStartTimestamp);
    const endDate = new Date(scatterEndTimestamp);

    return data.filter((item) => {
      const itemDate = new Date(item.timestamp);
      return itemDate >= startDate && itemDate <= endDate;
    });
  };

  // Prepare bar chart data
  const filteredProcessData = filterBarDataByTimestamp(processData);

  // Prepare bar chart data
  const barChartData = {
    labels: filteredProcessData.map((item) => item.timestamp),
    datasets: [
      {
        label: 'Duration (in minutes)',
        data: filteredProcessData.map((item) => item.duration_minutes),
        backgroundColor: '#968df0',
      },
    ],
  };

  const barOptions = {
    responsive: true,
    indexAxis: 'y', // Makes the chart horizontal
    scales: {
      y: {
        type: 'category',
        labels: filteredProcessData.map((item) => item.name),
        title: {
          display: true,
          text: 'Process Name',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Duration (in minutes)',
        },
      },
    },
    plugins: {
      legend: {
        display: true,
      },
      title: {
        display: true,
        text: 'Process Duration by Name',
      },
    },
  };

  // Prepare scatter plot data
  const filteredDeviceSignalData =
    filterScatterDataByTimestamp(deviceSignalData);

  const scatterData = {
    datasets: [
      {
        label: 'Signal Strength',
        data: filteredDeviceSignalData.map((item) => ({
          x: item.deviceName,
          y: item.signalStrength,
        })),
        backgroundColor: '#968df0',
      },
    ],
  };

  const scatterOptions = {
    responsive: true,
    scales: {
      x: {
        type: 'category',
        labels: filteredDeviceSignalData.map((item) => item.deviceName),
        title: {
          display: true,
          text: 'Device Name',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Signal Strength (in dBm)',
        },
      },
    },
    plugins: {
      legend: {
        display: true,
      },
      title: {
        display: true,
        text: 'Device Signal Strength Distribution',
      },
    },
  };

  // Prepare line chart data
  const lineChartData = {
    labels: systemUsageData.map((item) => item.timestamp), // Use timestamp for x-axis
    datasets: [
      {
        label: 'CPU Usage (in %)',
        data: systemUsageData.map((item) => item.cpu_usage), // CPU usage for the first line
        borderColor: '#968df0', // Color for the first line (CPU Usage) #42a5f5
        fill: false, // Line won't be filled
      },
      // {
      //   label: 'Memory Used (GB)',
      //   data: systemUsageData.map((item) => item.memory_used), // Memory used for the second line
      //   borderColor: '#ff7043', // Color for the second line (Memory Used)
      //   fill: false, // Line won't be filled
      // },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Timestamp',
        },
      },
      y: {
        title: {
          display: true,
          text: 'CPU Usage (in %)',
        },
      },
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'CPU Usage Over Time',
      },
    },
  };

  // Get unique netmasks and count their occurrences
  const netmaskCounts = networkDetailsData.reduce((acc, item) => {
    acc[item.netmask] = (acc[item.netmask] || 0) + 1;
    return acc;
  }, {});

  const netmaskLabels = Object.keys(netmaskCounts);
  const netmaskData = Object.values(netmaskCounts);

  const doughnutChartData = {
    labels: netmaskLabels, // Display netmasks as labels
    datasets: [
      {
        label: 'Netmask Distribution',
        data: netmaskData, // Number of interfaces using each netmask
        backgroundColor: [
          'rgba(150, 141, 240, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 99, 132, 0.6)',
        ],
        borderColor: [
          'rgba(150, 141, 240, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const doughnutChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Netmask Distribution Across Interfaces',
      },
    },
  };

  // Process the data to be used in the chart
  const processedData = {};
  networkRequestsData.forEach((item) => {
    const timestamp = item.timestamp.split(' ')[0]; // Extract date from timestamp

    if (!processedData[timestamp]) {
      processedData[timestamp] = 1;
    } else {
      processedData[timestamp]++;
    }
  });

  // Prepare the labels (timestamps) and data (communication counts)
  const labels = networkRequestsData.map((item) => item.timestamp); // Full timestamp
  const dataValues = networkRequestsData.map((_, index) => index + 1); // Communication count (simple increasing sequence)

  // Chart data and configuration
  const data = {
    labels: labels,
    datasets: [
      {
        label: 'IP Communications Over Time',
        data: dataValues,
        backgroundColor: 'rgba(150, 141, 240, 0.2)', // Transparent fill
        borderColor: 'rgba(150, 141, 240, 1)', // Line color
        borderWidth: 2,
        fill: true, // This enables the area fill under the line
        tension: 0.4, // Line smoothing
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
        text: 'IP Communication Volume Over Time',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Timestamp',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Number of Communications',
        },
        beginAtZero: true,
      },
    },
  };

  // Count the number of visits for each unique URL
  const urlVisitCounts = browserHistoryData.reduce((acc, item) => {
    acc[item.url] = (acc[item.url] || 0) + 1;
    return acc;
  }, {});

  const browserlabels = Object.keys(urlVisitCounts);
  const browserdataValues = Object.values(urlVisitCounts);

  const chartData = {
    browserlabels,
    datasets: [
      {
        label: 'Number of Visits',
        data: browserdataValues,
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top', // Display legend at the top
      },
      title: {
        display: true,
        text: 'Browser History - URL Visits',
        font: {
          size: 20,
        },
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  return (
    <div className="graph-container">
      <div className="timestamp-filters">
        <h3 className="h3bar">Bar Chart Filters</h3>
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
      <div style={{ marginTop: '100px' }} className="chart-container">
        {filteredProcessData.length > 0 ? (
          <Bar data={barChartData} options={barOptions} className="bargraph" />
        ) : (
          <p>No data available for the selected time range.</p>
        )}
      </div>
      {/* Scatter Chart Timestamp Filters */}
      <div className="timestamp-filtersscatter">
        <h3 className="h3bar">Scatter Chart Filters</h3>
        <label>
          Start Timestamp:
          <input
            type="datetime-local"
            value={scatterStartTimestamp}
            onChange={(e) => setScatterStartTimestamp(e.target.value)}
          />
        </label>
        <label>
          End Timestamp:
          <input
            type="datetime-local"
            value={scatterEndTimestamp}
            onChange={(e) => setScatterEndTimestamp(e.target.value)}
          />
        </label>
      </div>
      <div className="chart-container">
        {filteredDeviceSignalData.length > 0 ? (
          <Scatter
            data={scatterData}
            options={scatterOptions}
            className="scatterplot"
          />
        ) : (
          <p>No data available for the selected time range.</p>
        )}
      </div>
      <div className="chart-container">
        {systemUsageData.length > 0 ? (
          <Line data={lineChartData} options={lineChartOptions} />
        ) : (
          <p>Loading data...</p>
        )}
      </div>
      {/* <div className="chart-container">
        {networkRequestsData.length > 0 ? (
          <Line data={data} options={options} />
        ) : (
          <p>Loading data...</p>
        )}
      </div> */}
      {/* <div className="chart-containerbrowser">
        {browserHistoryData.length > 0 ? (
          <PolarArea data={chartData} options={chartOptions} />
        ) : (
          <p>Loading data...</p>
        )}
      </div> */}
      <div style={{ marginBottom: '100px' }} className="chart-container">
        {networkDetailsData.length > 0 ? (
          <Doughnut data={doughnutChartData} options={doughnutChartOptions} />
        ) : (
          <p>Loading data...</p>
        )}
      </div>
    </div>
  );
};

export default ViewGraphs;
