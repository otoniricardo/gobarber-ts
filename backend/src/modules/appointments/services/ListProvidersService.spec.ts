import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProvidersService from '@modules/appointments/services/ListProvidersService';

let listProvidersService: ListProvidersService;
let fakeUsersRepository: FakeUsersRepository;

describe('ListProviders', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    listProvidersService = new ListProvidersService(fakeUsersRepository);
  });

  it('should be able to list the providers', async () => {
    const user = await fakeUsersRepository.create({
      name: 'john Doe',
      email: 'example@example.com',
      password: '123456',
    });

    const [user1, user2, user3] = await Promise.all([
      fakeUsersRepository.create({
        name: 'john Doe',
        email: 'example1@example.com',
        password: '123456',
      }),
      fakeUsersRepository.create({
        name: 'john Doe',
        email: 'example2@example.com',
        password: '123456',
      }),
      fakeUsersRepository.create({
        name: 'john Doe',
        email: 'example3@example.com',
        password: '123456',
      }),
    ]);

    const providers = await listProvidersService.execute(user.id);

    expect(providers).toEqual([user1, user2, user3]);
  });
});
