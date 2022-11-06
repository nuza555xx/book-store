import { PaymentMethod, Visibility } from '@services/book';
import { Role } from '@services/member';
import { registerUser, request } from '../util.e2e.spec';

export const testCheckout = () => {
    describe('#Checkout', () => {
        describe('[POST]: books/checkout', () => {
            it('should throw UNAUTHORIZED when authorization is missing', async () => {
                await request()
                    .post('/api/books/checkout')
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
                    .post('/api/books/checkout')
                    .auth(accessToken, { type: 'bearer' })
                    .set({})
                    .send({ method: PaymentMethod.Credit })
                    .expect(({ body }) => {
                        expect(body.message).toEqual('Forbidden');
                    })
                    .expect(403);
            });
        });
    });
};
