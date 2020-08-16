import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureauthentication';

import AppointmentsController from '@modules/appointments/infra/http/controllers/AppointmentsController';
import ProviderAppointmentController from '@modules/appointments/infra/http/controllers/ProviderAppointmentsController';

const appointmentsRouter = Router();

appointmentsRouter.use(ensureAuthenticated);

const appointmentController = new AppointmentsController();
const providerAppointmentController = new ProviderAppointmentController();

appointmentsRouter.post('/', appointmentController.create);
appointmentsRouter.get('/me', providerAppointmentController.index);

export default appointmentsRouter;
