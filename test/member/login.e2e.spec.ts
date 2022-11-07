import { Role } from '@services/member';
import { isJWT } from 'class-validator';
import { delay, registerUser, request } from '../util.e2e.spec';

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

            it('should return access token admin', async () => {
                global.__ADMIN__ = `admin${Date.now().toString()}`;
                await registerUser(Role.ADMIN, global.__ADMIN__);
                await delay(1000);
                await request()
                    .post('/api/members/login')
                    .set({})
                    .send({
                        username: global.__ADMIN__,
                        password: '12345678',
                    })
                    .expect(({ body }) => {
                        expect(isJWT(body.accessToken)).toEqual(true);
                    })
                    .expect(201);
            });

            it('should return access token member', async () => {
                global.__MEMBER__ = `member${Date.now().toString()}`;
                await registerUser(Role.MEMBER, global.__MEMBER__);
                await delay(1000);
                await request()
                    .post('/api/members/login')
                    .set({})
                    .send({
                        username: global.__MEMBER__,
                        password: '12345678',
                    })
                    .expect(({ body }) => {
                        expect(isJWT(body.accessToken)).toEqual(true);
                    })
                    .expect(201);
            });
        });
    });
};
