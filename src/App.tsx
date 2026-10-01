import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import HomePage from '@/pages/HomePage';
import AnimalListPage from '@/pages/AnimalListPage';
import AnimalDetailPage from '@/pages/AnimalDetailPage';
import CadastroPage from '@/pages/CadastroPage';
import MinhasPublicacoesPage from '@/pages/MinhasPublicacoesPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import PerfilPage from '@/pages/PerfilPage';
import ComoFuncionaPage from '@/pages/ComoFuncionaPage';
import SobrePage from '@/pages/SobrePage';
import PrivacidadePage from '@/pages/PrivacidadePage';
import NotFoundPage from '@/pages/NotFoundPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
        <Route path="/animais-perdidos" element={<MainLayout><AnimalListPage type="perdido" title="Animais Perdidos" subtitle="Animais que estão perdidos e procuram seus tutores" /></MainLayout>} />
        <Route path="/animais-encontrados" element={<MainLayout><AnimalListPage type="encontrado" title="Animais Encontrados" subtitle="Animais encontrados que procuram seus tutores" /></MainLayout>} />
        <Route path="/animal/:id" element={<MainLayout><AnimalDetailPage /></MainLayout>} />
        <Route path="/cadastrar" element={<MainLayout><CadastroPage /></MainLayout>} />
        <Route path="/cadastrar/:id" element={<MainLayout><CadastroPage /></MainLayout>} />
        <Route path="/minhas" element={<MainLayout><MinhasPublicacoesPage /></MainLayout>} />
        <Route path="/login" element={<MainLayout><LoginPage /></MainLayout>} />
        <Route path="/cadastro" element={<MainLayout><RegisterPage /></MainLayout>} />
        <Route path="/perfil" element={<MainLayout><PerfilPage /></MainLayout>} />
        <Route path="/como-funciona" element={<MainLayout><ComoFuncionaPage /></MainLayout>} />
        <Route path="/sobre" element={<MainLayout><SobrePage /></MainLayout>} />
        <Route path="/privacidade" element={<MainLayout><PrivacidadePage /></MainLayout>} />
        <Route path="*" element={<MainLayout><NotFoundPage /></MainLayout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
