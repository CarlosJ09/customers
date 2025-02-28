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
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomers(pagination.page);
  }, [pagination.page, filterText, selectedCountry]);

  const fetchCustomers = async (page: number) => {
    setIsLoading(true);
    try {
      const response = await customerService.getAll(page, filterText, selectedCountry ?? undefined);
      if (response.status === 200) {
        const data = response.data;
        setCustomers(data.results);
        setPagination((prev) => ({ ...prev, count: data.count }));
      }
    } catch (error) {
      console.error("Error fetching customers", error);
    } finally {
      setIsLoading(false);
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

  const handleGenerateReport = async () => {
    try {
      setIsLoading(true);
      const response = await customerService.getCustomerReport();

      if (response.status === 200) {
        const blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        const filename = response.headers["content-disposition"]
          ? response.headers["content-disposition"].split("filename=")[1].replace(/"/g, "")
          : "customer_report.xlsx";

        link.href = url;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
        window.URL.revokeObjectURL(url);

        toaster.success({ title: "Report generated successfully!" });
      }
    } catch (error) {
      console.error("Error generating report:", error);
      toaster.error({ title: "Error generating report." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box p={4}>
      <Toaster />
      <Header
        onAddCustomer={() => navigate("/customers/create")}
        onGenerateReport={handleGenerateReport}
      />
      <Filters
        filterText={filterText}
        onFilterTextChange={setFilterText}
        selectedCountry={selectedCountry}
        onCountryChange={setSelectedCountry}
      />

      <CustomerTable
        customers={customers}
        isLoading={isLoading}
        pagination={pagination}
        onPaginationChange={(page) => setPagination((prev) => ({ ...prev, page }))}
        onDeleteCustomer={(id) => handleDeleteCustomers(id)}
        onBulkDeleteCustomers={(selectedCustomers) => handleBulkDeleteCustomers(selectedCustomers)}
      />
    </Box>
  );
}

export default CustomerPage;
