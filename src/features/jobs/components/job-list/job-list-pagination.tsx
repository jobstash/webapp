import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface Props {
  currentPage: number;
  totalPages: number;
  searchParams: Record<string, string>;
}

const getPageHref = (page: number, searchParams: Record<string, string>) => {
  const { page: _, ...rest } = searchParams;
  const params = new URLSearchParams();

  if (page !== 1) {
    params.set('page', String(page));
  }

  Object.entries(rest).forEach(([key, value]) => {
    params.set(key, value);
  });

  const queryString = params.toString();
  return queryString ? `/?${queryString}` : '/';
};

export const JobListPagination = ({
  currentPage,
  totalPages,
  searchParams,
}: Props) => {
  const group = Math.ceil(currentPage / 3);
  const groupStart = (group - 1) * 3 + 1;

  const pages = [groupStart, groupStart + 1, groupStart + 2].filter(
    (page) => page <= totalPages,
  );

  const prevPage =
    currentPage === groupStart ? groupStart - 1 : currentPage - 1;
  const nextPage = currentPage + 1;

  const showEllipsis = pages[pages.length - 1] < totalPages;
  const isPrevDisabled = currentPage === 1;
  const isNextDisabled = currentPage === totalPages;

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          {isPrevDisabled ? (
            <span className='pointer-events-none opacity-50'>
              <PaginationPrevious
                href={getPageHref(1, searchParams)}
                aria-disabled
              />
            </span>
          ) : (
            <PaginationPrevious href={getPageHref(prevPage, searchParams)} />
          )}
        </PaginationItem>

        {pages.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              href={getPageHref(page, searchParams)}
              isActive={page === currentPage}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        {showEllipsis && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        <PaginationItem>
          {isNextDisabled ? (
            <span className='pointer-events-none opacity-50'>
              <PaginationNext
                href={getPageHref(currentPage, searchParams)}
                aria-disabled
              />
            </span>
          ) : (
            <PaginationNext href={getPageHref(nextPage, searchParams)} />
          )}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
