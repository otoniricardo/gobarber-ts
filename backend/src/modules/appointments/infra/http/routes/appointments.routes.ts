import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureauthentication';

import AppointmentsController from '@modules/appointments/infra/http/controllers/AppointmentsController';

const appointmentsRouter = Router();

appointmentsRouter.use(ensureAuthenticated);
const appointmentController = new AppointmentsController();

appointmentsRouter.post('/', appointmentController.create);

// appointmentsRouter.get('/', async (request, response) => {
//   const appointments = await appointmentsRepository.find();

//   return response.json(appointments);
// });

export default appointmentsRouter;
