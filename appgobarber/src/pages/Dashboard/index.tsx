import React from 'react';

import { Container, Button } from './styles';

import { useAuth } from '../../hooks/Auth';

const Dashboard: React.FC = () => {
  const { signOut } = useAuth();
  return (
    <Container>
      <Button title="sair" onPress={signOut} />
    </Container>
  );
};

export default Dashboard;
