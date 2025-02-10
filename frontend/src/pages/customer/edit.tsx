import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { Container, HStack, IconButton, Heading } from "@chakra-ui/react";
import { FiArrowLeft } from "react-icons/fi";
import { Toaster, toaster } from "@/components/ui/toaster";
import { CustomerForm } from "@/components/customer/CustomerForm";
import Fallback from "@/components/ui/fallback";
import { customerService } from "@/services/CustomerService";

const UpdateCustomerPage = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState<{
    name: string;
    email: string;
    phone: string;
    addresses: Array<{
      id: number;
      countryId: number | null;
      stateId: number | null;
      cityId: number | null;
      street: string;
      zip_code: string;
    }>;
  } | null>(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomer();
  }, [id]);

  const fetchCustomer = async () => {
    try {
      if (!id) return;
      const response = await customerService.getById(Number(id));
      const customerData = response.data;

      setInitialData({
        name: customerData.name,
        email: customerData.email,
        phone: customerData.phone || "",
        addresses: customerData.addresses.map((address, index) => ({
          id: index + 1,
          countryId: address.city.state.country.id,
          stateId: address.city.state.id,
          cityId: address.city.id,
          street: address.street,
          zip_code: address.zip_code,
        })),
      });
    } catch (error) {
      toaster.error({ title: "Error fetching customer data." });
      navigate("/customers");
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSubmit = async (formData: any) => {
    setLoading(true);

    if (!id) return;

    try {
      const customerData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        addresses: formData.addresses.map((address: any) => ({
          city: address.cityId,
          street: address.street,
          zip_code: address.zip_code,
        })),
      };

      const response = await customerService.update(Number(id), customerData);

      if (response.status === 200) {
        toaster.create({ title: "Customer updated successfully!" });
        navigate("/customers");
      } else if (response.status === 400) {
        if (response.data.email) {
          toaster.error({ title: response.data.email[0] });
          return;
        }
        toaster.error({ title: "Fill all the required fields" });
      }
    } catch (error) {
      toaster.error({ title: "Error updating customer." });
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <Container maxW={"4xl"} p={4}>
        <Fallback isLoading={true} />
      </Container>
    );
  }

  return (
    <Container maxW={"4xl"} p={4}>
      <Toaster />
      <Fallback isLoading={loading} />

      <HStack mb={6}>
        <Link to="/customers">
          <IconButton size="xs" mr={2}>
            <FiArrowLeft />
          </IconButton>
        </Link>

        <Heading as="h1" size="xl">
          Update Customer
        </Heading>
      </HStack>

      {initialData && (
        <CustomerForm
          initialData={initialData}
          onSubmit={handleSubmit}
          submitButtonText="Update Customer"
          isLoading={loading}
        />
      )}
    </Container>
  );
};

export default UpdateCustomerPage;
