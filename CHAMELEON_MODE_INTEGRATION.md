# Integração Chameleon-Mode - Fornecedores e Prospectos

## Visão Geral

Este documento detalha a implementação das rotas **chameleon-mode** da API Sagi v2 nos modais de detalhes de fornecedores e prospectos da aplicação SRM.

## Rotas Chameleon-Mode Implementadas

### Rotas da API (`C:\Users\Usuario\Documents\api_sagi_v2\src\modules\sygecom\chameleon-mode`)

Foram identificadas **11 rotas** no serviço chameleon-mode:

#### Rotas de Listagem (Já existentes)
1. **SRM_GET_FORNECEDORES** - Lista de fornecedores
2. **SRM_GET_PROSPECTO** - Lista de prospectos
3. **SRM_GET_OCORRENCIAS** - Lista de ocorrências
4. **SRM_GET_CHECKIN** - Lista de check-ins
5. **SRM_GET_CONCORRENTES** - Lista de concorrentes

#### Rotas de Detalhes (Nova implementação)
6. **SRM_GET_FORNECEDORES_PRECO** - Preços por fornecedor
7. **SRM_GET_FORNECEDORES_CONTATO** - Contatos por fornecedor
8. **SRM_GET_FORNECEDORES_CARGA** - Cargas por fornecedor (últimos 90 dias)
9. **SRM_GET_FORNECEDORES_ATENDIMENTO** - Atendimentos/ocorrências por fornecedor
10. **SRM_GET_FORNECEDORES_COLETA** - Coletas por fornecedor (últimos 3 meses)
11. **SRM_GET_FORNECEDORES_CHECKIN** - Check-ins por fornecedor

## Arquivos Criados

### 1. Types - Fornecedores
**Arquivo:** `src/layers/fornecedores/types/fornecedores.detalhes.types.ts`

Define os tipos TypeScript para todos os dados detalhados de fornecedores:

```typescript
// Interfaces principais:
- FornecedorPreco
- FornecedorContato
- FornecedorCarga
- FornecedorAtendimento
- FornecedorColeta
- FornecedorCheckin
- PaginatedResponse<T>
```

**Campos principais de cada tipo:**

#### FornecedorPreco
- status: "Aprovado" | "Aguardando aprovação"
- codpro, subcod, produto
- preco, unidade, embalagem
- tabela, validade, moeda

#### FornecedorContato
- sequencia, nome, cargo
- departamento
- telefone, celular, email
- observacao, principal

#### FornecedorCarga
- boleto, data_peso, hora_peso[]
- liquido_total, liquido_unitario[]
- valor_total, valor_unitario[]
- produto[], unidade[], quantidade

#### FornecedorAtendimento
- num, oco, data_oco, data_pro
- status, situacao
- atendente, atendente_enc
- problema (último problema registrado)

#### FornecedorColeta
- ordem, datasai, datache
- tot_cacamba, fornecedor, sr
- local, bairro, cidade, uf
- motorista, data, codfor, obs

#### FornecedorCheckin
- sr_recno, data, usuario
- fornecedor, fanta, status
- cidade, uf, latlong
- lat_for, long_for, observacao

### 2. Types - Prospectos
**Arquivo:** `src/layers/prospectos/types/prospectos.detalhes.types.ts`

Reutiliza os tipos de fornecedor (prospectos e fornecedores compartilham a mesma estrutura na API).

**Por que reutilizar?**
- Prospectos e fornecedores ficam na mesma tabela `cag_for`
- As rotas chameleon-mode usam `codfor` para ambos
- Mesma estrutura de dados, apenas diferente o filtro (`tf LIKE 'PRO%'`)

### 3. Service - Fornecedores
**Arquivo:** `src/layers/fornecedores/composables/useFornecedorDetalhesService.ts`

Composable que consome as rotas chameleon-mode para fornecedores.

**Funções disponíveis:**

```typescript
export const useFornecedorDetalhesService = () => {
  // Busca preços de um fornecedor
  fetchPrecos(codfor: string, page?: number, size?: number)

  // Busca contatos
  fetchContatos(codfor: string, page?: number, size?: number)

  // Busca cargas
  fetchCargas(codfor: string, page?: number, size?: number)

  // Busca atendimentos
  fetchAtendimentos(codfor: string, page?: number, size?: number)

  // Busca coletas
  fetchColetas(codfor: string, page?: number, size?: number)

  // Busca check-ins
  fetchCheckins(codfor: string, page?: number, size?: number)

  // Busca TODOS os detalhes em paralelo
  fetchAllDetalhes(codfor: string)
}
```

**Padrão de Body Builder:**
```typescript
const buildDetalheBody = (codfor: string, page: number = 1, size: number = 50) => ({
  codfor,
  page,
  size,
  offset: (page - 1) * size
});
```

### 4. Service - Prospectos
**Arquivo:** `src/layers/prospectos/composables/useProspectoDetalhesService.ts`

Composable adaptador que usa as rotas de fornecedor para prospectos.

