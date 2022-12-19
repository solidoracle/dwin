import { Link, Box, Flex, Tooltip } from "@chakra-ui/react";
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
      path: RoutesPathMap[RouteKey.DASHBOARD_PAGE],
      element: <DashboardPage />,
      label: "Dashboard",
      tooltip: "View voting and betting stats",
    },
    {
      path: RoutesPathMap[RouteKey.BETTING_PAGE],
      element: <BettingPage />,
      label: "Create Bet",
      tooltip: "Bet on dao proposal",
    },
  ];

  /// MAYBE HERE WE NEED TO ADD CONNECT WALLET PAGE
  const { isConnected } = useAccount();

  return (
    <Router>
      <Flex direction="column" height="100vh">
        <Navbar>
          <Flex width="100%">
            {routes.map((route) => (
              <Tooltip
                isDisabled={!route.tooltip}
                label={route.tooltip}
                openDelay={300}
                key={route.path}
              >
                <Link
                  color={"white"}
                  textDecor="bold"
                  as={NavLink}
                  mx={1.5}
                  _activeLink={{
                    border: "1px",
                  }}
                  to={route.path}
                >
                  <Box p={2.5}>{route.label}</Box>
                </Link>
              </Tooltip>
            ))}
          </Flex>
          <Flex>
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
