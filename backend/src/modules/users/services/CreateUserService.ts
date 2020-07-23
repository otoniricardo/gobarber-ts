import { hash } from 'bcryptjs';

import AppError from '@shared/errors/AppError';

import User from '@modules/users/infra/typeorm/entities/User';

import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

class CreateUserService {
  constructor(private usersRepository: IUsersRepository) {}

  async execute({ name, email, password }: ICreateUserDTO): Promise<User> {
    const checkEmailExists = await this.usersRepository.findByEmail(email);

    if (checkEmailExists) throw new AppError('email already in use');

    const hashedPassword = await hash(password, 8);

    const user = await this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    return user;
  }
}
export default CreateUserService;
