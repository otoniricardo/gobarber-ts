import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '@config/upload';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureauthentication';

import UsersController from '@modules/users/infra/http/controllers/UsersController';
import UserAvatarController from '@modules/users/infra/http/controllers/UserAvatarController';
import UserProfileController from '@modules/users/infra/http/controllers/UserProfileController';

const usersRouter = Router();

const usersController = new UsersController();
const userAvatarController = new UserAvatarController();
const userProfileController = new UserProfileController();

const upload = multer(uploadConfig.multer);

usersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  }),
  usersController.create,
);

usersRouter.use(ensureAuthenticated);

usersRouter.patch(
  '/avatar',
  upload.single('avatar'),
  userAvatarController.update,
);

usersRouter.put(
  '/profile/update',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      new_password: Joi.string(),
      current_password: Joi.string().required(),
      password_confirmation: Joi.string().valid(Joi.ref('new_password')),
    },
  }),
  userProfileController.update,
);
usersRouter.get('/profile', userProfileController.show);

export default usersRouter;
