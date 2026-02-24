import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { useState } from "react";
import { Plus, Trash2, Send, ArrowLeft } from "lucide-react";

interface Erro {
  id: string;
  tipo: string;
  quantidade: number;
}

interface ErrorRegistrationFormProps {
  onLogout: () => void;
  onRegistroSalvo: (registro: {
    operador: string;
    ordemProducao: string;
    erros: Array<{
      id: string;
      tipo: string;
      quantidade: number;
    }>;
  }) => void;
}

export function ErrorRegistrationForm({ onLogout, onRegistroSalvo }: ErrorRegistrationFormProps) {
  const [operador, setOperador] = useState("");
  const [ordemProducao, setOrdemProducao] = useState("");
  const [tipoErro, setTipoErro] = useState("");
  const [quantidadeErros, setQuantidadeErros] = useState("");
  const [errosAdicionados, setErrosAdicionados] = useState<Erro[]>([]);
  const [dadosBasicosPreenchidos, setDadosBasicosPreenchidos] = useState(false);

  // Gerar tipos de erros de 0 a 40
  const tiposDeErros = Array.from({ length: 41 }, (_, i) => i.toString());

  const confirmarDadosBasicos = () => {
    if (operador && ordemProducao) {
      setDadosBasicosPreenchidos(true);
    }
  };

  const adicionarErro = () => {
    if (tipoErro && quantidadeErros) {
      const novoErro: Erro = {
        id: Date.now().toString(),
        tipo: tipoErro,
        quantidade: parseInt(quantidadeErros)
      };
      
      setErrosAdicionados([...errosAdicionados, novoErro]);
      setTipoErro("");
      setQuantidadeErros("");
    }
  };

  const removerErro = (id: string) => {
    setErrosAdicionados(errosAdicionados.filter(erro => erro.id !== id));
  };

  const finalizarRegistro = () => {
    const registro = {
      operador,
      ordemProducao,
      erros: errosAdicionados
    };
    
    console.log("Registro completo:", registro);
    
    // Salvar registro
    onRegistroSalvo(registro);
    
    const mensagem = errosAdicionados.length > 0 
      ? `${errosAdicionados.length} erro(s) registrado(s) com sucesso para a OP: ${ordemProducao}!`
      : `Registro finalizado sem erros para a OP: ${ordemProducao}!`;
    
    alert(mensagem);
    
    // Resetar formulário
    setOperador("");
    setOrdemProducao("");
    setErrosAdicionados([]);
    setDadosBasicosPreenchidos(false);
  };

  const voltarEdicaoDados = () => {
    setDadosBasicosPreenchidos(false);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-white/90 backdrop-blur-sm shadow-2xl border-0">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl">Registro de Erros</CardTitle>
        <CardDescription>
          {!dadosBasicosPreenchidos 
            ? "Preencha os dados básicos da ordem de produção"
            : `Adicionando erros para OP: ${ordemProducao} - Operador: ${operador}`
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!dadosBasicosPreenchidos ? (
          // Formulário de dados básicos
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="operador">Operador</Label>
              <Input
                id="operador"
                type="text"
                placeholder="Nome do operador"
                value={operador}
                onChange={(e) => setOperador(e.target.value)}
                required
                className="bg-white/50"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ordem-producao">Número da Ordem de Produção</Label>
              <Input
                id="ordem-producao"
                type="text"
                placeholder="Ex: OP-2025-001"
                value={ordemProducao}
                onChange={(e) => setOrdemProducao(e.target.value)}
                required
                className="bg-white/50"
              />
            </div>

            <div className="flex space-x-3">
              <Button 
                variant="outline"
                onClick={onLogout}
                className="flex-1 border-purple-300 text-purple-700 hover:bg-purple-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <Button 
                onClick={confirmarDadosBasicos}
                disabled={!operador || !ordemProducao}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                Confirmar e Adicionar Erros
              </Button>
            </div>
          </div>
        ) : (
          // Formulário de adição de erros
          <div className="space-y-6">
            {/* Seção para adicionar novo erro */}
            <div className="space-y-4 p-4 bg-purple-50/50 rounded-lg border border-purple-200">
              <h3 className="text-lg font-medium text-purple-900">Adicionar Novo Erro</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tipo-erro">Tipo de Erro</Label>
                  <Select value={tipoErro} onValueChange={setTipoErro}>
                    <SelectTrigger className="bg-white/50">
                      <SelectValue placeholder="Selecione o tipo de erro" />
                    </SelectTrigger>
                    <SelectContent>
                      {tiposDeErros.map((tipo) => (
                        <SelectItem key={tipo} value={tipo}>
                          {tipo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantidade">Quantidade</Label>
                  <Input
                    id="quantidade"
                    type="number"
                    min="1"
                    placeholder="Ex: 5"
                    value={quantidadeErros}
                    onChange={(e) => setQuantidadeErros(e.target.value)}
                    className="bg-white/50"
                  />
                </div>
              </div>

              <Button 
                onClick={adicionarErro}
                disabled={!tipoErro || !quantidadeErros}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Erro
              </Button>
            </div>

            {/* Lista de erros adicionados */}
            {errosAdicionados.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-medium">Erros Adicionados ({errosAdicionados.length})</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {errosAdicionados.map((erro) => (
                    <div key={erro.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                      <div className="flex items-center space-x-3">
                        <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                          {erro.tipo}
                        </Badge>
                        <span className="text-sm text-gray-600">
                          Quantidade: <span className="font-medium">{erro.quantidade}</span>
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removerErro(erro.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Botões de ação */}
            <div className="flex space-x-3 pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={voltarEdicaoDados}
                className="flex-1 border-purple-300 text-purple-700 hover:bg-purple-50"
              >
                Editar Dados Básicos
              </Button>
              
              <Button 
                onClick={finalizarRegistro}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                <Send className="w-4 h-4 mr-2" />
                Finalizar Registro ({errosAdicionados.length})
              </Button>
            </div>

            <div className="text-center">
              <Button 
                variant="ghost" 
                onClick={onLogout}
                className="text-gray-500 hover:text-gray-700"
              >
                Voltar ao Login
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}