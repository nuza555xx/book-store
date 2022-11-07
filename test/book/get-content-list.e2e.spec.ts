import { Visibility } from '@services/book';
import { Role } from '@services/member';
import { delay, registerUser, request } from '../util.e2e.spec';

export const testGetContentList = () => {
    describe('#GetContentList', () => {
        describe('[GET]: books/create', () => {
            it('should throw UNAUTHORIZED when authorization is missing', async () => {
                await request()
                    .get('/api/books/list')
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
                    .get('/api/books/list')
                    .auth(accessToken, { type: 'bearer' })
                    .set({})
                    .send({})
                    .expect(({ body }) => {
                        expect(body.message.sort()).toEqual([
                            'page must be a number string',
                            'page should not be empty',
                            'size must be a number string',
                            'size should not be empty',
                        ]);
                    })
                    .expect(400);
            });

            it('should throw BAD_REQUEST when query is missing', async () => {
                const { accessToken } = await registerUser(Role.MEMBER);

                await request()
                    .get('/api/books/list')
                    .auth(accessToken, { type: 'bearer' })
                    .set({})
                    .send({})
                    .expect(({ body }) => {
                        expect(body.message.sort()).toEqual([
                            'page must be a number string',
                            'page should not be empty',
                            'size must be a number string',
                            'size should not be empty',
                        ]);
                    })
                    .expect(400);
            });

            it('should return list book is correct', async () => {
                const { accessToken: accessTokenMember } = await registerUser(Role.MEMBER);

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

                await delay(1000);

                await request()
                    .get('/api/books/list')
                    .query({ page: 1, size: 1 })
                    .auth(accessTokenMember, { type: 'bearer' })
                    .set({})
                    .expect(({ body }) => {
                        const [payload] = body.payload;

                        expect(body.page).toEqual(1);
                        expect(body.count).toEqual(1);
                        expect(body.total).toEqual(1);
                        expect(payload.description).toEqual('example');
                        expect(payload.price).toBeGreaterThan(0);
                    })
                    .expect(200);
            });
        });
    });
};
