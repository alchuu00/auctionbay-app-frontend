import { useEffect, useState } from 'react';
import { NotificationType } from '../models/notification';

export const useNotificationSource = () => {
  const [data, setData] = useState<NotificationType>();
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/notifications`;

  useEffect(() => {
    const eventSource = new EventSource(url);
    eventSource.onmessage = event => {
      setData(JSON.parse(event.data));
    };

    return () => {
      eventSource.close();
    };
  }, [data, url]);

  return data;
}