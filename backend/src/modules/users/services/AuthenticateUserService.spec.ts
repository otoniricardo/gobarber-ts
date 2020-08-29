import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AuthenticateUserService from './AuthenticateUserService';

let authenticateUserService: AuthenticateUserService;
let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    authenticateUserService = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to authenticate an user', async () => {
    const user = await fakeUsersRepository.create({
      name: 'john Doe',
      email: 'example@example.com',
      password: '123456',
    });

    const response = await authenticateUserService.execute({
      email: 'example@example.com',
      password: '123456',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should not be able to authenticate an user because of wrong password', async () => {
    await fakeUsersRepository.create({
      name: 'john Doe',
      email: 'example@example.com',
      password: '123456',
    });

    await expect(
      authenticateUserService.execute({
        email: 'example@example.com',
        password: '1234567',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate an user because of wrong email', async () => {
    await fakeUsersRepository.create({
      name: 'john Doe',
      email: 'example@example.com',
      password: '123456',
    });

    await expect(
      authenticateUserService.execute({
        email: 'example@example.com.br',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
