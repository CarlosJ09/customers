import { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
import Header from "@/components/customer/Header";
import Filters from "@/components/customer/Filters";
import CustomerTable from "@/components/customer/Table";
import { customerService } from "@/services/CustomerService";
import { Customer } from "@/types/customer";

function MainPage() {
  const [filterText, setFilterText] = useState("");
  const [status, setStatus] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await customerService.getAll();
      if (response.status === 200) {
        const data = response.data;
        setCustomers(data);
      }
    } catch (error) {
      console.error("Error fetching customers", error);
    }
  };

  const handleAddCustomer = () => {
    // Logic to add a new customer
  };

  const handleGenerateReport = () => {};

  return (
    <Box p={4}>
      <Header onAddCustomer={handleAddCustomer} />
      <Filters
        filterText={filterText}
        onFilterTextChange={setFilterText}
        status={status}
        onStatusChange={setStatus}
      />
      <CustomerTable customers={customers} />
    </Box>
  );
}

export default MainPage;
