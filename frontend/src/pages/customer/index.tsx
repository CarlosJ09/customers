import { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
import Header from "@/components/customer/Header";
import Filters from "@/components/customer/Filters";
import CustomerTable from "@/components/customer/Table";
import { customerService } from "@/services/CustomerService";
import { Customer } from "@/types/customer";
import { useNavigate } from "react-router";
import { Toaster, toaster } from "@/components/ui/toaster";

function MainPage() {
  const [filterText, setFilterText] = useState("");
  const [status, setStatus] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const navigate = useNavigate();

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

  const handleAddCustomer = async () => {
    navigate("/customers/create");
  };

  const handleGenerateReport = () => {};

  const deleteCustomer = async (id: number) => {
    try {
      const response = await customerService.delete(id);
      if (response.status === 204) {
        toaster.create({ title: "Customer deleted successfully!" });
        fetchCustomers();
      }
    } catch (error) {
      toaster.error({ title: "Error deleting customer." });
    }
  };

  return (
    <Box p={4}>
      <Toaster />

      <Header onAddCustomer={handleAddCustomer} onGenerateReport={handleGenerateReport} />
      <Filters
        filterText={filterText}
        onFilterTextChange={setFilterText}
        status={status}
        onStatusChange={setStatus}
      />
      <CustomerTable customers={customers} onDeleteCustomer={deleteCustomer} />
    </Box>
  );
}

export default MainPage;
