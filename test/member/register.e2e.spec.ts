import { Role } from '@services/member';
import { isJWT } from 'class-validator';
import { request } from '../util.e2e.spec';

export const testRegister = () => {
    describe('#Register', () => {
        describe('[POST]: members/register', () => {
            it('should throw BAD_REQUEST when body is missing', async () => {
                await request()
                    .post('/api/members/register')
                    .set({})
                    .send({})
                    .expect(({ body }) => {
                        expect(body.message.sort()).toEqual([
                            'displayName must be a string',
                            'displayName should not be empty',
                            'password must be a string',
                            'password should not be empty',
                            'role must be a valid enum value',
                            'role should not be empty',
                            'username must be a string',
                            'username should not be empty',
                        ]);
                    })
                    .expect(400);
            });

            it('should return access token', async () => {
                await request()
                    .post('/api/members/register')
                    .set({})
                    .send({
                        username: `e2e${Date.now().toString()}`,
                        displayName: 'e2e e2e',
                        password: '12345678',
                        role: Role.MEMBER,
                    })
                    .expect(({ body }) => {
                        expect(isJWT(body.accessToken)).toEqual(true);
                    })
                    .expect(201);
            });
        });
    });
};
