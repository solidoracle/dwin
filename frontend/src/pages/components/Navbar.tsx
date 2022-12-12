import { Flex, Icon, Image } from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";

export function Navbar({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  function handleClick() {
    navigate("/");
  }

  return (
    <Flex minHeight="70px" backgroundColor="black" alignItems="center" px={6}>
      <Icon
        color={"white"}
        onClick={handleClick}
        cursor="pointer"
        mr={6}
        height="44px"
      />
      {children}
    </Flex>
  );
}
