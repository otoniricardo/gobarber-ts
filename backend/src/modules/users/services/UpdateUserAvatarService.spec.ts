import AppError from '@shared/errors/AppError';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';

let updateUserAvatarService: UpdateUserAvatarService;
let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeStorageProvider = new FakeStorageProvider();
    updateUserAvatarService = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );
  });

  it('should be able to update a user avatar', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'example@example.com',
      password: '123456',
    });

    const updatedUser = await updateUserAvatarService.execute({
      user_id: user.id,
      avatarFilename: 'avatar.jpg',
    });

    expect(updatedUser.avatar).toBe('avatar.jpg');
  });

  it('should not be able to update avatar for a user that does not exists', async () => {
    expect(
      updateUserAvatarService.execute({
        user_id: 'non-existent-id',
        avatarFilename: 'avatar.jpg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update a user avatar deleting the old avatar', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'example@example.com',
      password: '123456',
    });

    await updateUserAvatarService.execute({
      user_id: user.id,
      avatarFilename: 'avatar.jpg',
    });

    const updatedUser = await updateUserAvatarService.execute({
      user_id: user.id,
      avatarFilename: 'avatar2.jpg',
    });

    expect(updatedUser.avatar).toBe('avatar2.jpg');

    expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');
  });
});
