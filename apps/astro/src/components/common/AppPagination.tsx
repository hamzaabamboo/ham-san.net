import { Pagination, type PaginationProps } from '../ui/pagination';

export const AppPagination = (props: PaginationProps) => {
  return (
    <Pagination.Root
      onPageChange={({ page }: { page: number }) => {
        window.location.href = `?page=${page}`;
      }}
      {...props}
    />
  );
};
