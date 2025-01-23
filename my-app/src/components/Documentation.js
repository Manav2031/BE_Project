import React from "react";
import styled from "styled-components";

const PageContainer = styled.div`
  font-family: Arial, sans-serif;
  padding: 20px;
  line-height: 1.6;
  background-color: #f4f4f9;
  color: #333;
`;

const Header = styled.header`
  text-align: center;
  background-color: #968df0;
  color: black;
  padding: 20px;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
`;

const SubTitle = styled.h2`
  font-size: 2rem;
  color: #34495e;
  margin-bottom: 10px;
`;

const Section = styled.section`
  margin-bottom: 40px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
`;

const Block = styled.div`
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
`;

const Paragraph = styled.p`
  margin-bottom: 15px;
`;

const List = styled.ul`
  list-style: disc;
  margin-left: 20px;
`;

const ListItem = styled.li`
  margin-bottom: 10px;
`;


const DocumentationPage = () => {
  return (
    <PageContainer>
      <Header>
        <Title>Electron Eye</Title>
        <Paragraph>
          Comprehensive Laboratory Management Solution
        </Paragraph>
      </Header>

      <Section>
        <Block>
          <SubTitle>Overview</SubTitle>
          <Paragraph>
            Electron Eye is an advanced full-stack desktop application designed
            to revolutionize laboratory administration. By monitoring and
            analyzing computer system usage and health, the application empowers
            laboratory administrators with critical insights to enhance
            productivity and optimize resource allocation.
          </Paragraph>
        </Block>
      </Section>

      <Section>
        <Block>
          <SubTitle>Key Features</SubTitle>
          <List>
            <ListItem>
              <strong>Centralized Data Management:</strong> Consolidates system
              usage and health data on a main server, providing administrators
              with real-time access to system activity and performance metrics.
            </ListItem>
            <ListItem>
              <strong>Predictive Maintenance:</strong> Utilizes machine learning
              models like <em>Linear Regression</em> and <em>Random Forest
              Regressor</em> to predict potential system failures or maintenance
              needs based on historical usage and health indicators.
            </ListItem>
            <ListItem>
              <strong>Advanced Visualization:</strong> Integrates <em>Power
              BI</em> for detailed reports and analytics, offering interactive
              dashboards to identify trends and assess system performance.
            </ListItem>
            <ListItem>
              <strong>User-Friendly Interface:</strong> Designed with
              multitasking in mind, simplifying navigation and enhancing overall
              usability.
            </ListItem>
          </List>
        </Block>
      </Section>

      <Section>
        <Block>
          <SubTitle>Benefits</SubTitle>
          <List>
            <ListItem>
              <strong>Improved Resource Management:</strong> Enables
              administrators to monitor and optimize resource utilization
              effectively.
            </ListItem>
            <ListItem>
              <strong>Enhanced Decision-Making:</strong> Provides actionable
              insights through detailed analytics and reporting.
            </ListItem>
            <ListItem>
              <strong>Proactive Maintenance:</strong> Reduces downtime and
              increases system longevity by forecasting issues before they
              occur.
            </ListItem>
            <ListItem>
              <strong>Efficiency Boost:</strong> Streamlines laboratory
              operations, allowing for better focus on core activities.
            </ListItem>
          </List>
        </Block>
      </Section>

      <Section>
        <Block>
          <SubTitle>Technical Highlights</SubTitle>
          <List>
            <ListItem>
              <strong>Backend:</strong> Centralized server to handle and process
              system data efficiently.
            </ListItem>
            <ListItem>
              <strong>Machine Learning Models:</strong>
              <ul>
                <li><em>Linear Regression:</em> Predicts system usage trends.</li>
                <li><em>Random Forest Regressor:</em> Offers robust predictions
                for system health and potential failures.</li>
              </ul>
            </ListItem>
            <ListItem>
              <strong>Visualization Tools:</strong> Interactive dashboards
              powered by <em>Power BI</em> for in-depth analysis.
            </ListItem>
          </List>
        </Block>
      </Section>

      <Section>
        <Block>
          <SubTitle>Use Cases</SubTitle>
          <List>
            <ListItem>
              <strong>Laboratory Monitoring:</strong> Track and analyze
              individual workstation usage, and identify underutilized or
              overburdened systems.
            </ListItem>
            <ListItem>
              <strong>Predictive Analytics:</strong> Anticipate hardware issues
              and schedule maintenance to prevent unexpected downtimes.
            </ListItem>
            <ListItem>
              <strong>Resource Allocation:</strong> Allocate resources more
              effectively based on detailed usage patterns and trends.
            </ListItem>
          </List>
        </Block>
      </Section>
    </PageContainer>
  );
};

export default DocumentationPage;
