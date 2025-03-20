import React, { useEffect, useState } from 'react';
import { HeatMap } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';

// Register required components in Chart.js
ChartJS.register(LinearScale, CategoryScale, PointElement, Tooltip, Legend);

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

  // Prepare heatmap data
  const macAddresses = [...new Set(graphData.map((item) => item.mac_address))];
  const cheatingTypes = [
    ...new Set(graphData.map((item) => item.type_of_cheating)),
  ];

  // Create a matrix for heatmap data
  const heatmapData = macAddresses.map((mac) => {
    return cheatingTypes.map((cheatingType) => {
      return graphData.filter(
        (item) =>
          item.mac_address === mac && item.type_of_cheating === cheatingType
      ).length;
    });
  });

  const heatmapChartData = {
    labels: cheatingTypes, // Cheating types for the x-axis
    datasets: macAddresses.map((mac, index) => ({
      label: mac, // Label each MAC address
      data: heatmapData[index], // Data for the current MAC address
      backgroundColor: (ctx) => {
        const value = ctx.dataset.data[ctx.dataIndex];
        const opacity =
          value > 0 ? 0.5 + (value / Math.max(...heatmapData.flat())) * 0.5 : 0; // Dynamic opacity based on value
        return `rgba(${(index * 100) % 255}, ${(index * 150) % 255}, ${
          (index * 200) % 255
        }, ${opacity})`;
      },
      borderColor: `rgba(${(index * 100) % 255}, ${(index * 150) % 255}, ${
        (index * 200) % 255
      }, 1)`,
      borderWidth: 1,
    })),
  };

  const heatmapChartOptions = {
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
        title: {
          display: true,
          text: 'Types of Cheating',
        },
      },
      y: {
        title: {
          display: true,
          text: 'MAC Addresses',
        },
      },
    },
  };

  return (
    <div style={styles.centerContainer}>
      {graphData.length > 0 ? (
        <div style={styles.chartContainer}>
          <HeatMap data={heatmapChartData} options={heatmapChartOptions} />
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

// import React, { useEffect, useState } from 'react';
// import { Radar } from 'react-chartjs-2';
// import axios from 'axios';
// import {
//   Chart as ChartJS,
//   RadialLinearScale,
//   PointElement,
//   LineElement,
//   Filler,
//   Tooltip,
//   Legend,
// } from 'chart.js';

// // Register required components in Chart.js
// ChartJS.register(
//   RadialLinearScale,
//   PointElement,
//   LineElement,
//   Filler,
//   Tooltip,
//   Legend
// );

// const CheatingDevicesGraphs = () => {
//   const [graphData, setGraphData] = useState([]);
//   const fetchData = async () => {
//     try {
//       const response = await axios.get(
//         'https://electron-eye.onrender.com/api/display-cheating-devices'
//       );
//       setGraphData(response.data);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };

//   // Use useEffect to fetch data periodically
//   useEffect(() => {
//     fetchData(); // Fetch data immediately on component mount
//     const interval = setInterval(fetchData, 5000); // Fetch data every 5 seconds
//     return () => clearInterval(interval); // Cleanup interval on component unmount
//   }, []);

//   // Prepare radar chart data
//   const macAddresses = [...new Set(graphData.map((item) => item.mac_address))];
//   const cheatingTypes = [
//     ...new Set(graphData.map((item) => item.type_of_cheating)),
//   ];

//   // Count unique cheating types per MAC address
//   const radarChartData = {
//     labels: cheatingTypes, // Cheating types for the radar chart axes
//     datasets: macAddresses.map((mac, index) => ({
//       label: mac, // Label each MAC address
//       data: cheatingTypes.map((cheatingType) => {
//         // For each MAC address, filter out unique cheating types
//         const uniqueCheatingTypes = new Set(
//           graphData
//             .filter((item) => item.mac_address === mac)
//             .map((item) => item.type_of_cheating)
//         );
//         // Check if the current cheating type exists in the unique set
//         return uniqueCheatingTypes.has(cheatingType) ? 1 : 0;
//       }),
//       backgroundColor: `rgba(${(index * 100) % 255}, ${(index * 150) % 255}, ${
//         (index * 200) % 255
//       }, 0.4)`, // Dynamic color with transparency
//       borderColor: `rgba(${(index * 100) % 255}, ${(index * 150) % 255}, ${
//         (index * 200) % 255
//       }, 1)`, // Dynamic border color
//       borderWidth: 2,
//     })),
//   };

//   const radarChartOptions = {
//     responsive: true,
//     maintainAspectRatio: false, // Ensures that the chart adjusts to the container's height and width
//     plugins: {
//       legend: {
//         position: 'top',
//       },
//       title: {
//         display: true,
//         text: 'Types of Cheating by MAC Addresses',
//       },
//     },
//     scales: {
//       r: {
//         angleLines: {
//           display: true,
//         },
//         suggestedMin: 0,
//         suggestedMax: 1,
//         ticks: {
//           stepSize: 1,
//         },
//         pointLabels: {
//           font: {
//             size: 14,
//           },
//         },
//       },
//     },
//   };

//   return (
//     <div style={styles.centerContainer}>
//       {graphData.length > 0 ? (
//         <div style={styles.chartContainer}>
//           <Radar data={radarChartData} options={radarChartOptions} />
//         </div>
//       ) : (
//         <p>Loading data...</p>
//       )}
//     </div>
//   );
// };

// // CSS styles for centering and ensuring visibility
// const styles = {
//   centerContainer: {
//     display: 'flex',
//     justifyContent: 'center', // Centers horizontally
//     alignItems: 'center', // Centers vertically
//     height: '100vh', // Takes full viewport height
//     margin: 0, // Removes any default margins
//   },
//   chartContainer: {
//     width: '80%', // Adjust width as needed
//     height: '70%', // Adjust height as needed
//     maxWidth: '1000px', // Limits the chart's max width
//     maxHeight: '600px', // Limits the chart's max height
//   },
// };

// export default CheatingDevicesGraphs;
