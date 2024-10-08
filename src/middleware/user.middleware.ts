import { NextFunction, Response, Request } from "express";
import ResponseHandler from "../util/responseHandler";
import { StatusCodes } from "http-status-codes";
import userService from "../service/user.service";

const responseHandler = new ResponseHandler();

const checkUserExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.params;
  const user = (req as any).user.data;
  const data = await userService.getUserById(userId);

  if (!data) {
    responseHandler.setError(StatusCodes.NOT_FOUND, "User not found");
    return responseHandler.send(res);
  }
  if (data.id != user.userId && user.role != "SUPERADMIN") {
    responseHandler.setError(
      StatusCodes.FORBIDDEN,
      "You dont have access to this user"
    );
    return responseHandler.send(res);
  }
  req.actionUser = data;
  next();
};

export default { checkUserExists };
