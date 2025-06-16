import React from 'react'

interface TableWrapperProps extends React.HTMLAttributes<HTMLTableElement> {}

export default function TableWrapper(props: TableWrapperProps) {
  return (
    <div className="overflow-x-auto mb-4">
      <table className="min-w-full border-collapse border border-border" {...props} />
    </div>
  )
} 