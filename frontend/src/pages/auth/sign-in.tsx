import { useState } from "react";
import { Box, Button, Input, VStack, Heading, Field, Text, Image } from "@chakra-ui/react";
import { useNavigate } from "react-router";
import { Toaster, toaster } from "@/components/ui/toaster";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import logo from "@/assets/oriontek_logo.jpg";

const SignIn = () => {
  const initialCredentials = { username: "", password: "" };
  const [credentials, setCredentials] = useState(initialCredentials);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (credentials.username === "" || credentials.password === "") {
        toaster.create({ title: "All fields are required" });
        return;
      }

      const response = await axios.post("/auth/login/", credentials, {
        baseURL: `${import.meta.env.VITE_BACKENDHOST}/api`,
      });
      const data = response.data;

      if (response.status === 200) {
        login(data.access, data.refresh);
      }
    } catch (error: any) {
      if (error.response.status === 401) {
        toaster.error({ title: error.response.data.error });
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

        <Heading my={6}>Access Your Account </Heading>

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
              />
            </Field.Root>
          </Box>

          <Button onClick={handleSubmit} w="full" mt={4}>
            Sign In
          </Button>
        </VStack>

        <Text mt={4}>
          Don't have an account?{" "}
          <Button variant="outline" onClick={() => navigate("/auth/sign-up")}>
            Sign Up
          </Button>
        </Text>
      </Box>
    </Box>
  );
};

export default SignIn;
