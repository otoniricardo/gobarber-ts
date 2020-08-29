import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProvidersService from '@modules/appointments/services/ListProvidersService';
import FakeCacheProvider from '@shared/container/providers/CashProvider/fakes/FakeCacheProvider';

let listProvidersService: ListProvidersService;
let fakeUsersRepository: FakeUsersRepository;
let fakeCacheProvider: FakeCacheProvider;

describe('ListProviders', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCacheProvider = new FakeCacheProvider();
    listProvidersService = new ListProvidersService(
      fakeUsersRepository,
      fakeCacheProvider,
    );
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
