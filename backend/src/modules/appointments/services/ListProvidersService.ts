import { inject, injectable } from 'tsyringe';

import User from '@modules/users/infra/typeorm/entities/User';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';

@injectable()
class ListProvidersService {
  constructor(
    @inject('UserRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(user_id: string): Promise<User[]> {
    return this.usersRepository.findAllProviders({
      except_user_id: user_id,
    });
  }
}
export default ListProvidersService;
