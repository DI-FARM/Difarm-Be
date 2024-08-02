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

export default {changeCattleStatus, getSingleCattle}
