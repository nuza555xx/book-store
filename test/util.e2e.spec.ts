import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { Role } from '@services/member';
import supertest from 'supertest';

export const app = (): NestFastifyApplication => global.__APP__;
export const request = () => supertest(global.__APP__.getHttpServer());

export const registerUser = async (role: Role, name = Date.now().toString()) => {
    try {
        const { body: accessToken } = await request().post('/api/members/register').set({}).send({
            username: name,
            displayName: name,
            password: '12345678',
            role: role,
        });

        return accessToken;
    } catch (error) {
        return;
    }
};

export const loginUser = async (username = Date.now().toString()) => {
    const { body: accessToken } = await request().post('/api/members/login').set({}).send({
        username: username,
        password: '12345678',
    });

    return accessToken;
};
