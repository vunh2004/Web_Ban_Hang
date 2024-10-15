import { Route, Routes } from "react-router-dom";
import LayoutAdmin from "./layouts/admin/LayoutAdmin";
import LayoutClient from "./layouts/client/LayoutClient";
import Dashboard from "./pages/admin/Dashboard";
import Home from "./pages/client/Home";
import ProductsList from "./pages/admin/products/ProductsList";
import ProductDetail from "./pages/admin/products/ProductDetail";

function App() {
  return (
    <Routes>
      {/* LayoutAdmin sẽ bọc tất cả các tuyến con */}
      <Route path="/admin" element={<LayoutAdmin />}>
        <Route index path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/products/list" element={<ProductsList />} />
        <Route path="/admin/products/:id" element={<ProductDetail />} />
      </Route>
      <Route path="/" element={<LayoutClient />}>
        <Route index element={<Home />} />
      </Route>
    </Routes>
  );
}

export default App;
