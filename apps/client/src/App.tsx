// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";
// import Faucet from "./pages/Faucet";
// import Earn from "./pages/Earn";
// import Portfolio from "./pages/Portfolio";
import Header from "./components/custom/Header";
// import ManageLiquidity from "./pages/ManageLiquidity";
// import Stake from "./pages/Stake";
// import AddLiquidity from "./components/custom/liquidity/AddLiquidity";
// import Trade from "./pages/Trade"; // Assuming you have a Trade component

const App = () => {
  return (
    <Header />
    // <Router>
    //   <Header />
    //   <Routes>
    //     {/* <Route path="/faucet" element={<Faucet />} />
    //     <Route path="/earn" element={<Earn />} />
    //     <Route path="/portfolio" element={<Portfolio />} />
    //     <Route path="/manage-liquidity" element={<ManageLiquidity />} />
    //     <Route path="/stake" element={<Stake />} />
    //     <Route path="/trade" element={<Trade />} />
    //     <Route path="/add-liquidity" element={<AddLiquidity />} />
    //     <Route path="/" element={<Navigate to="/trade" replace />} /> */}
    //     {/* <Route path="*" element={<Navigate to="/trade" replace />} /> */}
    //   </Routes>
    // </Router>
  );
};

export default App;