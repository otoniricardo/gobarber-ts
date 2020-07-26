import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureauthentication';

import ProvidersController from '@modules/appointments/infra/http/controllers/ProvidersController';

const appointmentsRouter = Router();

appointmentsRouter.use(ensureAuthenticated);

const providersController = new ProvidersController();

appointmentsRouter.get('/', providersController.index);

export default appointmentsRouter;
