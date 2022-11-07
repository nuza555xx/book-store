import { Visibility } from '@services/book';
import { Role } from '@services/member';
import { loginUser, registerUser, request } from '../util.e2e.spec';

export const testSelectContent = () => {
    describe('#SelectContent', () => {
        describe('[POST]: books/select-content', () => {
            it('should throw UNAUTHORIZED when authorization is missing', async () => {
                await request()
                    .post('/api/books/select-content')
                    .set({})
                    .send({})
                    .expect(({ body }) => {
                        expect(body.message).toEqual('Missing authorization header');
                    })
                    .expect(401);
            });

            it('should throw FORBIDDEN when role user is wrong', async () => {
                const { accessToken } = await registerUser(Role.ADMIN);

                await request()
                    .post('/api/books/select-content')
                    .auth(accessToken, { type: 'bearer' })
                    .set({})
                    .send({
                        contentId: ['fcd5d92e-e0fe-4acf-95d9-15faa6765739'],
                    })
                    .expect(({ body }) => {
                        expect(body.message).toEqual('Forbidden');
                    })
                    .expect(403);
            });

            it('should throw BAD_REQUEST when query is missing', async () => {
                const { accessToken } = await registerUser(Role.MEMBER);

                await request()
                    .post('/api/books/select-content')
                    .auth(accessToken, { type: 'bearer' })
                    .set({})
                    .send({})
                    .expect(({ body }) => {
                        expect(body.message.sort()).toEqual([
                            'contentId must be an array',
                            'contentId must contain at least 1 elements',
                            'contentId should not be empty',
                            'each value in contentId must be a UUID',
                        ]);
                    })
                    .expect(400);
            });

            it('should create select book is correct', async () => {
                const { accessToken } = await loginUser('member');

                const { accessToken: accessTokenAdmin } = await registerUser(Role.ADMIN);

                await request()
                    .post('/api/books/create')
                    .auth(accessTokenAdmin, { type: 'bearer' })
                    .set({})
                    .send({
                        name: 'example',
                        description: 'example',
                        author: 'example',
                        price: 100,
                        visibility: Visibility.PUBLISH,
                    })
                    .expect(201);

                const { body } = await request()
                    .get('/api/books/list')
                    .query({ page: 1, size: 1 })
                    .auth(accessToken, { type: 'bearer' })
                    .set({})
                    .send({})
                    .expect(200);

                const [payload] = body.payload;

                // await request()
                //     .post('/api/books/select-content')
                //     .query({ page: 1, size: 1 })
                //     .auth(accessToken, { type: 'bearer' })
                //     .send({
                //         contentId: [payload.id],
                //     })
                //     .expect(201);
            });
        });
    });
};
