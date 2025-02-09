import { useState } from "react";
import { Box } from "@chakra-ui/react";
import Header from "@/components/customer/Header";
import Filters from "@/components/customer/Filters";
import CustomerTable from "@/components/customer/Table";

function MainPage() {
  const [filterText, setFilterText] = useState("");
  const [status, setStatus] = useState("");

  const [customers, setCustomers] = useState([
    { name: "John Doe", email: "john@example.com", status: "active" },
    { name: "Jane Smith", email: "jane@example.com", status: "inactive" },
  ]);

  const handleAddCustomer = () => {
    // Logic to add a new customer
  };

  const handleGenerateReport = () => {};

  const filteredCustomers = customers.filter((customer) => {
    return (
      customer.name.toLowerCase().includes(filterText.toLowerCase()) &&
      (status ? customer.status === status : true)
    );
  });

  return (
    <Box p={4}>
      <Header onAddCustomer={handleAddCustomer} />
      <Filters
        filterText={filterText}
        onFilterTextChange={setFilterText}
        status={status}
        onStatusChange={setStatus}
      />
      <CustomerTable />
    </Box>
  );
}

export default MainPage;
