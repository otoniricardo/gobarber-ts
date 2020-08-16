import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import ListProviderDayAvaliabilityService from '@modules/appointments/services/ListProviderDayAvaliabilityService';

let listProviderDayAvaliabilityService: ListProviderDayAvaliabilityService;
let fakeAppointmentsRepository: FakeAppointmentsRepository;

describe('ListProviderDayAvaliabilityService', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderDayAvaliabilityService = new ListProviderDayAvaliabilityService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list the day avaliability from provider', async () => {
    await Promise.all(
      [14, 15].map(hour =>
        fakeAppointmentsRepository.create({
          provider_id: 'id',
          user_id: 'user_id',
          date: new Date(2020, 4, 20, hour, 0, 0),
        }),
      ),
    );

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 20, 11).getTime();
    });

    const avaliability = await listProviderDayAvaliabilityService.execute({
      provider_id: 'id',
      year: 2020,
      month: 5,
      day: 20,
    });

    expect(avaliability).toEqual(
      expect.arrayContaining([
        { hour: 8, avaliable: false },
        { hour: 9, avaliable: false },
        { hour: 10, avaliable: false },
        { hour: 14, avaliable: false },
        { hour: 15, avaliable: false },
        { hour: 17, avaliable: true },
        { hour: 13, avaliable: true },
      ]),
    );
  });
});
