import { Navigate, Route, Routes } from "react-router-dom";
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
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import PrivateRoute from "./pages/PrivateRoute";
import DetailProduct from "./pages/client/DetailProduct";

function App() {
  return (
    <Routes>
      {/* LayoutAdmin sẽ bọc tất cả các tuyến con */}
      <Route path="/admin" element={<PrivateRoute />}>
        <Route element={<LayoutAdmin />}>
          <Route index element={<Navigate to="/admin/dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          {/* product */}
          <Route path="products/list" element={<ProductsList />} />
          <Route path="products/:id" element={<ProductDetail />} />
          <Route path="products/add" element={<ProductAdd />} />
          <Route path="products/:id/update" element={<ProductUpdate />} />

          {/* category */}
          <Route path="categories/list" element={<ListCategory />} />
          <Route path="categories/add" element={<AddCategory />} />
          <Route path="categories/:id/update" element={<UpdateCategory />} />
        </Route>
      </Route>

      <Route path="/" element={<LayoutClient />}>
        <Route index element={<Home />} />
        <Route path="/products/:id" element={<DetailProduct />} />
      </Route>
      <Route path="/signup" element={<Signup />} />
      <Route path="/signin" element={<Signin />} />
    </Routes>
  );
}

export default App;
