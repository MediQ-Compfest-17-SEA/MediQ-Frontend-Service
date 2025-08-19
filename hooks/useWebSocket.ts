import { useEffect, useState } from "react";
import WebSocketService from "../lib/socket";

export function useWebSocket(event: string) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const ws = WebSocketService;

    ws.connect();

    const callback = (payload: any) => {
      setData(payload);
    };

    ws.addCallbacks(event, callback);

    return () => {
      ws.removeCallbacks(event, callback);
    };
  }, [event]);

  return data;
}
