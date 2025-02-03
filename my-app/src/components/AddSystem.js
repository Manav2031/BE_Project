import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

const Section = styled.section`
  min-height: ${(props) => `calc(100vh - ${props.theme.navHeight || '10vh'})`};
  width: 100vw;
  background-color: ${(props) => props.theme.body || '#f4f4f4'};
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
  padding: 2rem 0;
`;

const FormContainer = styled.div`
  width: 50%;
  margin-bottom: 2rem;
  padding: 2rem;
  border-radius: 8px;
  background-color: ${(props) => props.theme.primary || '#007BFF'};
  color: ${(props) => props.theme.body || '#fff'};
`;

const ListContainer = styled.div`
  width: 50%;
  margin-top: 2rem;
  padding: 2rem;
  border-radius: 8px;
  background-color: ${(props) => props.theme.secondary || '#0056b3'};
  color: ${(props) => props.theme.text || '#fff'};
`;

const Input = styled.input`
  width: 80%;
  padding: 0.8rem;
  margin-bottom: 1rem;
  font-size: 1rem;
  border: 1px solid ${(props) => props.theme.border || '#ccc'};
  border-radius: 5px;
`;

const Button = styled.button`
  padding: 0.8rem 1.5rem;
  font-size: 1.2rem;
  color: ${(props) => props.theme.body || '#fff'};
  background-color: ${(props) => props.theme.primary || '#007BFF'};
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    background-color: ${(props) => props.theme.secondary || '#0056b3'};
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
`;

const Th = styled.th`
  border: 1px solid ${(props) => props.theme.border || '#ccc'};
  padding: 1rem;
  background-color: ${(props) => props.theme.body || '#333'};
  color: ${(props) => props.theme.text || '#fff'};
`;

const Td = styled.td`
  border: 1px solid ${(props) => props.theme.border || '#ccc'};
  padding: 1rem;
  text-align: center;
  cursor: pointer;
  &:hover {
    background-color: ${(props) => props.theme.hover || '#ddd'};
  }
`;

function AddSystem() {
  const [macAddress, setMacAddress] = useState('');
  const [machineName, setMachineName] = useState('');
  const [macList, setMacList] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = location.state || {};

  const fetchMacAddresses = useCallback(async () => {
    if (!userId) return; // Ensure userId exists
    try {
      const response = await axios.get(
        `http://localhost:8000/api/getAllMacAddresses?userId=${userId}`
      );
      setMacList(response.data);
    } catch (error) {
      console.error('Error fetching MAC addresses:', error);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchMacAddresses();
    } else {
      // Redirect to login if no userId is found
      navigate('/');
    }
  }, [userId, fetchMacAddresses, navigate]);

  const handleAddMac = async () => {
    if (!macAddress || !machineName) {
      alert('Please enter both MAC Address and Machine Name');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:8000/api/addMacAddress',
        {
          macAddress,
          systemName: machineName,
          userId, // Use the userId here
        }
      );
      setMacList([...macList, response.data.data]);
      setMacAddress('');
      setMachineName('');
    } catch (error) {
      console.error('Error adding MAC address:', error);
      alert('Failed to add MAC address. Please try again.');
    }
  };

  const handleNavigate = (entry) => {
    navigate('/functionality', { state: { macAddress: entry.macAddress } });
  };

  return (
    <Section>
      <FormContainer>
        <h2>Add MAC Address</h2>
        <Input
          type="text"
          placeholder="Enter MAC Address"
          value={macAddress}
          onChange={(e) => setMacAddress(e.target.value)}
        />
        <Input
          type="text"
          placeholder="Enter Machine Name"
          value={machineName}
          onChange={(e) => setMachineName(e.target.value)}
        />
        <Button onClick={handleAddMac}>Add</Button>
      </FormContainer>

      <ListContainer>
        <h2>MAC Address List</h2>
        {macList.length === 0 ? (
          <p>No MAC addresses added yet.</p>
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>MAC Address</Th>
                <Th>Machine Name</Th>
              </tr>
            </thead>
            <tbody>
              {macList.map((entry) => (
                <tr key={entry._id}>
                  <Td onClick={() => handleNavigate(entry)}>
                    {entry.macAddress}
                  </Td>
                  <Td onClick={() => handleNavigate(entry)}>
                    {entry.systemName}
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </ListContainer>
    </Section>
  );
}

export default AddSystem;
