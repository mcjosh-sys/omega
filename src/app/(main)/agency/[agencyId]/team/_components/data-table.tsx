'use client'
import React from 'react'
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    useReactTable
} from "@tanstack/react-table"
import { Search } from 'lucide-react'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useModal } from '@/providers/modal-provider'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import CustomModal from '@/components/global/custom-modal'

type Props<TData, TValue> = {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    filterValue: string,
    actionButtonText?: React.ReactNode,
    modalChildren?: React.ReactNode
}

export const DataTable = <TData, TValue>({
    columns,
    data,
    filterValue,
    actionButtonText,
    modalChildren
}: Props<TData, TValue>) => {

    const { setOpen } = useModal()
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel()
    })

    return (
        <>
            <div className='flex items-center justify-between'>
                <div className='flex items-center py-4 gap-2'>
                    <Search />
                    <Input
                        placeholder='Search name...'
                        value={(table.getColumn(filterValue)?.getFilterValue() as string) ?? ''}
                        onChange={(event) => {
                            table.getColumn(filterValue)?.setFilterValue(event.target.value)
                        }}
                        className='h-12'
                    />
                </div>
                <Button
                    className='flex gap-2'
                    onClick={() => {
                        if (modalChildren) {
                            setOpen(
                                <CustomModal title='Add a team member' subHeading='Send an invitation'>
                                    {modalChildren}
                                </CustomModal>
                            )
                        }
                    }}
                >
                    {actionButtonText}
                </Button>
            </div>
            <div className='border bg-background rounded-lg'>
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {!header.isPlaceholder && flexRender(header.column.columnDef.header, header.getContext())}

                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length ? table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && 'selected'}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className='h-24 text-center'>
                                    No results
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </>
    )
}