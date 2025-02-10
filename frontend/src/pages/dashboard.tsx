import { Box, SimpleGrid, Stat, StatLabel, Heading, StatValueText } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { customerService } from "@/services/CustomerService";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

function DashboardPage() {
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [customersByCountry, setCustomersByCountry] = useState<
    { country: string; count: number }[]
  >([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await customerService.getDashboardStats();
      if (response.status === 200) {
        setTotalCustomers(response.data.totalCustomers);
        setCustomersByCountry(response.data.customersByCountry);
      }
    } catch (error) {
      console.error("Error fetching dashboard data", error);
    }
  };

  return (
    <Box p={4}>
      <Heading size="xl" mb={4}>
        Dashboard
      </Heading>

      <SimpleGrid columns={[1, 2, 3]} gap={6}>
        <StatBox label="Total Customers" value={totalCustomers} />
      </SimpleGrid>

      <Box mt={6} p={4} bg="white" boxShadow="md" borderRadius="md">
        <Heading size="md" mb={4}>
          Customers by Country
        </Heading>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={customersByCountry}>
            <XAxis dataKey="country" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#3182ce" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}

const StatBox = ({ label, value }: { label: string; value: number }) => (
  <Box p={4} bg="white" boxShadow="md" borderRadius="md">
    <Stat.Root>
      <StatLabel>{label}</StatLabel>
      <StatValueText>{value}</StatValueText>
    </Stat.Root>
  </Box>
);

export default DashboardPage;
