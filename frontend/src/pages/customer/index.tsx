import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Box } from "@chakra-ui/react";
import Header from "@/components/customer/Header";
import Filters from "@/components/customer/Filters";
import CustomerTable from "@/components/customer/Table";
import { Toaster, toaster } from "@/components/ui/toaster";
import { customerService } from "@/services/CustomerService";
import { Customer } from "@/types/customer";

function CustomerPage() {
  const initialPagination = { page: 1, count: 0 };
  const [filterText, setFilterText] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<number | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [pagination, setPagination] = useState(initialPagination);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomers(pagination.page);
  }, [pagination.page, filterText, selectedCountry]);

  const fetchCustomers = async (page: number) => {
    try {
      const response = await customerService.getAll(page, filterText, selectedCountry ?? undefined);
      if (response.status === 200) {
        const data = response.data;
        setCustomers(data.results);
        setPagination((prev) => ({ ...prev, count: data.count }));
      }
    } catch (error) {
      console.error("Error fetching customers", error);
    }
  };

  const handleDeleteCustomers = async (id: number) => {
    try {
      const response = await customerService.delete(id);
      if (response.status === 204) {
        toaster.create({ title: "Customer deleted successfully!" });
        fetchCustomers(initialPagination.page);
      }
    } catch {
      toaster.error({ title: "Error deleting customer." });
    }
  };

  const handleBulkDeleteCustomers = async (selectedCustomers: number[]) => {
    try {
      const response = await customerService.bulkDelete(selectedCustomers);
      if (response.status === 204) {
        toaster.create({ title: "Customers deleted successfully!" });
        fetchCustomers(initialPagination.page);
      } else if (response.status === 404) {
        toaster.error({ title: response.data.error });
      }
    } catch {
      toaster.error({ title: "Error deleting customers." });
    }
  };

  return (
    <Box p={4}>
      <Toaster />
      <Header onAddCustomer={() => navigate("/customers/create")} onGenerateReport={() => {}} />
      <Filters
        filterText={filterText}
        onFilterTextChange={setFilterText}
        selectedCountry={selectedCountry}
        onCountryChange={setSelectedCountry}
      />
      <CustomerTable
        customers={customers}
        pagination={pagination}
        onPaginationChange={(page) => setPagination((prev) => ({ ...prev, page }))}
        onDeleteCustomer={(id) => handleDeleteCustomers(id)}
        onBulkDeleteCustomers={(selectedCustomers) => handleBulkDeleteCustomers(selectedCustomers)}
      />
    </Box>
  );
}

export default CustomerPage;
