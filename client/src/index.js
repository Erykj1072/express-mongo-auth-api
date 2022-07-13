import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Routes, Route } from "react-router-dom";

//Views
import Home from "./views/Home";
import BusinessPanel from "./views/BusinessPanel";
import Marketing from "./views/Marketing";

//Components
import LiveOrderList from "./components/LiveOrderList";
import OrderList from "./components/OrderList";
import ItemsTable from "./components/ItemsTable";
import AccountSettings from "./components/AccountSettings";
import AppSettings from "./components/AppSettings";
import FAQ from "./components/FAQ";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="business" element={<BusinessPanel />}>
        <Route index element={<LiveOrderList />} />
        <Route path="orders" element={<OrderList />} />
        <Route path="items" element={<ItemsTable />} />
        <Route path="account" element={<AccountSettings />} />
        <Route path="settings" element={<AppSettings />} />
        <Route path="faq" element={<FAQ />} />
      </Route>
      <Route path="marketing" element={<Marketing />} />
    </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
