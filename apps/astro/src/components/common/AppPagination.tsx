import { Pagination, PaginationProps } from '../ui/pagination';

export const AppPagination = (props: PaginationProps) => {
  return (
    <Pagination
      onPageChange={({ page }) => {
        window.location.href = `?page=${page}`;
      }}
      {...props}
    ></Pagination>
  );
};
