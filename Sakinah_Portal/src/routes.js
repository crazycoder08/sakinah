import React from "react";

const Dashboard = React.lazy(() => import("./views/Dashboard"));

const Users = React.lazy(() => import("./views/Users/Users"));
const User = React.lazy(() => import("./views/Users/User"));
const Product = React.lazy(() =>
  import("./views/Subscriptionplan/subscriptionplan")
);
const Moods = React.lazy(() => import("./views/Moods/moods"));
const Songs = React.lazy(() => import("./views/Songs/songs"));
const Subscriptionplan = React.lazy(() =>
  import("./views/Subscriptionplan/subscriptionplan")
);
const Transaction = React.lazy(() => import("./views/Transaction/transaction"));

const routes = [
  { path: "/", exact: true, name: "Home" },
  { path: "/dashboard", name: "Dashboard", component: Dashboard },
  { path: "/userslist", exact: true, name: "Users", component: Users },
  { path: "/users/:id", exact: true, name: "User Details", component: User },
  { path: "/products", name: "Product", component: Product },
  { path: "/moods", name: "Moods", component: Moods },
  { path: "/songslist", name: "Songs", component: Songs },
  {
    path: "/subscriptionplan",
    name: "Subscription Plan",
    component: Subscriptionplan
  },
  {
    path: "/transaction",
    name: "Transaction",
    component: Transaction
  }
];

export default routes;
