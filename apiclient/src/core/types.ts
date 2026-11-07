export type TokenProvider = (forceRefresh?: boolean) => Promise<string | null>;

export type CreateHttpOptions = {
  baseURL: string;
  getToken?: TokenProvider;              
  onAuthFailure?: (e: unknown) => void;  
  defaultHeaders?: Record<string, string>;
};
