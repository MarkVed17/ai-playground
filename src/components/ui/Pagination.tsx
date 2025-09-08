import React from "react";
import { Button } from "./button/Button";

export type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
};

export const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPrev, onNext }) => {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
      <div className="text-sm text-gray-600">Page {currentPage} of {totalPages}</div>
      <div className="flex items-center gap-2">
        <Button type="button" variant="outline" size="sm" onClick={onPrev} disabled={currentPage === 1}>
          Previous
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onNext} disabled={currentPage >= totalPages}>
          Next
        </Button>
      </div>
    </div>
  );
};
