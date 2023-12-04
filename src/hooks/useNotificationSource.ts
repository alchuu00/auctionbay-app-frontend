import { useEffect, useState } from 'react';

// TODO fix fetching real-time notifications

export const  useNotificationSource = () => {
  const [data, setData] = useState<{}>();
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/notifications`;

  useEffect(() => {
    const eventSource = new EventSource(url);
    eventSource.onmessage = event => {
      setData(JSON.parse(event.data));
    };

    return () => {
      eventSource.close();
    };
  }, [url]);

  useEffect(() => {
    console.log('notifications data', data);
  }, [data]);

  return data;
}