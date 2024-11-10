import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";

type Props = {
  page: number; // initial page, comes from the parent state
  pages: number; // number of pages
  onPageChange: (page: number) => void; // be called when the page changes
};

const PaginationSelector = ({ page, pages, onPageChange }: Props) => {
  const pageNumber = [];
  // pages = 3, pageNumber = [1,2,3]
  for (let i = 1; i <= pages; i++) {
    pageNumber.push(i);
  }

  return (
    <Pagination>
      <PaginationContent>
        {page !== 1 && (
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={() => onPageChange(page - 1)}
            />
          </PaginationItem>
        )}
        {pageNumber.map((number) => (
          <PaginationItem>
            <PaginationLink
              href="#"
              onClick={() => onPageChange(number)}
              isActive={page === number}
            >
              {number}
            </PaginationLink>
          </PaginationItem>
        ))}

        {/*  pageNumber=[1,2,3] page = 1 : next, page = 3: stop */}
        {page !== pageNumber.length && (
          <PaginationItem>
            <PaginationNext href="#" onClick={() => onPageChange(page + 1)} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationSelector;
