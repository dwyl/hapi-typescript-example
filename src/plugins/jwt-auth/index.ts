import { IPlugin, IPluginOptions } from '../interfaces';
import * as Hapi from 'hapi';
import { IUser, UserModel } from '../../api/users/user';
import { IRequest } from '../../interfaces/request';

const register = async (server: Hapi.Server, options: IPluginOptions): Promise<void> => {
    try {
        const database = options.database;
        const serverConfig = options.serverConfigs;

        const validateUser = async (decoded: any, request: IRequest, h: Hapi.ResponseToolkit) => {
            const user = await database.userModel.findById(decoded.id).lean(true);
            if (!user) {
                return { isValid: false };
            }

            return { isValid: true };
        };

        await server.register(require('hapi-auth-jwt2'));

        return setAuthStrategy(server, {
            config: serverConfig,
            validate: validateUser
        });

    } catch (err) {
        console.log(`Error registering jwt plugin: ${err}`);
        throw err;
    }
};

const setAuthStrategy = async (server, { config, validate }) => {
    server.auth.strategy('jwt', 'jwt', {
        key: config.jwtSecret,
        validate,
        verifyOptions: { algorithms: ['HS256'] }
    });

    server.auth.default('jwt');

    return;
};

export default (): IPlugin => {
    return {
        register,
        info: () => {
            return {
                name: 'JWT Authentication',
                version: '1.0.0'
            };
        }
    };
};
