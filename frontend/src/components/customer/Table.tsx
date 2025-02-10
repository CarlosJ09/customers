import { useState } from "react";
import { HStack, Heading, Stack, Table, Button } from "@chakra-ui/react";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "@/components/ui/pagination";
import {
  ActionBarContent,
  ActionBarRoot,
  ActionBarSelectionTrigger,
  ActionBarSeparator,
} from "@/components/ui/action-bar";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Customer } from "@/types/customer";
import { Link } from "react-router";

type CustomerTableProps = {
  customers: Customer[];
  pagination: { page: number; count: number };
  isLoading?: boolean;
  onPaginationChange?: (page: number) => void;
  onDeleteCustomer: (id: number) => void;
  onBulkDeleteCustomers: (selectedCustomers: number[]) => void;
};

function CustomerTable({
  customers = [],
  pagination,
  isLoading = false,
  onPaginationChange,
  onDeleteCustomer,
  onBulkDeleteCustomers,
}: CustomerTableProps) {
  const [selection, setSelection] = useState<number[]>([]);

  const hasSelection = selection.length > 0;
  const indeterminate = hasSelection && selection.length < customers.length;

  const rows = customers.map((item) => (
    <Table.Row key={item.id} data-selected={selection.includes(item.id) ? "" : undefined}>
      <Table.Cell>
        <Checkbox
          top="1"
          aria-label="Select row"
          checked={selection.includes(item.id)}
          onCheckedChange={(changes) => {
            setSelection((prev) =>
              changes.checked ? [...prev, item.id] : selection.filter((id) => id !== item.id)
            );
          }}
        />
      </Table.Cell>
      <Table.Cell>{item.name}</Table.Cell>
      <Table.Cell>{item.email}</Table.Cell>
      <Table.Cell>{item.phone}</Table.Cell>
      <Table.Cell>{item.addresses?.length}</Table.Cell>
      <Table.Cell>{item.created_at?.slice(0, 10)}</Table.Cell>
    </Table.Row>
  ));

  return (
    <Stack width="full" gap="5">
      <Heading size="xl">Customers</Heading>
      {isLoading ? (
        <Skeleton height={300} />
      ) : (
        <Table.Root striped={true}>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader w="6">
                <Checkbox
                  top="1"
                  aria-label="Select all rows"
                  checked={indeterminate ? "indeterminate" : selection.length > 0}
                  onCheckedChange={(changes) => {
                    setSelection(changes.checked ? customers.map((item) => item.id) : []);
                  }}
                />
              </Table.ColumnHeader>
              {!!rows.length && (
                <>
                  <Table.ColumnHeader fontWeight="bold">Name</Table.ColumnHeader>
                  <Table.ColumnHeader fontWeight="bold">Email</Table.ColumnHeader>
                  <Table.ColumnHeader fontWeight="bold">Phone</Table.ColumnHeader>
                  <Table.ColumnHeader fontWeight="bold">Addresses</Table.ColumnHeader>
                  <Table.ColumnHeader fontWeight="bold">Date Created</Table.ColumnHeader>
                </>
              )}
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {!!rows.length ? (
              rows
            ) : (
              <Table.Row textAlign={"center"}>
                <Table.Cell>No data found</Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table.Root>
      )}

      <ActionBarRoot open={hasSelection}>
        <ActionBarContent>
          <ActionBarSelectionTrigger>{selection.length} selected</ActionBarSelectionTrigger>
          <ActionBarSeparator />
          {selection.length <= 1 && (
            <Link to={`/customers/${selection[0]}`}>
              <Button variant="outline" size="sm">
                Go to Detail
              </Button>
            </Link>
          )}
          <Button
            onClick={() => {
              if (selection.length > 1) {
                onBulkDeleteCustomers(selection);
              } else if (selection.length === 1) {
                onDeleteCustomer(selection[0]);
              }
              setSelection([]);
            }}
            colorPalette={"red"}
            variant="solid"
            size="sm"
          >
            Delete
          </Button>
        </ActionBarContent>
      </ActionBarRoot>

      <PaginationRoot
        count={pagination.count}
        pageSize={5}
        page={pagination.page}
        onPageChange={(value) => onPaginationChange?.(value.page)}
      >
        <HStack wrap="wrap">
          <PaginationPrevTrigger />
          <PaginationItems />
          <PaginationNextTrigger />
        </HStack>
      </PaginationRoot>
    </Stack>
  );
}

export default CustomerTable;
