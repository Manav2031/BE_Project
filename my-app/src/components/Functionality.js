import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Section = styled.section`
  min-height: ${(props) => `calc(100vh - ${props.theme.navHeight})`};
  width: 100vw;
  position: relative;
  background-color: ${(props) => props.theme.body};
`;

const Container = styled.div`
  width: 75%;
  min-height: 85vh;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Box = styled.div`
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ButtonContainer = styled.div`
  width: 80%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
`;

const Button = styled.button`
  padding: 0.8rem 1.5rem;
  font-size: 1.2rem;
  color: ${(props) => props.theme.text};
  background-color: ${(props) => props.theme.primary};
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    background-color: ${(props) => props.theme.secondary};
    color: ${(props) => props.theme.body};
  }
`;

function Functionality() {
  return (
    <div>
      <Section id="Functionality">
        <Container>
          <Box>
            <ButtonContainer>
              <Link to="/check-system-health">
                <Button>CHECK System Health</Button>
              </Link>
              <Link to="/view-graph">
                <Button>Graphs</Button>
              </Link>
              <Link to="/view-logs">
                <Button>View Logs</Button>
              </Link>
            </ButtonContainer>
          </Box>
        </Container>
      </Section>
    </div>
  );
}

export default Functionality;
