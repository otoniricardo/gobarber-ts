import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import UpdateProfileService from './UpdateProfileService';

let updateProfileService: UpdateProfileService;
let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    updateProfileService = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update the user name and email', async () => {
    const user = await fakeUsersRepository.create({
      name: 'john Doe',
      email: 'example@example.com',
      password: '123456',
    });

    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'John Tre',
      email: 'johntre@example.com',
    });

    expect(updatedUser).toHaveProperty('name', 'John Tre');
    expect(updatedUser).toHaveProperty('email', 'johntre@example.com');
  });

  it('should not be able to update the email with an already taken email', async () => {
    await fakeUsersRepository.create({
      name: 'john Doe',
      email: 'example@example.com',
      password: '123456',
    });

    const user = await fakeUsersRepository.create({
      name: 'john Doe',
      email: 'example2@example.com',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'John Tre',
        email: 'example@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the user password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'john Doe',
      email: 'example@example.com',
      password: 'password',
    });

    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'John Tre',
      email: 'johntre@example.com',
      current_password: 'password',
      new_password: 'new-password',
    });

    expect(updatedUser).toHaveProperty('password', 'new-password');
    expect(generateHash).toHaveBeenCalledWith('new-password');
  });

  it('should not be able to update the user password without the old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'john Doe',
      email: 'example@example.com',
      password: 'password',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'John Tre',
        email: 'johntre@example.com',
        new_password: 'new-password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the user password with wrong current password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'john Doe',
      email: 'example@example.com',
      password: 'password',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'John Tre',
        email: 'johntre@example.com',
        new_password: 'new-password',
        current_password: 'wrong-current-password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the the profit for a non existing user', async () => {
    await expect(
      updateProfileService.execute({
        user_id: 'non-existing-id',
        name: 'John Tre',
        email: 'johntre@example.com',
        new_password: 'new-password',
        current_password: 'wrong-current-password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
