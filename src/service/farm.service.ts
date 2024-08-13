import prisma from "../db/prisma";

const getUserFarmById = async (farmId: string, userId: string) => {
  const result = await prisma.farm.findUnique({
    where: { id: farmId, OR: [{ ownerId: userId}, {managerId: userId }] },
  });
  return result;
};
const getSingleFarm = async (farmId: string) => {
  const result = await prisma.farm.findUnique({
    where: { id: farmId },
  });
  return result;
};
const updateFarm = async (farmId: string,data:any) => {
  const result = await prisma.farm.update({
    where: { id: farmId },
    data
  });
  return result;
};

async function removeManagerFromFarm(id: string) {
  const result = await prisma.farm.updateMany({
    where: { managerId: id },
    data: { managerId: null },
  });
  return result;
}

export default {
  getUserFarmById,
  getSingleFarm,
  updateFarm,
  removeManagerFromFarm,
};
