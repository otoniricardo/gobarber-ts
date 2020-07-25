import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let createAppointmentService: CreateAppointmentService;
let fakeAppointmentsRepository: FakeAppointmentsRepository;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    createAppointmentService = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to create new appointment', async () => {
    const appointment = await createAppointmentService.execute({
      date: new Date(),
      provider_id: 'provider_id',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment).toHaveProperty('provider_id', 'provider_id');
  });

  it('should not be able to create new appointment on the same date', async () => {
    const date = new Date();

    await createAppointmentService.execute({
      date,
      provider_id: 'provider_id',
    });

    await expect(
      createAppointmentService.execute({
        date,
        provider_id: 'provider_id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
