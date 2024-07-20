import prisma from "../db/prisma";

async function getUserByEmail(email:string){
    const emailExist = await prisma.account.findUnique({ where: { email } });
    return emailExist
}

export default {getUserByEmail}