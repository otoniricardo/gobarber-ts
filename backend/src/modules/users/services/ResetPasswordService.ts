import { inject, injectable } from 'tsyringe';
import { isAfter, addHours } from 'date-fns';

import AppError from '@shared/errors/AppError';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashprovider';

interface IRequest {
  password: string;
  token: string;
}

@injectable()
class ResetPasswordService {
  constructor(
    @inject('UserRepository')
    private usersRepository: IUsersRepository,

    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  async execute({ password, token }: IRequest): Promise<void> {
    const userToken = await this.userTokensRepository.findByToken(token);
    if (!userToken) throw new AppError('UserToken does not exists');

    const user = await this.usersRepository.findById(userToken.user_id);
    if (!user) throw new AppError('User does not exists');

    const expiresAt = addHours(userToken.created_at, 2);
    const now = Date.now();
    if (isAfter(now, expiresAt)) throw new AppError('Token expired');

    const hashed = await this.hashProvider.generateHash(password);
    user.password = hashed;

    await this.usersRepository.save(user);
  }
}
export default ResetPasswordService;