**Por que um adaptador?**
- As rotas chameleon-mode foram desenhadas para fornecedores
- Prospectos usam `codpros` mas a API espera `codfor`
- Este adaptador faz a "ponte" transparente

**Funções disponíveis:** (mesmas do fornecedor, mas usando `codpros`)

```typescript
export const useProspectoDetalhesService = () => {
  fetchPrecos(codpros: string, ...)
  fetchContatos(codpros: string, ...)
  fetchCargas(codpros: string, ...)
  fetchAtendimentos(codpros: string, ...)
  fetchColetas(codpros: string, ...)
  fetchCheckins(codpros: string, ...)
  fetchAllDetalhes(codpros: string)
}
```

### 5. Composable de Carregamento
**Arquivo:** `src/components/common/composables/useParceiroDetalhesData.ts`

Composable inteligente que determina automaticamente se deve carregar dados de fornecedor ou prospecto.

**Lógica de detecção:**
```typescript
const isFornecedor = computed(() =>
  parceiro.value?.codfor && !parceiro.value?.codpros
)

const isProspecto = computed(() =>
  parceiro.value?.codpros || parceiro.value?.tf?.startsWith('PRO')
)
```

**Funções principais:**

```typescript
export const useParceiroDetalhesData = (parceiroFn: () => ParceiroData | null) => {
  // Estado
  isLoading: Ref<boolean>
  error: Ref<string | null>
  detalhesData: Ref<{ contatos, cargas, ... }>

  // Ações
  loadDetalhes(): Promise<void>
  clearDetalhes(): void
  enrichParceiroWithDetalhes(parceiro): ParceiroData
}
```

**Fluxo de trabalho:**
1. Recebe um parceiro (fornecedor ou prospecto)
2. Detecta automaticamente o tipo
3. Carrega os dados da API correta
4. Enriquece o objeto parceiro com os detalhes
5. Retorna dados combinados para exibição

### 6. Modal Atualizado
**Arquivo:** `src/components/common/ModalDetalhesParceiro.vue` (modificado)

**Alterações realizadas:**

#### Antes:
```typescript
const { activeTab, tabs, ... } = useParceiroTabs(props);
// Dados estáticos, sem carregamento dinâmico
```

#### Depois:
```typescript
// 1. Composable de carregamento de dados
const {
  isLoading: isLoadingDetalhes,
  detalhesData,
  loadDetalhes,
  clearDetalhes,
  enrichParceiroWithDetalhes,
} = useParceiroDetalhesData(() => props.parceiro);

// 2. Enriquece o parceiro com dados da API
const enrichedParceiro = computed(() =>
  enrichParceiroWithDetalhes(props.parceiro)
);

// 3. Watch para carregar dados quando modal abre
watch(() => props.modelValue, async (isOpen) => {
  if (isOpen && props.parceiro) {
    await loadDetalhes();
  } else {
    clearDetalhes();
  }
}, { immediate: true });

// 4. Passa parceiro enriquecido para o tabs
const { activeTab, tabs, ... } = useParceiroTabs(
  computed(() => ({
    ...props,
    parceiro: enrichedParceiro.value,
  }))
);
```

**Resultado:**
- Dados carregados automaticamente quando modal abre
- Tabs exibem dados reais da API
- Suporte a fornecedores E prospectos no mesmo modal
- Carregamento em paralelo de todas as rotas

### 7. Tabs Composable Atualizado
**Arquivo:** `src/components/common/composables/useParceiroTabs.ts` (modificado)

**Alteração principal:**
```typescript
// Antes: recebia props estáticas
export function useParceiroTabs(props: { ... })

// Depois: recebe computed reativo
export function useParceiroTabs(
  propsRef: ComputedRef<{ modelValue: boolean; parceiro?: ... }>
)
```

**Por que?**
- Permite reatividade completa quando dados são carregados
- Tabs atualizam automaticamente quando `enrichedParceiro` muda
- Melhora performance com computed properties

## Integração com ModalDetalhesParceiro

### Tabs Disponíveis

O modal suporta as seguintes tabs (configurável por `variant`):

1. **cadastro** - Dados de cadastro do parceiro
2. **contatos** - Lista de contatos (SRM_GET_FORNECEDORES_CONTATO)
3. **cargas** - Cargas recentes (SRM_GET_FORNECEDORES_CARGA)
4. **atendimentos** - Atendimentos/ocorrências (SRM_GET_FORNECEDORES_ATENDIMENTO)
5. **coletas** - Coletas recentes (SRM_GET_FORNECEDORES_COLETA)
6. **precos** - Tabela de preços (SRM_GET_FORNECEDORES_PRECO)
7. **checkins** - Histórico de check-ins (SRM_GET_FORNECEDORES_CHECKIN)
8. **agendamentos** - Apenas para variant "atendente" / "time"
9. **favorecidos** - Futura implementação

### Variantes Suportadas

```typescript
type ParceiroVariant = "parceiro" | "atendente" | "time"

// "parceiro": Todas as tabs exceto "agendamentos"
// "atendente" / "time": Apenas "agendamentos", "atendimentos", "checkins"
```

