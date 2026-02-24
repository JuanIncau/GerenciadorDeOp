import { LoginForm } from "./components/LoginForm";
import { ErrorRegistrationForm } from "./components/ErrorRegistrationForm";
import { AdminDashboard } from "./components/AdminDashboard";
import { useState, useEffect } from "react";

interface RegistroErro {
  id: string;
  operador: string;
  ordemProducao: string;
  erros: Array<{
    id: string;
    tipo: string;
    quantidade: number;
  }>;
  dataRegistro: string;
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<'operador' | 'admin' | null>(null);
  const [registros, setRegistros] = useState<RegistroErro[]>([]);

  // Carregar registros do localStorage ao iniciar
  useEffect(() => {
    const registrosSalvos = localStorage.getItem('registros-erros');
    if (registrosSalvos) {
      setRegistros(JSON.parse(registrosSalvos));
    }
  }, []);

  // Salvar registros no localStorage sempre que houver mudança
  useEffect(() => {
    localStorage.setItem('registros-erros', JSON.stringify(registros));
  }, [registros]);

  const handleLoginSuccess = (tipo: 'operador' | 'admin') => {
    setIsLoggedIn(true);
    setUserType(tipo);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserType(null);
  };

  const adicionarRegistro = (novoRegistro: Omit<RegistroErro, 'id' | 'dataRegistro'>) => {
    const registro: RegistroErro = {
      ...novoRegistro,
      id: Date.now().toString(),
      dataRegistro: new Date().toLocaleString('pt-BR')
    };
    setRegistros(prev => [...prev, registro]);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-700 to-purple-500 p-4">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative z-10 w-full max-w-6xl">
        {!isLoggedIn ? (
          <LoginForm onLoginSuccess={handleLoginSuccess} />
        ) : userType === 'operador' ? (
          <ErrorRegistrationForm onLogout={handleLogout} onRegistroSalvo={adicionarRegistro} />
        ) : (
          <AdminDashboard registros={registros} onLogout={handleLogout} />
        )}
      </div>
      {/* Elementos decorativos */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-purple-300/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl"></div>
    </div>
  );
}