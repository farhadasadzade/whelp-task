import { Header } from "@/modules";
import { Routes, Route } from "react-router-dom";
import { Home, Edit } from "@/pages";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="user/:id" element={<Edit />} />
      </Routes>
    </>
  );
}

export default App;
