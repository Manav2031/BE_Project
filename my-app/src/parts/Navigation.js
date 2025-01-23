import React from 'react';
import styled from 'styled-components';
import Logo from '../parts/Logo';
import { Link } from 'react-router-dom';

const Section = styled.section`
  width: 100%;
  background-color: ${(props) => props.theme.body};
`;

const NavBar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #968df0;
  width: 75%;
  height:10%;
  padding: 0 12.5%;
  margin: 0 auto;
`;

const Menu = styled.ul`
  display: flex;
  justify-content: space-between;
  align-items: center;
  list-style: none;
`;

const MenuItem = styled.li`
  margin: 0 1rem;
  color: ${(props) => props.theme.text};
  cursor: pointer;
  font-size: 1.2rem;
  font-weight: bold;
  padding: 0.8rem 1.5rem;
`;

const Navigation = () => {
  return (
    <Section id="navigation">
      <NavBar>
        <Logo />
        <Menu>
          <Link to="/">
            <MenuItem>Home</MenuItem>
          </Link>
          <Link to="/documentation">
            <MenuItem>Documentation</MenuItem>
          </Link>
          <Link to="/team">
            <MenuItem>Team</MenuItem>
          </Link>
        </Menu>
      </NavBar>
    </Section>
  );
};

export default Navigation;
