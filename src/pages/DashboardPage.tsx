import React from 'react';
import Layout from '../components/Layout';
import DashboardOverview from '../components/DashboardOverview';

const DashboardPage: React.FC = () => {
  return (
    <Layout>
      <DashboardOverview />
    </Layout>
  );
};

export default DashboardPage;