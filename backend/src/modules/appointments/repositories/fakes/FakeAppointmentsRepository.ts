import { uuid } from 'uuidv4';
import { isEqual } from 'date-fns';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';

import IAppointmentRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateappointmentDTO';

class FakeAppointmentsRepository implements IAppointmentRepository {
  private appointments: Appointment[] = [];

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const finded = this.appointments.find(appointment =>
      isEqual(appointment.date, date),
    );
    return finded;
  }

  public async create({
    provider_id,
    date,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = new Appointment();

    Object.assign(appointment, {
      id: uuid(),
      date,
      provider_id,
    });

    this.appointments.push(appointment);

    return appointment;
  }
}

export default FakeAppointmentsRepository;
