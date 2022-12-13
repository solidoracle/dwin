import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";

export function BettingPage() {
  const [description, setDescription] = useState("");

  function handleDescriptionChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setDescription(value);
  }

  return (
    <Flex p={"10%"}>
      <VStack
        align="left"
        minWidth={{ xl: "600px", lg: "450px" }}
        w="100%"
        mb="200px"
      >
        <Heading>Open Betting Market</Heading>
        <VStack align="left" spacing={8} mt={6}>
          <FormControl>
            <FormLabel>Proposal Description</FormLabel>
            <Input
              onChange={handleDescriptionChange}
              autoFocus
              value={description}
            />
          </FormControl>
          <Button> CREATE </Button>
        </VStack>
      </VStack>
    </Flex>
  );
}
