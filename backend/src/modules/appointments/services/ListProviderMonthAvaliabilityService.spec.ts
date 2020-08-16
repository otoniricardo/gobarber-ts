import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import ListProviderMonthAvaliabilityService from '@modules/appointments/services/ListProviderMonthAvaliabilityService';

let listProviderMonthAvaliabilityService: ListProviderMonthAvaliabilityService;
let fakeAppointmentsRepository: FakeAppointmentsRepository;

describe('ListProviderMonthAvaliabilityService', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderMonthAvaliabilityService = new ListProviderMonthAvaliabilityService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list the month avaliability from provider', async () => {
    await Promise.all(
      [8, 9, 10, 11, 12, 13, 14, 15, 16, 17].map(hour =>
        fakeAppointmentsRepository.create({
          provider_id: 'id',
          user_id: 'user_id',
          date: new Date(2020, 4, 20, hour, 0, 0),
        }),
      ),
    );
    await fakeAppointmentsRepository.create({
      provider_id: 'id',
      user_id: 'user_id',
      date: new Date(2020, 4, 21, 8, 0, 0),
    });

    const avaliability = await listProviderMonthAvaliabilityService.execute({
      provider_id: 'id',
      year: 2020,
      month: 5,
    });

    expect(avaliability).toEqual(
      expect.arrayContaining([
        { day: 20, avaliable: false },
        { day: 21, avaliable: true },
        { day: 22, avaliable: true },
      ]),
    );
  });
});
