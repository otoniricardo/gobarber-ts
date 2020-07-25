import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashprovider';

import User from '@modules/users/infra/typeorm/entities/User';

@injectable()
class CreateUserService {
  constructor(
    @inject('UserRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  async execute({ name, email, password }: ICreateUserDTO): Promise<User> {
    const checkEmailExists = await this.usersRepository.findByEmail(email);

    if (checkEmailExists) throw new AppError('email already in use');

    const hashedPassword = await this.hashProvider.generateHash(password);

    const user = await this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    return user;
  }
}
export default CreateUserService;
