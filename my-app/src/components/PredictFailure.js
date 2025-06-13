import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const AlertBox = styled.div`
  margin-top: 20px;
  padding: 15px;
  border-radius: 8px;
  background-color: #ffe5e5;
  color: #cc0000;
  max-width: 400px;
`;

const TableHeading = styled.h2`
  margin-top: 100px;
  padding: 10px 0;
  color: #333;
  text-align: center;
  width: 100%;
  border-bottom: 2px solid #007bff;
`;

const Progress = styled.div`
  width: 100%;
  background: #ddd;
  height: 20px;
  border-radius: 10px;
  overflow: hidden;
`;

const ProgressBar = ({ value }) => (
  <Progress>
    <div
      style={{
        width: `${value}%`,
        backgroundColor: value > 75 ? '#ff4d4f' : '#52c41a',
        height: '100%',
      }}
    />
  </Progress>
);

const PredictFailure = () => {
  const location = useLocation();
  const mac_address = location.state?.macAddress;

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPrediction = async () => {
      setLoading(true);
      console.log(mac_address);
      try {
        const response = await axios.get(
          `https://electron-eye.onrender.com/api/predict-failure/${mac_address}`
        );
        setPrediction(response.data);
      } catch (err) {
        console.log(err);
        setError('Failed to fetch prediction.');
      } finally {
        setLoading(false);
      }
    };
    fetchPrediction();
  }, [mac_address]);

  return (
    <Container>
      <TableHeading>Predict System Failure</TableHeading>

      {loading && <p>Loading prediction...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {prediction && (
        <AlertBox>
          <h3>CPU Usage Prediction</h3>
          <ProgressBar value={prediction.predicted_cpu_usage} />
          <p>
            <strong>Predicted CPU Usage:</strong>{' '}
            {prediction.predicted_cpu_usage.toFixed(2)}%
          </p>
          <p>{prediction.alert}</p>
        </AlertBox>
      )}
    </Container>
  );
};

export default PredictFailure;
