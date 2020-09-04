/* eslint-disable @typescript-eslint/ban-types */
import React, { useCallback, useRef } from 'react';
import { FiLock } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { useHistory, useLocation } from 'react-router-dom';

import { useToast } from '../../hooks/Toast';
import getValidationErrors from '../../utils/getValidationErrors';

import logoImg from '../../assets/logo.svg';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Content, Background, AnimatedContainer } from './styles';
import api from '../../services/api';

interface resetPasswordFormData {
  password_confirmation: string;
  password: string;
}

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const history = useHistory();
  const location = useLocation();

  const { addToast } = useToast();

  const handlesubmit = useCallback(
    async (data: resetPasswordFormData) => {
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          password: Yup.string().required('Senha obrigatória'),
          password_confirmation: Yup.string().oneOf(
            [Yup.ref('password')],
            'As senhas devem ser iguais',
          ),
        });

        await schema.validate(data, { abortEarly: false });

        const token = location.search.replace('?token=', '');

        if (!token) throw new Error();

        await api.post('/password/reset', {
          password: data.password,
          password_confirmation: data.password_confirmation,
          token,
        });

        addToast({
          title: 'Senha Resetada',
          type: 'success',
          description: 'Senha resetada com sucesso',
        });

        history.push('/');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          title: 'Erro ao resetar a senha',
          type: 'error',
          description: 'Ocorreu um erro ao resetar a senha, tente novamente',
        });
      }
    },
    [addToast, history, location.search],
  );

  return (
    <Container>
      <Content>
        <AnimatedContainer>
          <img src={logoImg} alt="GoBarber" />
          <Form onSubmit={handlesubmit} ref={formRef}>
            <h1>Resetar senha</h1>

            <Input
              icon={FiLock}
              name="password"
              type="password"
              placeholder="Nova senha"
            />

            <Input
              icon={FiLock}
              name="password_confirmation"
              type="password"
              placeholder="Confirmação da senha"
            />

            <Button type="submit">Alterar</Button>
          </Form>
        </AnimatedContainer>
      </Content>
      <Background />
    </Container>
  );
};

export default SignIn;