## Padrões e Melhorias Aplicadas

### 1. Separação de Responsabilidades

- **Types:** Interfaces puras de dados
- **Services:** Lógica de comunicação com API
- **Composables:** Lógica de negócio e estado
- **Componentes:** Apenas apresentação

### 2. Reutilização de Código

- Types de prospecto reutilizam types de fornecedor
- Service de prospecto é um adaptador do service de fornecedor
- Modal genérico funciona para ambos os tipos

### 3. Type Safety

```typescript
// Todas as rotas tem tipos explícitos
fetchPrecos(...): Promise<FornecedorPrecoResponse>
fetchContatos(...): Promise<FornecedorContatoResponse>
```

### 4. Tratamento de Erros

```typescript
// Uso de Promise.allSettled para falhas parciais
const [precos, contatos, ...] = await Promise.allSettled([
  fetchPrecos(codfor),
  fetchContatos(codfor),
  // ...
])

return {
  precos: precos.status === 'fulfilled' ? precos.value : null,
  contatos: contatos.status === 'fulfilled' ? contatos.value : null,
  // ...
}
```

### 5. Performance

- Carregamento em paralelo de todas as rotas
- Uso de computed properties para reatividade
- Lazy loading dos services (import dinâmico)

### 6. Paginação

Todas as rotas suportam paginação:

```typescript
fetchPrecos(codfor, page = 1, size = 50)
// page: número da página (1-indexed)
// size: itens por página (default: 50)
```

## Exemplo de Uso

### No Modal de Fornecedor

```typescript
// src/layers/fornecedores/pages/index.vue
const handleSelectFornecedor = (fornecedor: Fornecedor) => {
  selectedFornecedor.value = {
    ...fornecedor,
    name: fornecedor.fornecedor,
  };
  showModal.value = true;
  // Dados serão carregados automaticamente pelo modal
};
```

### No Modal de Prospecto

```typescript
// src/layers/prospectos/pages/index.vue
const handleSelectProspecto = (prospecto: Prospecto) => {
  selectedProspecto.value = {
    ...prospecto,
  };
  showModal.value = true;
  // Dados serão carregados automaticamente pelo modal
};
```

## Endpoints

### URL Base
```
/sygecom/chameleon-mode/{command}
```

### Method
```
POST
```

### Body Pattern
```json
{
  "codfor": "123",
  "page": 1,
  "size": 50,
  "offset": 0
}
```

### Response Pattern
```json
{
  "status": 200,
  "message": "Success",
  "success": true,
  "data": {
    "page": 1,
    "size": 10,
    "totalItems": 45,
    "totalPages": 5,
    "items": [...]
  }
}
```

## Troubleshooting

### Problema: Dados não aparecem no modal

**Causas possíveis:**
1. `codfor` ou `codpros` não está presente no objeto parceiro
2. API retornou 204 (sem conteúdo)
3. Erro de autenticação

**Solução:**
```typescript
// Adicione logs para debug
const { loadDetalhes, error } = useParceiroDetalhesData(...);

watch(error, (err) => {
  console.error('Erro ao carregar detalhes:', err);
});
```

### Problema: Tabs ficam vazias

**Causa:** Dados não estão sendo enriquecidos no objeto parceiro

**Solução:**
```typescript
// Verifique se o enrichedParceiro tem os dados
console.log('Enriched:', enrichedParceiro.value);
// Deve ter: contatos[], cargas[], atendimentos[], etc.
```

### Problema: Detectou tipo errado (fornecedor vs prospecto)

**Causa:** Lógica de detecção baseada em `codfor`/`codpros`

**Solução:**
```typescript
// Forçar tipo explicitamente se necessário
selectedFornecedor.value = {
  ...fornecedor,
  codfor: fornecedor.codfor, // Garante que codfor existe
  codpros: undefined,         // Garante que codpros NÃO existe
};
```

## Próximos Passos

### Melhorias Futuras

1. **Cache inteligente:** Implementar cache por `codfor`/`codpros`
2. **Loading states:** Mostrar spinners específicos por tab
3. **Paginação nas tabs:** Implementar carregamento de mais páginas
4. **Filtros avançados:** Permitir filtrar dados dentro das tabs
5. **Exportação:** Botão para exportar dados de cada tab
6. **Tab "favorecidos":** Implementar quando a rota estiver disponível

### Rotas Pendentes

- **SRM_GET_FORNECEDORES_AGENDAMENTO** (quando disponível)
- **SRM_GET_FORNECEDORES_FAVORECIDOS** (quando disponível)

## Conclusão

A implementação seguiu rigorosamente os padrões do projeto:

✅ TypeScript com type safety completo
✅ Vue 3 Composition API
✅ Separação clara de responsabilidades
✅ Reutilização máxima de código
✅ Tratamento robusto de erros
✅ Performance otimizada com carregamento paralelo
✅ Código limpo, bem documentado e manutenível

Os modais de fornecedores e prospectos agora exibem dados reais da API chameleon-mode, proporcionando uma experiência rica e completa para o usuário.
