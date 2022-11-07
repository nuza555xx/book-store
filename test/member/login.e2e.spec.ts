import { Role } from '@services/member';
import { isJWT } from 'class-validator';
import { registerUser, request } from '../util.e2e.spec';

export const testLogin = () => {
    describe('#Login', () => {
        describe('[POST]: members/login', () => {
            it('should throw BAD_REQUEST when body is missing', async () => {
                await request()
                    .post('/api/members/login')
                    .set({})
                    .send({})
                    .expect(({ body }) => {
                        expect(body.message.sort()).toEqual([
                            'password must be a string',
                            'password should not be empty',
                            'username must be a string',
                            'username should not be empty',
                        ]);
                    })
                    .expect(400);
            });

            it('should return access token', async () => {
                await request()
                    .post('/api/members/login')
                    .set({})
                    .send({
                        username: `admin`,
                        password: '12345678',
                        role: Role.ADMIN,
                    })
                    .expect(({ body }) => {
                        expect(isJWT(body.accessToken)).toEqual(true);
                    })
                    .expect(201);
            });
        });
    });
};
