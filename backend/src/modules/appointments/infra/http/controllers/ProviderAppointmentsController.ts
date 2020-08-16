import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviderAppointmentsService from '@modules/appointments/services/ListProviderAppointmentsService';

export default class ProviderAppointmentController {
  public async index(request: Request, response: Response): Promise<Response> {
    const provider_id = request.user.id;

    const { day, month, year } = request.body;

    const listProviderAppointmets = container.resolve(
      ListProviderAppointmentsService,
    );

    const appointments = await listProviderAppointmets.execute({
      day,
      month,
      year,
      provider_id,
    });

    return response.json(appointments);
  }
}
