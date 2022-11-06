import { Role } from '@services/member';
import { loginUser, registerUser, request } from '../util.e2e.spec';

export const testGetSelectContentList = () => {
    describe('#GetSelectContentList', () => {
        describe('[GET]: books/select-content', () => {
            it('should throw UNAUTHORIZED when authorization is missing', async () => {
                await request()
                    .get('/api/books/select-content')
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
                    .get('/api/books/select-content')
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
                    .get('/api/books/select-content')
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
                const { accessToken } = await loginUser('select-content');
                await request()
                    .get('/api/books/select-content')
                    .query({ page: '1', size: 1 })
                    .auth(accessToken, { type: 'bearer' })
                    .set({})
                    .expect(({ body }) => {
                        const [payload] = body.payload;

                        expect(body.page).toEqual(1);
                        expect(body.count).toEqual(1);
                        expect(body.total).toEqual(1);
                        expect(payload.description).toEqual('example');
                        expect(payload.price).toEqual(100);
                    })
                    .expect(200);
            });
        });
    });
};
