"use client";

import { ReactNode } from "react";
import {
  IconButton,
  Box,
  Flex,
  HStack,
  VStack,
  Icon,
  Text,
  Drawer,
  DrawerContent,
  useDisclosure,
  BoxProps,
  FlexProps,
  MenuSeparator,
  Image,
} from "@chakra-ui/react";
import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from "@/components/ui/menu";
import { useColorModeValue } from "@/components/ui/color-mode";
import { FiUser, FiBarChart, FiPaperclip, FiMenu, FiChevronDown } from "react-icons/fi";
import { IconType } from "react-icons";
import { Avatar } from "@/components/ui/avatar";
import { ColorModeButton } from "@/components/ui/color-mode";
import logo from "@/assets/oriontek_logo.jpg";
import { Link } from "react-router";
import { useAuth } from "@/context/AuthContext";

interface LinkItemProps {
  name: string;
  icon: IconType;
  link: string;
}

interface NavItemProps extends FlexProps {
  icon: IconType;
  children: React.ReactNode;
}

interface MobileProps extends FlexProps {
  onOpen: () => void;
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const LinkItems: Array<LinkItemProps> = [
  { name: "Dashboard", icon: FiBarChart, link: "/dashboard" },
  { name: "Customers", icon: FiUser, link: "/" },
  { name: "Reports", icon: FiPaperclip, link: "/reports" },
];

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-around">
        <Image src={logo} alt="logo" width={10} height={10} rounded={"xl"} />

        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          Oriontek
        </Text>
      </Flex>
      {LinkItems.map((link) => (
        <Link key={link.name} to={link.link}>
          <NavItem key={link.name} icon={link.icon}>
            {link.name}
          </NavItem>
        </Link>
      ))}
    </Box>
  );
};

const NavItem = ({ icon, children, ...rest }: NavItemProps) => {
  return (
    <Box style={{ textDecoration: "none" }} _focus={{ boxShadow: "none" }}>
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: "purple.400",
          color: "white",
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: "white",
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Box>
  );
};

const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  const { logout } = useAuth();

  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent={{ base: "space-between", md: "flex-end" }}
      {...rest}
    >
      <IconButton
        display={{ base: "flex", md: "none" }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
      >
        <FiMenu />
      </IconButton>

      <Text
        display={{ base: "flex", md: "none" }}
        fontSize="2xl"
        fontFamily="monospace"
        fontWeight="bold"
      >
        Oriontek
      </Text>

      <HStack /* spacing={{ base: "0", md: "6" }} */>
        <ColorModeButton />

        <MenuRoot>
          <MenuTrigger asChild py={2} cursor={"pointer"} mx={8}>
            <HStack>
              <Avatar size={"sm"} />
              <VStack display={{ base: "none", md: "flex" }} alignItems="flex-start" ml="2">
                <Text fontSize="sm">Justina Clark</Text>
                <Text fontSize="xs" color="gray.600">
                  Admin
                </Text>
              </VStack>
              <Box display={{ base: "none", md: "flex" }} ml={4}>
                <FiChevronDown />
              </Box>
            </HStack>
          </MenuTrigger>
          <MenuContent
            bg={useColorModeValue("white", "gray.900")}
            borderColor={useColorModeValue("gray.200", "gray.700")}
          >
            <MenuItem value="profile">Profile</MenuItem>
            <MenuSeparator />
            <MenuItem value="sign-out" onClick={logout}>
              Sign out
            </MenuItem>
          </MenuContent>
        </MenuRoot>
      </HStack>
    </Flex>
  );
};

const SidebarWithHeader = ({ children }: { children: ReactNode }) => {
  const { open, onOpen, onClose, onToggle } = useDisclosure();

  return (
    <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
      <SidebarContent onClose={() => onClose} display={{ base: "none", md: "block" }} />
      <Drawer.Root open={open} placement="start" onOpenChange={onToggle} size="full">
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer.Root>

      <MobileNav onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {children}
      </Box>
    </Box>
  );
};

export default SidebarWithHeader;
