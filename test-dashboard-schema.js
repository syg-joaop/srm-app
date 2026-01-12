// Teste de validação do schema do dashboard
import { dashboardApiResponseSchema } from './src/layers/painel/schemas/dashboard.schema';
import { readFileSync } from 'fs';

// Ler resposta real da API
const apiResponse = JSON.parse(readFileSync('./resposta-painel.txt', 'utf-8'));

// Validar apenas o objeto data (como unwrapApiData faz)
const dataToValidate = apiResponse.data;

console.log('🔍 Validando schema do dashboard contra resposta real da API...\n');

const result = dashboardApiResponseSchema.safeParse(dataToValidate);

if (result.success) {
  console.log('✅ SUCESSO! Schema validado com sucesso.\n');
  console.log('📊 Resumo:');
  console.log(`  - Indicadores Dashboard: ${result.data.indicadoresDashboard.data.length} itens`);
  console.log(`  - Atendimentos Vencidos: ${result.data.atendimentosVencidos.data.length} itens`);
  console.log(`  - Ocorrências 12 Meses: ${result.data.ocorrencias12Meses.data.length} itens`);
  console.log(`  - Ocorrências 6 Meses: ${result.data.ocorrencias6Meses.data.length} itens`);
  console.log(`  - Aniversariantes Fornecedores: ${result.data.aniversariantesFornecedores.data.length} itens`);
  console.log(`  - Aniversariantes Contatos: ${result.data.aniversariantesContatos.data.length} itens`);
  console.log(`  - Atendentes: ${result.data.atendentes.data.length} itens`);
  console.log(`  - Meta Diária: ${result.data.metaDiaria.data.length} itens`);
  console.log(`  - Compras Mês: ${result.data.comprasMes.data.length} itens`);
  console.log(`  - Compras Comprador: ${result.data.comprasComprador.data.length} itens`);
  console.log(`  - Produtos Mais Comprados: ${result.data.prodsMaisCompradosMes.data.length} itens`);
  console.log(`  - Total Descontos: ${result.data.totalDescontos.data.length} itens`);
  process.exit(0);
} else {
  console.error('❌ FALHA na validação do schema!\n');
  console.error('Erros encontrados:\n');
  console.error(result.error.format());
  process.exit(1);
}
