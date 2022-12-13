import { Flex, Text, VStack } from "@chakra-ui/react";
import { Bets } from "./Bets";

export function DashboardPage() {
  return (
    <Flex width="100%" justify="center" borderColor={"white"} border={"1px"}>
      <Flex
        w="35%"
        mt="50px"
        mb="75px"
        maxWidth="1200px"
        minWidth="600px"
        minHeight="400px"
        borderColor={"white"}
        border={"1px"}
      >
        <VStack align={"left"}>
          <Text>Lastest bets</Text>
          <Bets />
        </VStack>
      </Flex>
    </Flex>
  );
}
