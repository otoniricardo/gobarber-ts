/* eslint-disable @typescript-eslint/ban-types */
import React, { useCallback, useRef, ChangeEvent } from 'react';
import { FiMail, FiLock, FiUser, FiCamera, FiArrowLeft } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { useHistory, Link } from 'react-router-dom';

import api from '../../services/api';

import { useToast } from '../../hooks/Toast';

import getValidationErrors from '../../utils/getValidationErrors';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Content, AvatarInput } from './styles';
import { useAuth } from '../../hooks/Auth';

interface ProfileFormData {
  name: string;
  email: string;
  current_password: string;
  new_password: string;
  password_confirmation: string;
}

const Profile: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();

  const { user, updateUser } = useAuth();

  const handlesubmit = useCallback(
    async (data: ProfileFormData) => {
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
          current_password: Yup.string().required('Campo Obrigatório'),
          new_password: Yup.string(),
          // .when('current_password', {
          //   is: val => !!val.length,
          //   then: Yup.string().required('Campo Obrigatório'),
          //   otherwise: Yup.string(),
          // }),
          password_confirmation: Yup.string()
            .when('new_password', {
              is: val => !!val.length,
              then: Yup.string().required('Campo Obrigatório'),
              otherwise: Yup.string(),
            })
            .oneOf(
              [Yup.ref('new_password')],
              'A confirmação deve ser igual à nova senha',
            ),
        });

        await schema.validate(data, { abortEarly: false });

        const {
          name,
          email,
          current_password,
          new_password,
          password_confirmation,
        } = data;

        const formData = {
          name,
          email,
          current_password,
          ...(new_password ? { new_password, password_confirmation } : {}),
        };

        const response = await api.put('/users/profile/update', formData);

        updateUser(response.data);

        history.push('/dashboard');

        addToast({
          title: 'Dados atualizados',
          type: 'success',
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          title: 'Erro na atualização',
          type: 'error',
          description:
            'Ocorreu um erro ao fazer a atualização do perfil, tente novamente',
        });
      }
    },
    [addToast, history, updateUser],
  );

  const handleAvatarChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const data = new FormData();

        data.append('avatar', e.target.files[0]);

        api.patch('/users/avatar', data).then(response => {
          updateUser(response.data);
          addToast({
            type: 'success',
            title: 'Avatar atualizado',
          });
        });
      }
    },
    [addToast, updateUser],
  );

  return (
    <Container>
      <header>
        <div>
          <Link to="/dashboard">
            <FiArrowLeft />
          </Link>
        </div>
      </header>
      <Content>
        <Form
          onSubmit={handlesubmit}
          initialData={{ name: user.name, email: user.email }}
          ref={formRef}
        >
          <AvatarInput>
            <img src={user.avatar_url} alt={user.name} />

            <label htmlFor="avatar">
              <FiCamera />

              <input type="file" id="avatar" onChange={handleAvatarChange} />
            </label>
          </AvatarInput>

          <h1>Meu perfil</h1>

          <Input icon={FiUser} name="name" type="text" placeholder="Nome" />
          <Input icon={FiMail} name="email" type="text" placeholder="Email" />

          <Input
            containerStyle={{ marginTop: 24 }}
            icon={FiLock}
            name="new_password"
            type="password"
            placeholder="Nova senha"
          />

          <Input
            icon={FiLock}
            name="password_confirmation"
            type="password"
            placeholder="Confirmar nova senha"
          />

          <Input
            containerStyle={{ marginTop: 36 }}
            icon={FiLock}
            name="current_password"
            type="password"
            placeholder="Senha atual"
          />

          <Button type="submit">Confirmar mudanças</Button>
        </Form>
      </Content>
    </Container>
  );
};

export default Profile;
