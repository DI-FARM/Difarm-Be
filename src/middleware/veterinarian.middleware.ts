import { StatusCodes } from "http-status-codes";
import { Request, Response, NextFunction } from "express";
import { Roles } from "@prisma/client";
import veterianService from "../service/veterian.service";
import ResponseHandler from "../util/responseHandler";
import AuthorizedOnProperty from "./checkOwner.middleware";

const responseHandler = new ResponseHandler();

const checkVetExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { vetId } = req.params;
  const user = (req as any).user.data;
  const veterian = await veterianService.getSingleVet(vetId);
  if (!veterian) {
    responseHandler.setError(
      StatusCodes.NOT_FOUND,
      "veterian with this id not found"
    );
    return responseHandler.send(res);
  }

  if (
    !AuthorizedOnProperty(veterian, user) &&
    user.role !== Roles.SUPERADMIN
  ) {
    return res.status(StatusCodes.FORBIDDEN).json({
      message: "You do not have access to this veterian",
    });
  }
  req.veterian = veterian;
  next();
};

export default { checkVetExists };
