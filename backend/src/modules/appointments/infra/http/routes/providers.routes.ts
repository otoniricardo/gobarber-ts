import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureauthentication';

import ProvidersController from '@modules/appointments/infra/http/controllers/ProvidersController';
import ProvidersMonthAvaliabilityController from '@modules/appointments/infra/http/controllers/ProviderMonthAvaliabilityController';
import ProvidersDayAvaliabilityController from '@modules/appointments/infra/http/controllers/ProviderDayAvaliabilityController';

const appointmentsRouter = Router();

appointmentsRouter.use(ensureAuthenticated);

const providersController = new ProvidersController();
const providersMonthAvaliabilityController = new ProvidersMonthAvaliabilityController();
const providersDayAvaliabilityController = new ProvidersDayAvaliabilityController();

appointmentsRouter.get('/', providersController.index);

appointmentsRouter.get(
  '/:provider_id/month-avaliability',
  celebrate({
    [Segments.PARAMS]: {
      provider_id: Joi.string().uuid().required(),
    },
  }),
  providersMonthAvaliabilityController.index,
);
appointmentsRouter.get(
  '/:provider_id/day-avaliability',
  celebrate({
    [Segments.PARAMS]: {
      provider_id: Joi.string().uuid().required(),
    },
  }),
  providersDayAvaliabilityController.index,
);

export default appointmentsRouter;
