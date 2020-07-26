import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '@config/upload';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureauthentication';

import UsersController from '@modules/users/infra/http/controllers/UsersController';
import UserAvatarController from '@modules/users/infra/http/controllers/UserAvatarController';
import UserProfileController from '@modules/users/infra/http/controllers/UserProfileController';

const usersRouter = Router();

const usersController = new UsersController();
const userAvatarController = new UserAvatarController();
const userProfileController = new UserProfileController();

const upload = multer(uploadConfig);

usersRouter.post('/', usersController.create);

usersRouter.use(ensureAuthenticated);

usersRouter.patch(
  '/avatar',
  upload.single('avatar'),
  userAvatarController.update,
);

usersRouter.put('/profile/update', userProfileController.update);
usersRouter.get('/profile', userProfileController.show);

export default usersRouter;
