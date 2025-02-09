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
import { Customer } from "@/types/customer";

type CustomerTableProps = {
  customers: Customer[];
};

function CustomerTable({ customers = [] }: CustomerTableProps) {
  const [selection, setSelection] = useState<string[]>([]);

  const hasSelection = selection.length > 0;
  const indeterminate = hasSelection && selection.length < customers.length;

  const rows = customers.map((item) => (
    <Table.Row key={item.id} data-selected={selection.includes(item.name) ? "" : undefined}>
      <Table.Cell>
        <Checkbox
          top="1"
          aria-label="Select row"
          checked={selection.includes(item.name)}
          onCheckedChange={(changes) => {
            setSelection((prev) =>
              changes.checked
                ? [...prev, item.name]
                : selection.filter((name) => name !== item.name)
            );
          }}
        />
      </Table.Cell>
      <Table.Cell>{item.name}</Table.Cell>
      <Table.Cell>{item.email}</Table.Cell>
      <Table.Cell>${item.phone}</Table.Cell>
      <Table.Cell>${item.address}</Table.Cell>
    </Table.Row>
  ));

  return (
    <Stack width="full" gap="5">
      <Heading size="xl">Customers</Heading>
      <Table.Root striped={true}>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader w="6">
              <Checkbox
                top="1"
                aria-label="Select all rows"
                checked={indeterminate ? "indeterminate" : selection.length > 0}
                onCheckedChange={(changes) => {
                  setSelection(changes.checked ? customers.map((item) => item.name) : []);
                }}
              />
            </Table.ColumnHeader>
            {!!rows.length && (
              <>
                <Table.ColumnHeader fontWeight="bold">Name</Table.ColumnHeader>
                <Table.ColumnHeader fontWeight="bold">Email</Table.ColumnHeader>
                <Table.ColumnHeader fontWeight="bold">Phone</Table.ColumnHeader>
                <Table.ColumnHeader fontWeight="bold">Address</Table.ColumnHeader>
              </>
            )}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {!!rows.length ? rows : <Table.Cell textAlign={"center"}>No data found</Table.Cell>}
        </Table.Body>
      </Table.Root>

      <ActionBarRoot open={hasSelection}>
        <ActionBarContent>
          <ActionBarSelectionTrigger>{selection.length} selected</ActionBarSelectionTrigger>
          <ActionBarSeparator />
          <Button variant="outline" size="sm">
            Delete
          </Button>
          <Button variant="outline" size="sm">
            Go to Detail
          </Button>
        </ActionBarContent>
      </ActionBarRoot>

      <PaginationRoot count={customers.length * 5} pageSize={5} page={1}>
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
