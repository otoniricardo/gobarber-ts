import React from 'react';
import { useTransition } from 'react-spring';

import { ToastMessage } from '../../hooks/Toast';

import { Container } from './styles';
import Toast from './Toast';

interface TosastContainerProps {
  messages: ToastMessage[];
}

const ToastContainer: React.FC<TosastContainerProps> = ({ messages }) => {
  const messagesWithTransitions = useTransition(
    messages,
    message => message.id,
    {
      from: { right: '-120%', opacity: 0 },
      enter: { right: '0%', opacity: 1 },
      leave: { right: '-120%', opacity: 0 },
    },
  );
  return (
    <Container>
      {messagesWithTransitions.map(({ item, key, props }) => (
        <Toast key={key} style={props} toast={item} />
      ))}
    </Container>
  );
};

export default ToastContainer;
