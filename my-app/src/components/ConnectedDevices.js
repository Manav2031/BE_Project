import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import alertSound from '../sounds/alert.mp3'; // Add an alert sound file

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f5f5f5;
  padding: 20px;
`;

const TableContainer = styled.div`
  width: 100%;
  padding: 20px;
  background-color: #fff;
  margin-top: 20px;
  margin-bottom: 60px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  table-layout: fixed;
`;

const Th = styled.th`
  border: 1px solid #ddd;
  padding: 12px;
  background-color: #007bff;
  color: #fff;
  text-align: left;
  position: sticky;
  top: 0;
`;

const Td = styled.td`
  border: 1px solid #ddd;
  padding: 12px;
  word-wrap: break-word;
`;

const NoData = styled.div`
  margin-top: 10px;
  color: #555;
  text-align: center;
  padding: 20px;
`;

const FilterContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 80px;
  margin-bottom: 20px;
  margin-left: 30px;
  align-items: center;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const FilterLabel = styled.label`
  font-weight: 600;
  color: #333;
`;

const DateInput = styled.input`
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 200px;
`;

const ActionButton = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  align-self: flex-end;
  margin-left: auto;
`;

const ResetButton = styled(ActionButton)`
  background-color: #968df0;
  color: white;
  &:hover {
    background-color: rgb(123, 35, 200);
  }
`;

const DeleteButton = styled(ActionButton)`
  background-color: #968df0;
  color: white;

  &:hover {
    background-color: rgb(123, 35, 200);
  }
`;

