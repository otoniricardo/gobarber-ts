import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import User from '@modules/users/infra/typeorm/entities/User';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import IUpdateUserAvatarDTO from '@modules/users/dtos/IUpdateUserAvatarDTO';

@injectable()
class UpdateUserAvatarService {
  constructor(
    @inject('UserRepository')
    private usersRepository: IUsersRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  public async execute({
    user_id,
    avatarFilename,
  }: IUpdateUserAvatarDTO): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) throw new AppError('User not found', 401);

    if (user.avatar) await this.storageProvider.deleteFile(user.avatar);

    const fileName = await this.storageProvider.saveFile(avatarFilename);
    user.avatar = fileName;

    await this.usersRepository.save(user);

    return user;
  }
}
export default UpdateUserAvatarService;
