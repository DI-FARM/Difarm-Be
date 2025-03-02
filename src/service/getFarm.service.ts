import prisma from "../db/prisma";

const getFarmByUserId = async (userId: string) => {
    const farm = await prisma.farm.findFirst({
      where: {
        OR: [
          { ownerId: userId },  // Check if the user is the owner of the farm
          { managerId: userId } // Check if the user is the manager of the farm
        ]
      }
    });
    return farm;
  };

  export {getFarmByUserId}