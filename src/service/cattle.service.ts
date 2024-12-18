import { CattleStatus } from "@prisma/client";
import prisma from "../db/prisma";

const changeCattleStatus = async(status: CattleStatus, cattleId:string) => {
  await prisma.cattle.update({
    where: { id: cattleId },
    data: { status: status },
  });
};

const getSingleCattle = async (cattleId: string) => {
  const result = await prisma.cattle.findUnique({
    where: { id: cattleId },
    include:{farm: true}
  });
  return result
};
const getGroupedCattlesSum = async (year: string) => {
  const result = await prisma.cattle.findMany({
    where: {
      createdAt: {
        gte: new Date(`${year}-01-01T00:00:00.000Z`), 
        lte: new Date(`${year}-12-31T23:59:59.999Z`),
      },
    },
    select: {
      id: true,
      createdAt: true,
    },
  });
  return result
};

export default {changeCattleStatus, getSingleCattle, getGroupedCattlesSum}
