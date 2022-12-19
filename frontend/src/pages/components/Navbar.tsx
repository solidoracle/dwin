import { Flex, Image } from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";

export function Navbar({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  // function handleClick() {
  //   navigate("/");
  // }

  return (
    <Flex minHeight="70px" alignItems="center" px={6}>
      <Image
        // onClick={handleClick}
        src={require("../../assets/images/dwin-logo.png")}
        cursor="pointer"
        mr={6}
        height="auto"
      />
      {children}
    </Flex>
  );
}
