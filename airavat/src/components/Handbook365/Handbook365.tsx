import { IHandbookProps } from "../../common/Interfaces";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import Handbook365Inner from "./Handbook365Inner";
import { useEffect, useRef } from "react";

function useOrCreateQueryClient() {
  const ref = useRef<QueryClient>();
  if (!ref.current) {
    ref.current = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 5 * 60 * 1000,
          cacheTime: 30 * 60 * 1000,
          refetchOnWindowFocus: false,
          retry: 2,
        },
      },
    });
  }
  return ref.current;
}

const Handbook365: React.FC<IHandbookProps> = (props) => {
  const client = useOrCreateQueryClient();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const persister = createSyncStoragePersister({
      storage: window.localStorage,
    });

    // v4 API
    persistQueryClient({
      queryClient: client,
      persister,
      maxAge: 24 * 60 * 60 * 1000, // keep up to 24h
    });
  }, [client]);


  return (
    <QueryClientProvider client={client}>
      <Handbook365Inner {...props} />
    </QueryClientProvider>
  );
};

export default Handbook365;