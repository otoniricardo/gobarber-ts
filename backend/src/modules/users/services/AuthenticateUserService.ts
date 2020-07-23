import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import AppError from '@shared/errors/AppError';

import authConfig from '@config/auth';
import User from '@modules/users/infra/typeorm/entities/User';

import IAuthenticateUserDTO from '@modules/users/dtos/IAuthenticateUserDTO';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

interface IResponse {
  user: User;
  token: string;
}

class AuthenticateUserService {
  constructor(private usersRepository: IUsersRepository) {}

  public async execute({
    email,
    password,
  }: IAuthenticateUserDTO): Promise<IResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) throw new AppError('Incorrect email or password', 401);

    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched)
      throw new AppError('Incorrect email or password', 401);

    const {
      jwt: { expiresIn, secret },
    } = authConfig;

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    });

    return { user, token };
  }
}

export default AuthenticateUserService;
