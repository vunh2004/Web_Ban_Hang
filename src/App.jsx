import { Navigate, Route, Routes } from "react-router-dom";
import LayoutAdmin from "./layouts/admin/LayoutAdmin";
import LayoutClient from "./layouts/client/LayoutClient";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Dashboard from "./pages/admin/Dashboard";
import AddCategory from "./pages/admin/category/AddCategory";
import ListCategory from "./pages/admin/category/ListCategory";
import UpdateCategory from "./pages/admin/category/UpdateCategory";
import ProductAdd from "./pages/admin/products/ProductAdd";
import ProductDetail from "./pages/admin/products/ProductDetail";
import ProductUpdate from "./pages/admin/products/ProductUpdate";
import ProductsList from "./pages/admin/products/ProductsList";
import ListUser from "./pages/admin/users/ListUser";
import AccountInfor from "./pages/client/AccountInfor";
import DetailProduct from "./pages/client/DetailProduct";
import Home from "./pages/client/Home";
import PrivateRoute from "./pages/router/PrivateRoute";
import PublicRoute from "./pages/router/PublicRoute";
import NotFound from "./pages/NotFound";
import UpdateUser from "./pages/admin/users/UpdateUser";
import Cart from "./pages/client/Cart";
import Orders from "./pages/client/orders/Orders";
import DetailOrder from "./pages/client/orders/DetailOrder";

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

          {/* user */}
          <Route path="users/list" element={<ListUser />} />
          <Route path="users/:id/update" element={<UpdateUser />} />
        </Route>
      </Route>

      <Route path="/" element={<LayoutClient />}>
        <Route index element={<Home />} />
        <Route path="products/:id" element={<DetailProduct />} />

        {/* Cart */}
        <Route path="carts" element={<Cart />} />

        {/* Orders */}
        <Route path="orders" element={<Orders />} />
        <Route path="orders/:id" element={<DetailOrder />} />

        <Route path="*" element={<NotFound />} />
      </Route>

      <Route element={<PublicRoute />}>
        <Route path="/account" element={<AccountInfor />} />
        <Route path="/account/signup" element={<Signup />} />
        <Route path="/account/signin" element={<Signin />} />
      </Route>
    </Routes>
  );
}

export default App;
