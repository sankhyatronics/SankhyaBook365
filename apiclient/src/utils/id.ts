// Remove properties Graph won't accept on create/update
export const stripUnsupported = <T extends object>(o: T) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { type, status, id, ...rest } = o as any;
  return rest;
};
