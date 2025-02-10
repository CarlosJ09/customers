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
      const response = await customerService.getAll(page, filterText, selectedCountry);
      if (response.status === 200) {
        const data = response.data;
        setCustomers(data.results);
        setPagination((prev) => ({ ...prev, count: data.count }));
      }
    } catch (error) {
      console.error("Error fetching customers", error);
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
        onDeleteCustomer={async (id) => {
          try {
            const response = await customerService.delete(id);
            if (response.status === 204) {
              toaster.create({ title: "Customer deleted successfully!" });
              fetchCustomers(initialPagination.page);
            }
          } catch {
            toaster.error({ title: "Error deleting customer." });
          }
        }}
      />
    </Box>
  );
}

export default MainPage;
