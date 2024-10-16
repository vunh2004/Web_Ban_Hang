import { Route, Routes } from "react-router-dom";
import LayoutAdmin from "./layouts/admin/LayoutAdmin";
import LayoutClient from "./layouts/client/LayoutClient";
import Dashboard from "./pages/admin/Dashboard";
import Home from "./pages/client/Home";
import ProductsList from "./pages/admin/products/ProductsList";
import ProductDetail from "./pages/admin/products/ProductDetail";
import ProductAdd from "./pages/admin/products/ProductAdd";
import ProductUpdate from "./pages/admin/products/ProductUpdate";
import UpdateCategory from "./pages/admin/category/UpdateCategory";
import AddCategory from "./pages/admin/category/AddCategory";
import ListCategory from "./pages/admin/category/ListCategory";

function App() {
  return (
    <Routes>
      {/* LayoutAdmin sẽ bọc tất cả các tuyến con */}
      <Route path="/admin" element={<LayoutAdmin />}>
        <Route index path="/admin/dashboard" element={<Dashboard />} />
        {/* product */}
        <Route path="/admin/products/list" element={<ProductsList />} />
        <Route path="/admin/products/:id" element={<ProductDetail />} />
        <Route path="/admin/products/add" element={<ProductAdd />} />
        <Route path="/admin/products/:id/update" element={<ProductUpdate />} />

        {/* category */}
        <Route path="/admin/categories/list" element={<ListCategory />} />
        <Route path="/admin/categories/add" element={<AddCategory />} />
        <Route
          path="/admin/categories/:id/update"
          element={<UpdateCategory />}
        />
      </Route>
      <Route path="/" element={<LayoutClient />}>
        <Route index element={<Home />} />
      </Route>
    </Routes>
  );
}

export default App;
