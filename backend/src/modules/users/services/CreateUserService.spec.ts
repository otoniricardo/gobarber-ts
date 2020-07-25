import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from './CreateUserService';

let createUserService: CreateUserService;
let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to create new user', async () => {
    const user = await createUserService.execute({
      name: 'john Doe',
      email: 'example@example.com',
      password: '123456',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create new user with an already used email', async () => {
    const email = 'example@example.com';

    await createUserService.execute({
      name: 'john Doe',
      email,
      password: '123456',
    });

    await expect(
      createUserService.execute({
        name: 'john Doe',
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
