import { Farm } from "@prisma/client";

function AuthorizedOnProperty(property:any, user:{userId: string}) {
    return property.farm.ownerId === user.userId || property.farm.managerId === user.userId;
}

export default AuthorizedOnProperty;