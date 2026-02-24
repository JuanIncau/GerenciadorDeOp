import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useState } from "react";
import { User, Shield } from "lucide-react";

interface LoginFormProps {
  onLoginSuccess: (userType: 'operador' | 'admin') => void;
}

export function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState<'operador' | 'admin'>('operador');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simular verificação de login
    if (username && password) {
      console.log("Login attempt:", { username, password, userType });
      onLoginSuccess(userType);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white/90 backdrop-blur-sm shadow-2xl border-0">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl">Bem-vindo de volta</CardTitle>
        <CardDescription>
          Entre com seus dados para acessar sua conta
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="userType">Tipo de Usuário</Label>
            <Select value={userType} onValueChange={(value: 'operador' | 'admin') => setUserType(value)}>
              <SelectTrigger className="bg-white/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="operador">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>Operador</span>
                  </div>
                </SelectItem>
                <SelectItem value="admin">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4" />
                    <span>Administrador</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="username">Nome de Usuário</Label>
            <Input
              id="username"
              type="text"
              placeholder="Digite seu nome de usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="bg-white/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-white/50"
            />
          </div>
          <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
            <div className="flex items-center justify-center space-x-2">
              {userType === 'admin' ? <Shield className="w-4 h-4" /> : <User className="w-4 h-4" />}
              <span>Entrar como {userType === 'admin' ? 'Administrador' : 'Operador'}</span>
            </div>
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}