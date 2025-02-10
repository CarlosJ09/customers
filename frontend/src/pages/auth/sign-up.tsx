import { useState } from "react";
import { Box, Button, Input, VStack, Heading, Field, Text, Image } from "@chakra-ui/react";
import { useNavigate } from "react-router";
import { Toaster, toaster } from "@/components/ui/toaster";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import logo from "@/assets/oriontek_logo.jpg";

const SignUp = () => {
  const initialCredentials = { username: "", password: "", first_name: "", last_name: "" };
  const [credentials, setCredentials] = useState(initialCredentials);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (
        credentials.username === "" ||
        credentials.password === "" ||
        credentials.first_name === "" ||
        credentials.last_name === ""
      ) {
        toaster.create({ title: "All fields are required" });
        return;
      }

      const response = await axios.post("/auth/register/", credentials, {
        baseURL: `${import.meta.env.VITE_BACKENDHOST}/api`,
      });
      const data = response.data;

      if (response.status === 201) {
        login(data.user, data.access, data.refresh);
      }
    } catch (error: any) {
      if (error.response?.status === 400) {
        toaster.error({ title: error.response.data.error || "Validation error" });
        return;
      }
      toaster.error({ title: "Error occurred. Please try again." });
    }
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      p={4}
    >
      <Toaster />

      <Box width="lg" p={6} borderRadius="lg" boxShadow="lg" textAlign="center">
        <Image src={logo} alt="logo" width={120} height={120} mx="auto" rounded={"4xl"} />

        <Heading my={6}>Create Your Account</Heading>

        <VStack spaceY={4}>
          <Box width="100%">
            <Field.Root>
              <Field.Label>Username</Field.Label>
              <Input
                name="username"
                placeholder="Enter username"
                onChange={handleChange}
                required
              />
            </Field.Root>

            <Field.Root mt={4}>
              <Field.Label>Password</Field.Label>
              <Input
                name="password"
                type="password"
                placeholder="Enter password"
                onChange={handleChange}
                required
              />
            </Field.Root>

            <Field.Root mt={4}>
              <Field.Label>First Name</Field.Label>
              <Input
                name="first_name"
                placeholder="Enter first name"
                onChange={handleChange}
                required
              />
            </Field.Root>

            <Field.Root mt={4}>
              <Field.Label>Last Name</Field.Label>
              <Input
                name="last_name"
                placeholder="Enter last name"
                onChange={handleChange}
                required
              />
            </Field.Root>
          </Box>

          <Button onClick={handleSubmit} w="full" mt={4}>
            Register
          </Button>
        </VStack>

        <Text mt={4}>
          Already have an account?{" "}
          <Button variant="outline" onClick={() => navigate("/auth/sign-in")}>
            Sign In
          </Button>
        </Text>
      </Box>
    </Box>
  );
};

export default SignUp;
