"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function AuthorizedOnProperty(property, user) {
    return property.farm.ownerId === user.userId || property.farm.managerId === user.userId;
}
exports.default = AuthorizedOnProperty;
