import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  height: 100vh;
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
`;

const TableContainer = styled.div`
  width: 100%;
  height: 100vh;
  padding: 20px;
  background-color: #fff;
  margin-top: 190px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  border: 1px solid #ddd;
  padding: 12px;
  background-color: #007bff;
  color: #fff;
  text-align: left;
`;

const Td = styled.td`
  border: 1px solid #ddd;
  padding: 12px;
`;

const NoData = styled.div`
  margin-top: 10px;
  color: #555;
  text-align: center;
`;

const CheatingDevices = () => {
  const [trackStatus, setTrackStatus] = useState([]);

  // Function to filter unique types of cheating
  const filterUniqueCheatingTypes = (data) => {
    const uniqueTypesMap = new Map();

    data.forEach((item) => {
      if (!uniqueTypesMap.has(item.type_of_cheating)) {
        uniqueTypesMap.set(item.type_of_cheating, item);
      }
    });

    return Array.from(uniqueTypesMap.values());
  };

  // Function to fetch tracking data
  const fetchTrackingData = async () => {
    try {
      const response = await axios.get(
        'https://electron-eye.onrender.com/api/display-cheating-devices'
      );
      // Filter data to display unique types of cheating
      const uniqueCheatingTypes = filterUniqueCheatingTypes(response.data);
      setTrackStatus(uniqueCheatingTypes);
    } catch (error) {
      console.error('Error fetching tracking data:', error);
    }
  };

  // Use useEffect to fetch data periodically
  useEffect(() => {
    fetchTrackingData(); // Fetch data immediately on component mount
    const interval = setInterval(fetchTrackingData, 5000); // Fetch data every 5 seconds
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return (
    <Container>
      <TableContainer>
        <>
          {Array.isArray(trackStatus) && trackStatus.length > 0 ? (
            <Table>
              <thead>
                <tr>
                  <Th>Timestamp</Th>
                  <Th>MAC Address</Th>
                  <Th>Type of Cheating</Th>
                </tr>
              </thead>
              <tbody>
                {trackStatus.map((item, index) => (
                  <tr key={index}>
                    <Td>{item.timestamp}</Td>
                    <Td>{item.mac_address}</Td>
                    <Td>{item.type_of_cheating}</Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <NoData>No tracking data available.</NoData>
          )}
        </>
      </TableContainer>
    </Container>
  );
};

export default CheatingDevices;
