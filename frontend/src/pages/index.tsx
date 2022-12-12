import {
  Text,
  Grid,
  Card,
  CardHeader,
  Heading,
  CardBody,
  Stack,
  StackDivider,
  Link,
  Box,
  Flex,
  Tooltip,
} from "@chakra-ui/react";
import {
  Navigate,
  NavLink,
  Route,
  Routes,
  BrowserRouter as Router,
} from "react-router-dom";
import { useAccount } from "wagmi";
import { BettingPage } from "./components/BettingPage";
import { DashboardPage } from "./components/DashboardPage";
import { ConnectWalletButton } from "./components/ConnectWalletButton";
import { Navbar } from "./components/Navbar";

export enum RouteKey {
  BETTING_PAGE,
  DASHBOARD_PAGE,
}

export const RoutesPathMap: { [key: number]: string } = {
  [RouteKey.BETTING_PAGE]: "/betting",
  [RouteKey.DASHBOARD_PAGE]: "/dashboard",
};

export function Pages() {
  const routes = [
    {
      path: RoutesPathMap[RouteKey.BETTING_PAGE],
      element: <BettingPage />,
      label: "Betting",
      tooltip: "Bet on dao proposal",
    },
    {
      path: RoutesPathMap[RouteKey.DASHBOARD_PAGE],
      element: <DashboardPage />,
      label: "Dashboard",
      tooltip: "View voting and betting stats",
    },
  ];

  const { isConnected } = useAccount();

  return (
    <Router>
      <Flex direction="column" height="100vh" overflow="hidden">
        <Navbar>
          <Flex justifyContent="space-between" width="100%">
            {routes.map((route) => (
              <Tooltip
                isDisabled={!route.tooltip}
                label={route.tooltip}
                openDelay={300}
                key={route.path}
              >
                <Link
                  textDecor="bold"
                  as={NavLink}
                  mx={1.5}
                  bgColor={"white"}
                  _activeLink={{
                    color: "brand.950",
                    bgColor: "blue",
                  }}
                  _hover={{ textDecor: "none", color: "brand.700" }}
                  to={route.path}
                >
                  <Box px={5} py={2.5}>
                    {route.label}
                  </Box>
                </Link>
              </Tooltip>
            ))}
          </Flex>
          <Flex my={3}>
            <ConnectWalletButton />
          </Flex>
        </Navbar>
        <Routes>
          <Route
            path="/"
            element={<Navigate to={RoutesPathMap[RouteKey.DASHBOARD_PAGE]} />}
          />
          {routes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Routes>
      </Flex>
    </Router>
  );
}
