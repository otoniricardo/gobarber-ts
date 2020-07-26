import { getRepository, Repository } from 'typeorm';

import UserToken from '@modules/users/infra/typeorm/entities/UserToken';

import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';

class UserTokensRepository implements IUserTokensRepository {
  private ormRepository: Repository<UserToken>;

  constructor() {
    this.ormRepository = getRepository(UserToken);
  }

  public async generate(user_id: string): Promise<UserToken> {
    const token = this.ormRepository.create({ user_id });

    await this.ormRepository.save(token);

    return token;
  }

  public async findByToken(token: string): Promise<UserToken | undefined> {
    const finded = this.ormRepository.findOne({ where: { token } });

    return finded;
  }
}

export default UserTokensRepository;
