import User from '@modules/users/infra/typeorm/entities/User';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';

export default interface IUsersRepository {
  findByEmail(data: string): Promise<User | undefined>;
  create(data: ICreateUserDTO): Promise<User>;
  findById(id: string): Promise<User | undefined>;
  save(user: User): Promise<User>;
}
