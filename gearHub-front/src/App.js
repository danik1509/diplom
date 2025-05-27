import './App.css';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./layout/Navbar";
import Home from "./pages/Home"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddProduct from "./products/AddProduct";
import EditProduct from "./products/EditProduct";
import ViewProduct from './products/ViewProduct';
import Login from "./authorization/login";
import UserPage from './account/userPage';
import Basket from './basket/Basket';
import Registration from './authorization/Registration'
import OrdersPage from './Order/AllOrders';
import ViewOrder from './Order/ViewOrder';
import AddAddress from './Address/AddAddress';
import EditUser from './users/EditUser';
import CreateOrder from './Order/CreateOrder';

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/addproduct" element={<AddProduct />}/>
          <Route exact path="/editproduct/:id" element={<EditProduct/>}/>
          <Route exact path="/viewproduct/:id" element={<ViewProduct/>}/>
          <Route exact path="/login" element={<Login/>}/>
          <Route exact path='/profile' element={<UserPage/>}/>
          <Route exact path='/basket' element={<Basket/>} />
          <Route exact path='/registration' element={<Registration/>} />
          <Route exact path='/createOrder' element={<CreateOrder/>} />
          <Route exact path='/orders' element={<OrdersPage/>} />
          <Route exact path="/order/:id" element={<ViewOrder/>}/>
          <Route exact path="/newAddress" element={<AddAddress/>}/>
          <Route path="/profile" element={<UserPage />} />
          <Route path="/editUser" element={<EditUser />} />
          <Route path="/addAddress" element={<AddAddress />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
