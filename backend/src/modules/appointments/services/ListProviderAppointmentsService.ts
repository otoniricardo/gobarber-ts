import { injectable, inject } from 'tsyringe';

import IAppointmentRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import IFindAllFromProviderDTO from '@modules/appointments/dtos/IFindAllFromProviderDTO';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import ICacheProvider from '@shared/container/providers/CashProvider/models/ICasheProvider';
import { classToClass } from 'class-transformer';

@injectable()
class ListProviderAppointmentsService {
  constructor(
    @inject('AppointmentRepository')
    private appointmentsRepository: IAppointmentRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    provider_id,
    day,
    month,
    year,
  }: IFindAllFromProviderDTO): Promise<Appointment[]> {
    const key = `provider-appointments:${provider_id}:${year}-${month}-${day}`;

    let appointments = await this.cacheProvider.recover<Appointment[]>(key);

    if (!appointments) {
      appointments = await this.appointmentsRepository.findAllInDayFromProvider(
        {
          day,
          month,
          year,
          provider_id,
        },
      );

      await this.cacheProvider.save(key, classToClass(appointments));
    }

    return appointments;
  }
}
export default ListProviderAppointmentsService;
