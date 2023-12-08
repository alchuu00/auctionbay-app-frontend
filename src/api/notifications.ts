import { apiRoutes } from "../constants/apiConstatnts";
import { NotificationType } from "../models/notification";
import { apiRequest } from "./api";

export const fetchNotifications = async () =>
  apiRequest<string, NotificationType[]>(
    "get",
    `${apiRoutes.NOTIFICATIONS_PREFIX}/all`
  );
