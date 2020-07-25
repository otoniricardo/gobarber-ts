import { uuid } from 'uuidv4';

import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';

class FakeUsersRepository implements IUsersRepository {
  private users: User[] = [];

  public async findByEmail(email: string): Promise<User | undefined> {
    const finded = this.users.find(user => user.email === email);
    return finded;
  }

  public async findById(id: string): Promise<User | undefined> {
    const finded = this.users.find(user => user.id === id);
    return finded;
  }

  public async create({
    email,
    password,
    name,
  }: ICreateUserDTO): Promise<User> {
    const user = new User();
    Object.assign(user, {
      id: uuid(),
      email,
      password,
      name,
      created_at: new Date(),
      updated_at: new Date(),
    });

    this.users.push(user);

    return user;
  }

  public async save(user: User): Promise<User> {
    const findIndex = this.users.findIndex(findUser => findUser.id === user.id);

    this.users[findIndex] = user;

    return user;
  }
}

export default FakeUsersRepository;
