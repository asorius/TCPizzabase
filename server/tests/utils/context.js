import { fakeUser } from '@server/entities/tests/fakes';
import { authUserSchema } from '@server/entities/user';
export const requestContext = (context) => ({
    req: {
        header: () => undefined,
        get: () => undefined,
    },
    res: {
        cookie: () => undefined,
    },
    ...context,
});
export const authContext = (context, user = fakeUser()) => ({
    authUser: authUserSchema.parse(user),
    ...context,
});
