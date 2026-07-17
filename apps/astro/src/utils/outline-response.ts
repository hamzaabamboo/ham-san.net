export const requireOutlineOk = <T extends { response: Response }>(
  request: T,
  operation: string
) => {
  if (!request.response.ok) throw new Error(`${operation} ${request.response.status}`);
  return request;
};