const ConnectedDevices = () => {
  const [devices, setDevices] = useState([]);
  const [penDriveDetected, setPenDriveDetected] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [startTimestamp, setStartTimestamp] = useState('');
  const [endTimestamp, setEndTimestamp] = useState('');
  const [deleteStartTimestamp, setDeleteStartTimestamp] = useState('');
  const [deleteEndTimestamp, setDeleteEndTimestamp] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const location = useLocation();
  const macAddress = location.state?.macAddress; // Get MAC address from state

  // Create an Audio object
  const audio = new Audio(alertSound);

  // Function to fetch connected devices
  const fetchConnectedDevices = async () => {
    try {
      const response = await axios.post(
        'https://electron-eye.onrender.com/api/display-connected-devices',
        { macAddress: macAddress }
      );
      setDevices(response.data);
      setFilteredData(response.data);

      let isPenDriveDetected = false;
      response.data.forEach((device) => {
        if (device['Device Type'] === 'Pen drive') {
          isPenDriveDetected = true;
          if (!penDriveDetected) {
            audio.play();
            toast.error(`Pen drive detected on ${macAddress}`, {
              position: 'top-center',
              autoClose: 10000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
            // Send request to shutdown system
            // axios.post('https://electron-eye.onrender.com/api/shutdown-system');
          }
        }
      });

      if (!isPenDriveDetected && penDriveDetected) {
        audio.pause();
        audio.currentTime = 0;
        toast.info(`Pen drive removed from ${macAddress}`, {
          position: 'top-center',
          autoClose: 10000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }

      setPenDriveDetected(isPenDriveDetected); // Update the state based on detection
    } catch (error) {
      console.error(
        'Error fetching connected devices:',
        error.response ? error.response.data : error.message
      );
    }
  };

  // Filter data based on timestamps
  const filterDataByTimestamp = (data) => {
    if (!startTimestamp || !endTimestamp) return data;

    const startDate = new Date(startTimestamp);
    const endDate = new Date(endTimestamp);

    return data.filter((item) => {
      const itemDate = new Date(item.timestamp);
      return itemDate >= startDate && itemDate <= endDate;
    });
  };

  // Apply filters whenever dates or original data changes
  useEffect(() => {
    const filtered = filterDataByTimestamp(devices);
    setFilteredData(filtered);
  }, [startTimestamp, endTimestamp, devices]);

  // Use useEffect to fetch data periodically
  useEffect(() => {
    fetchConnectedDevices(); // Fetch data immediately on component mount
    const interval = setInterval(fetchConnectedDevices, 5000); // Fetch data every 5 seconds
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [macAddress, penDriveDetected]); // Track penDriveDetected state

  // Reset filters
  const resetFilters = () => {
    setStartTimestamp('');
    setEndTimestamp('');
    setFilteredData(devices);
  };

  // Delete logs within a specific time range
  const deleteLogsByTimestamp = async () => {
    if (!deleteStartTimestamp || !deleteEndTimestamp) {
      alert('Please select both start and end timestamps for deletion');
      return;
    }

    if (
      window.confirm(
        'Are you sure you want to delete logs in this time range? This action cannot be undone.'
      )
    ) {
      setIsDeleting(true);
      try {
        await axios.post(
          'https://electron-eye.onrender.com/api/deleteConnectedDevices',
          {
            macAddress: macAddress,
            startTimestamp: deleteStartTimestamp,
            endTimestamp: deleteEndTimestamp,
          }
        );
        alert('Logs deleted successfully');
        fetchConnectedDevices(); // Refresh the data
      } catch (error) {
        console.error('Error deleting logs:', error);
        alert('Failed to delete logs');
      } finally {
        setIsDeleting(false);
        setDeleteStartTimestamp('');
        setDeleteEndTimestamp('');
      }
    }
  };

  return (
    <Container>
      <FilterContainer>
        <FilterGroup>
          <FilterLabel>Start Timestamp</FilterLabel>
          <DateInput
            type="datetime-local"
            value={startTimestamp}
            onChange={(e) => setStartTimestamp(e.target.value)}
          />
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>End Timestamp</FilterLabel>
          <DateInput
            type="datetime-local"
            value={endTimestamp}
            onChange={(e) => setEndTimestamp(e.target.value)}
            min={startTimestamp}
          />
        </FilterGroup>

        <ResetButton onClick={resetFilters}>Reset Filters</ResetButton>

        <FilterGroup>
          <FilterLabel>Delete From</FilterLabel>
          <DateInput
            type="datetime-local"
            value={deleteStartTimestamp}
            onChange={(e) => setDeleteStartTimestamp(e.target.value)}
          />
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>Delete To</FilterLabel>
          <DateInput
            type="datetime-local"
            value={deleteEndTimestamp}
            onChange={(e) => setDeleteEndTimestamp(e.target.value)}
            min={deleteStartTimestamp}
          />
        </FilterGroup>

        <DeleteButton onClick={deleteLogsByTimestamp} disabled={isDeleting}>
          {isDeleting ? 'Deleting...' : 'Delete Logs'}
        </DeleteButton>
      </FilterContainer>

      <TableContainer>
        {Array.isArray(filteredData) && filteredData.length > 0 ? (
          <Table>
            <thead>
              <tr>
                <Th>Timestamp</Th>
                <Th>Device Type</Th>
                <Th>Device Name</Th>
                <Th>MAC Address</Th>
                <Th>Signal Strength</Th>
                <Th>Mount Point</Th>
                <Th>File System Type</Th>
                <Th>Total Size (in GB)</Th>
                <Th>Used Size (in GB)</Th>
                <Th>Free Size (in GB)</Th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr key={index}>
                  <Td>{item.timestamp}</Td>
                  <Td>{item['Device Type']}</Td>
                  <Td>{item['Device Name']}</Td>
                  <Td>{item['MAC Address']}</Td>
                  <Td>{item['Signal Strength']}</Td>
                  <Td>{item['Mount Point']}</Td>
                  <Td>{item['File System Type']}</Td>
                  <Td>{item['Total Size (GB)']}</Td>
                  <Td>{item['Used Size (GB)']}</Td>
                  <Td>{item['Free Size (GB)']}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <NoData>
            {Array.isArray(devices) && devices.length > 0
              ? 'No data matches your filters.'
              : 'No tracking data available.'}
          </NoData>
        )}
      </TableContainer>
    </Container>
  );
};

export default ConnectedDevices;
