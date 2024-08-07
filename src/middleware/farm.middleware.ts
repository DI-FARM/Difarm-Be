import { NextFunction, Response, Request } from "express";
import farmService from "../service/farm.service";
import ResponseHandler from "../util/responseHandler";
import { StatusCodes } from "http-status-codes";
import { Farm, Roles } from "@prisma/client";

const responseHandler = new ResponseHandler();

const checkUserFarmExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { farmId } = req.params;
  const user = (req as any).user.data;
  let data: Farm | null
  if (user.role === Roles.SUPERADMIN) {
     data = await farmService.getSingleFarm(farmId)
  }
  else{
     data = await farmService.getUserFarmById(farmId,user.userId);
  }

  if (!data) {
    responseHandler.setError(
      StatusCodes.NOT_FOUND,
      "Farm not found"
    );
    return responseHandler.send(res);
  }
  req.farm = data
  next();
};

export default {checkUserFarmExists}
