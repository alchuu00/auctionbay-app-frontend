import { useEffect, useState } from "react";
import * as API from "../api/api";
import { useRouter } from "next/navigation";
import { StatusCode } from "../constants/errorConstants";
import { NotificationType } from "../models/notification";
import { routes } from "../constants/routesConstants";

export const useFetchNotifications = (): { notifications: NotificationType[]; refetch: () => void } => {

  const [notifications, setNotifications] = useState<NotificationType[]>([]);

  const router = useRouter();

  const fetchNotifications = async () => {
    try {
      const notificationsData = await API.fetchNotifications();
      if (notificationsData.data?.statusCode === StatusCode.FORBIDDEN) {
        router.push(`${routes.HOME}`);
      } else if (notificationsData.data?.statusCode === StatusCode.UNAUTHORIZED) {
        router.push(`${routes.HOME}`);
      } else {
        setNotifications(notificationsData.data);
      }
    } catch (error) {
      console.error("Error fetching bids data: ", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return { notifications, refetch: fetchNotifications };
};
