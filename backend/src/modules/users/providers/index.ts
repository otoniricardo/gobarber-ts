import { container } from 'tsyringe';

import IHashProvider from './HashProvider/models/IHashprovider';
import BCryptHashProvider from './HashProvider/implementations/BCryptHashprovider';

container.registerSingleton<IHashProvider>('HashProvider', BCryptHashProvider);
