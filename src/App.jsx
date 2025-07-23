import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import Dashboard from "@/components/pages/Dashboard";
import Clients from "@/components/pages/Clients";
import Projects from "@/components/pages/Projects";
import Tasks from "@/components/pages/Tasks";
import Profile from "@/components/pages/Profile";
const AppContent = () => {
  const location = useLocation();
  
const getPageTitle = () => {
    switch (location.pathname) {
      case "/":
        return "Dashboard";
      case "/clients":
        return "Clients";
      case "/projects":
        return "Projects";
      case "/tasks":
        return "Tasks";
      case "/profile":
        return "Profile";
      default:
        return "ClientFlow";
    }
  };

  return (
    <Layout title={getPageTitle()}>
<Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Layout>
  );
};

function App() {
  return (
    <Router>
      <div className="App">
        <AppContent />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          toastStyle={{ zIndex: 9999 }}
        />
      </div>
    </Router>
  );
}

export default App;