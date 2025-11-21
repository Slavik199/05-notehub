import ReactPaginate from 'react-paginate'
import styles from './Pagination.module.css'

export interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
 
  if (totalPages <= 1) return null

  return (
    <ReactPaginate
      pageCount={totalPages}
      pageRangeDisplayed={5}
      marginPagesDisplayed={1}
      forcePage={page - 1} 
      onPageChange={({ selected }) => onPageChange(selected + 1)}
      containerClassName={styles.pagination}
      activeClassName={styles.active}
      previousLabel="←"
      nextLabel="→"
      breakLabel="..."
      pageClassName={styles.pageItem}
      previousClassName={styles.pageItem}
      nextClassName={styles.pageItem}
      disabledClassName={styles.disabled}
    />
  )
}