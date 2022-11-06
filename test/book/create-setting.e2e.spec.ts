import { Role } from '@services/member';
import { registerUser, request } from '../util.e2e.spec';

export const testCreateSetting = () => {
    describe('#CreateSetting', () => {
        describe('[POST]: books/setting-point', () => {
            it('should throw UNAUTHORIZED when authorization is missing', async () => {
                await request()
                    .post('/api/books/setting-point')
                    .set({})
                    .send({})
                    .expect(({ body }) => {
                        expect(body.message).toEqual('Missing authorization header');
                    })
                    .expect(401);
            });

            it('should throw FORBIDDEN when role user is wrong', async () => {
                const { accessToken } = await registerUser(Role.MEMBER);

                await request()
                    .post('/api/books/setting-point')
                    .auth(accessToken, { type: 'bearer' })
                    .set({})
                    .send({
                        enabled: 'active',
                        oneTo: 1,
                    })
                    .expect(({ body }) => {
                        expect(body.message).toEqual('Forbidden');
                    })
                    .expect(403);
            });
        });
    });
};
