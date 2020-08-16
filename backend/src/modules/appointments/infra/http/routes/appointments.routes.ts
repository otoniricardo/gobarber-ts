import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureauthentication';

import AppointmentsController from '@modules/appointments/infra/http/controllers/AppointmentsController';
import ProviderAppointmentController from '@modules/appointments/infra/http/controllers/ProviderAppointmentsController';

const appointmentsRouter = Router();

appointmentsRouter.use(ensureAuthenticated);

const appointmentController = new AppointmentsController();
const providerAppointmentController = new ProviderAppointmentController();

appointmentsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      provider_id: Joi.string().uuid().required(),
      date: Joi.date(),
    },
  }),
  appointmentController.create,
);
appointmentsRouter.get('/me', providerAppointmentController.index);

export default appointmentsRouter;
