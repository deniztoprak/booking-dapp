import { Routes, Route } from "react-router-dom";
import { AdminPanel } from "./pages/AdminPanel/AdminPanel";
import { StartPage } from "./pages/StartPage/StartPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<StartPage />} />
      <Route path="admin" element={<AdminPanel />} />
    </Routes>
  );
}

export default App;
