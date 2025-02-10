import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Container, HStack, IconButton, Heading } from "@chakra-ui/react";
import { FiArrowLeft } from "react-icons/fi";
import { Toaster, toaster } from "@/components/ui/toaster";
import { CustomerForm } from "@/components/customer/CustomerForm";
import Fallback from "@/components/ui/fallback";
import { customerService } from "@/services/CustomerService";

const CreateCustomerPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (formData: any) => {
    setLoading(true);

    try {
      const customerData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        addresses: formData.addresses.map((address: any) => ({
          city: address.cityId,
          street: address.street,
          zip_code: address.postalCode,
        })),
      };

      const response = await customerService.create(customerData);

      if (response.status === 201) {
        toaster.success({ title: "Customer created successfully!" });
        navigate("/customers");
      } else if (response.status === 400) {
        if (response.data.email) {
          toaster.error({ title: response.data.email[0] });
          return;
        }
        toaster.error({ title: "Fill all the required fields" });
      }
    } catch (error) {
      toaster.error({ title: "Error creating customer." });
    } finally {
      setLoading(false);
    }
  };

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
          Create Customer
        </Heading>
      </HStack>

      <CustomerForm
        onSubmit={handleSubmit}
        submitButtonText="Create Customer"
        isLoading={loading}
      />
    </Container>
  );
};

export default CreateCustomerPage;
