import { injectable, inject } from 'tsyringe';

import IAppointmentRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import IFindAllFromProviderDTO from '@modules/appointments/dtos/IFindAllFromProviderDTO';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';

@injectable()
class ListProviderAppointmentsService {
  constructor(
    @inject('AppointmentRepository')
    private appointmentsRepository: IAppointmentRepository,
  ) {}

  public async execute({
    provider_id,
    day,
    month,
    year,
  }: IFindAllFromProviderDTO): Promise<Appointment[]> {
    const appointments = await this.appointmentsRepository.findAllInDayFromProvider(
      {
        day,
        month,
        year,
        provider_id,
      },
    );
    return appointments;
  }
}
export default ListProviderAppointmentsService;
