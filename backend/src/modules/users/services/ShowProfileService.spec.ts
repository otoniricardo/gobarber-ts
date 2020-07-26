import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ShowProfileService from './ShowProfileService';

let showProfileService: ShowProfileService;
let fakeUsersRepository: FakeUsersRepository;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    showProfileService = new ShowProfileService(fakeUsersRepository);
  });

  it('should be able to show the user profile data', async () => {
    const user = await fakeUsersRepository.create({
      name: 'john Doe',
      email: 'example@example.com',
      password: '123456',
    });

    const userProfile = await showProfileService.execute(user.id);

    expect(userProfile).toHaveProperty('name', 'john Doe');
    expect(userProfile).toHaveProperty('email', 'example@example.com');
  });

  it('should not be able to show the user profile data for a non existent user', async () => {
    await expect(
      showProfileService.execute('non-existent-id'),
    ).rejects.toBeInstanceOf(AppError);
  });
});
