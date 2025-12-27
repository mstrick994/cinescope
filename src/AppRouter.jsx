import { Route, Routes } from "react-router-dom";

import App from "./App.jsx";
import PlanPage from "./components/Pick A Plan/PlanPage.jsx";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/plans" element={<PlanPage />} />
    </Routes>
  );
};

export default AppRouter;
