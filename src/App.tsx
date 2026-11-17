import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Layout, useTheme } from "./components/Layout";
import { AppsPage } from "./pages/AppsPage";
import { ContactPage } from "./pages/ContactPage";
import { ExperiencePage } from "./pages/ExperiencePage";
import { HomePage } from "./pages/HomePage";
import { PracticePage } from "./pages/PracticePage";
import { ProjectsPage } from "./pages/ProjectsPage";

export function App() {
  const { theme, setTheme } = useTheme();

  return (
    <BrowserRouter>
      <Layout theme={theme} onToggleTheme={() => setTheme()}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/apps" element={<AppsPage onSetTheme={setTheme} />} />
          <Route path="/practice" element={<PracticePage />} />
          <Route path="/experience" element={<ExperiencePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
