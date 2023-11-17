/// <reference types="lucia" />
declare namespace Lucia {
    type Auth = import("./modules/integrations/luciaService").lucia;
    type DatabaseUserAttributes = Pick<import("@prisma/client").Prisma.UserCreateInput,
        | "email"
        | "firstName"
        | "lastName"
    >;
    type DatabaseSessionAttributes = {};
}