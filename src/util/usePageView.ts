import { useEffect } from "react";

export function usePageView(path: string | null) {
  useEffect(() => {
    window.umami?.track((event) => ({
      ...event,
      url: path !== null ? path : event.url,
    }));
  }, [path]);
}
