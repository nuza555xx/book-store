import { Visibility } from '@services/book';
import { Role } from '@services/member';
import { registerUser, request } from '../util.e2e.spec';

export const testCreateContent = () => {
    describe('#CreateContent', () => {
        describe('[POST]: books/create', () => {
            it('should throw UNAUTHORIZED when authorization is missing', async () => {
                await request()
                    .post('/api/books/create')
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
                    .post('/api/books/create')
                    .auth(accessToken, { type: 'bearer' })
                    .set({})
                    .send({
                        name: 'example',
                        description: 'example',
                        author: 'example',
                        price: 100,
                        visibility: Visibility.PUBLISH,
                    })
                    .expect(({ body }) => {
                        expect(body.message).toEqual('Forbidden');
                    })
                    .expect(403);
            });

            it('should create book is correct', async () => {
                const { accessToken } = await registerUser(Role.ADMIN);

                await request()
                    .post('/api/books/create')
                    .auth(accessToken, { type: 'bearer' })
                    .set({})
                    .send({
                        name: 'example',
                        description: 'example',
                        author: 'example',
                        price: 100,
                        visibility: Visibility.PUBLISH,
                    })
                    .expect(201);
            });
        });
    });
};
