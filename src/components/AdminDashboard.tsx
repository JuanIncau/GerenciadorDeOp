import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useState, useMemo } from "react";
import { Download, LogOut, Search, Filter, FileSpreadsheet, Users, AlertTriangle, Calendar } from "lucide-react";

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

interface AdminDashboardProps {
  registros: RegistroErro[];
  onLogout: () => void;
}

export function AdminDashboard({ registros, onLogout }: AdminDashboardProps) {
  const [filtroOperador, setFiltroOperador] = useState("all");
  const [filtroOrdem, setFiltroOrdem] = useState("");
  const [filtroTipoErro, setFiltroTipoErro] = useState("all");
  const [filtroData, setFiltroData] = useState("");

  // Estatísticas gerais
  const estatisticas = useMemo(() => {
    const totalRegistros = registros.length;
    const operadoresUnicos = new Set(registros.map(r => r.operador)).size;
    const totalErros = registros.reduce((acc, registro) => 
      acc + registro.erros.reduce((sum, erro) => sum + erro.quantidade, 0), 0);
    const ordensUnicas = new Set(registros.map(r => r.ordemProducao)).size;

    return {
      totalRegistros,
      operadoresUnicos,
      totalErros,
      ordensUnicas
    };
  }, [registros]);

  // Registros filtrados
  const registrosFiltrados = useMemo(() => {
    return registros.filter(registro => {
      const matchOperador = filtroOperador === "all" || 
        registro.operador.toLowerCase().includes(filtroOperador.toLowerCase());
      
      const matchOrdem = filtroOrdem === "" || 
        registro.ordemProducao.toLowerCase().includes(filtroOrdem.toLowerCase());
      
      const matchTipoErro = filtroTipoErro === "all" || 
        registro.erros.some(erro => erro.tipo === filtroTipoErro);
      
      const matchData = filtroData === "" || 
        registro.dataRegistro.includes(filtroData);

      return matchOperador && matchOrdem && matchTipoErro && matchData;
    });
  }, [registros, filtroOperador, filtroOrdem, filtroTipoErro, filtroData]);

  // Obter lista de operadores únicos
  const operadores = useMemo(() => {
    return Array.from(new Set(registros.map(r => r.operador))).sort();
  }, [registros]);

  // Obter lista de tipos de erros únicos
  const tiposErros = useMemo(() => {
    const tipos = new Set<string>();
    registros.forEach(registro => {
      registro.erros.forEach(erro => tipos.add(erro.tipo));
    });
    return Array.from(tipos).sort((a, b) => parseInt(a) - parseInt(b));
  }, [registros]);

  const exportarParaExcel = () => {
    // Preparar dados para exportação
    const dadosExportacao = registrosFiltrados.flatMap(registro => {
      if (registro.erros.length === 0) {
        return [{
          'Data/Hora': registro.dataRegistro,
          'Operador': registro.operador,
          'Ordem de Produção': registro.ordemProducao,
          'Tipo de Erro': 'Sem erros',
          'Quantidade': 0,
          'Total de Tipos de Erros': 0
        }];
      }
      
      return registro.erros.map(erro => ({
        'Data/Hora': registro.dataRegistro,
        'Operador': registro.operador,
        'Ordem de Produção': registro.ordemProducao,
        'Tipo de Erro': erro.tipo,
        'Quantidade': erro.quantidade,
        'Total de Tipos de Erros': registro.erros.length
      }));
    });

    // Converter para CSV (simulação de exportação Excel)
    const headers = Object.keys(dadosExportacao[0] || {});
    const csvContent = [
      headers.join(','),
      ...dadosExportacao.map(row => 
        headers.map(header => `"${row[header as keyof typeof row]}"`).join(',')
      )
    ].join('\n');

    // Criar e baixar arquivo
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `registros-erros-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const limparFiltros = () => {
    setFiltroOperador("all");
    setFiltroOrdem("");
    setFiltroTipoErro("all");
    setFiltroData("");
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <FileSpreadsheet className="w-6 h-6 text-purple-600" />
                <span>Dashboard Administrativo</span>
              </CardTitle>
              <CardDescription>
                Visualização e controle de todos os registros de erros de produção
              </CardDescription>
            </div>
            <Button onClick={onLogout} variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-50">
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-0">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total de Registros</p>
                <p className="text-2xl font-bold text-blue-600">{estatisticas.totalRegistros}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-0">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Operadores</p>
                <p className="text-2xl font-bold text-green-600">{estatisticas.operadoresUnicos}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-0">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Total de Erros</p>
                <p className="text-2xl font-bold text-red-600">{estatisticas.totalErros}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-0">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileSpreadsheet className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Ordens de Produção</p>
                <p className="text-2xl font-bold text-purple-600">{estatisticas.ordensUnicas}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Filtros</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="filtro-operador">Operador</Label>
              <Select value={filtroOperador} onValueChange={setFiltroOperador}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os operadores" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os operadores</SelectItem>
                  {operadores.map(operador => (
                    <SelectItem key={operador} value={operador}>{operador}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="filtro-ordem">Ordem de Produção</Label>
              <Input
                id="filtro-ordem"
                placeholder="Filtrar por OP..."
                value={filtroOrdem}
                onChange={(e) => setFiltroOrdem(e.target.value)}
                className="bg-white/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="filtro-tipo-erro">Tipo de Erro</Label>
              <Select value={filtroTipoErro} onValueChange={setFiltroTipoErro}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  {tiposErros.map(tipo => (
                    <SelectItem key={tipo} value={tipo}>Tipo {tipo}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="filtro-data">Data</Label>
              <Input
                id="filtro-data"
                placeholder="dd/mm/aaaa"
                value={filtroData}
                onChange={(e) => setFiltroData(e.target.value)}
                className="bg-white/50"
              />
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <Button variant="outline" onClick={limparFiltros}>
              Limpar Filtros
            </Button>
            <div className="flex items-center space-x-2">
              <Button onClick={exportarParaExcel} className="bg-green-600 hover:bg-green-700">
                <Download className="w-4 h-4 mr-2" />
                Exportar Excel ({registrosFiltrados.length} registros)
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Registros */}
      <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="w-5 h-5" />
            <span>Registros ({registrosFiltrados.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Operador</TableHead>
                  <TableHead>Ordem de Produção</TableHead>
                  <TableHead>Erros</TableHead>
                  <TableHead>Total de Erros</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {registrosFiltrados.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      Nenhum registro encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  registrosFiltrados.map((registro) => (
                    <TableRow key={registro.id}>
                      <TableCell className="font-mono text-sm">
                        {registro.dataRegistro}
                      </TableCell>
                      <TableCell className="font-medium">
                        {registro.operador}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                          {registro.ordemProducao}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {registro.erros.length === 0 ? (
                            <Badge variant="secondary" className="bg-green-100 text-green-700">
                              Sem erros
                            </Badge>
                          ) : (
                            registro.erros.map((erro) => (
                              <Badge key={erro.id} variant="destructive" className="text-xs">
                                Tipo {erro.tipo}: {erro.quantidade}
                              </Badge>
                            ))
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-bold text-lg">
                          {registro.erros.reduce((sum, erro) => sum + erro.quantidade, 0)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}