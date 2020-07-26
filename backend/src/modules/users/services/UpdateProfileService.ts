import { inject, injectable } from 'tsyringe';

// import AppError from '@shared/errors/AppError';

import User from '@modules/users/infra/typeorm/entities/User';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashprovider';
import AppError from '@shared/errors/AppError';

import IUpdateUserProfileDTO from '@modules/users/dtos/IUpdateUserProfileDTO';

@injectable()
class UpdateProfileService {
  constructor(
    @inject('UserRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    user_id,
    name,
    email,
    new_password,
    current_password,
  }: IUpdateUserProfileDTO): Promise<User> {
    const user = await this.usersRepository.findById(user_id);
    if (!user) throw new AppError('User not found');

    const emailExists = await this.usersRepository.findByEmail(email);
    if (emailExists && emailExists.id !== user_id)
      throw new AppError('E-mail already in use');

    user.name = name;
    user.email = email;

    if (new_password && !current_password)
      throw new AppError(
        'You need to inform the correct current password to update the password',
      );

    if (new_password && current_password) {
      const isCurrentPasswordCorrect = await this.hashProvider.compareHash(
        current_password,
        user.password,
      );
      if (!isCurrentPasswordCorrect)
        throw new AppError('The current password does not match');
    }

    if (new_password)
      user.password = await this.hashProvider.generateHash(new_password);

    return this.usersRepository.save(user);
  }
}
export default UpdateProfileService;
