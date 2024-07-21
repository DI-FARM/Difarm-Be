import prisma from "../db/prisma";

async function getUserByEmail(email: string) {
  const emailExist = await prisma.account.findUnique({ where: { email } });
  return emailExist;
}

async function resetPassword(email: string, newPassword: string) {
console.log(email)
  const result = await prisma.account.update({
    where: { email },
    data: { password: newPassword },
  });
  console.log(result)
  return result;
}

export default { getUserByEmail, resetPassword };
