# Proposta: Simplificar Schemas de Resposta com `createPaginatedSchema`

## Problema Atual
Todos os módulos (dashboard, fornecedores, prospectos, ocorrências, checkin) têm **código duplicado** para schemas de resposta:

```typescript
// ❌ CÓDIGO DUPLICADO EM CADA MÓDULO
export const xxxResponseSchema = z
  .object({
    status: z.number().optional(),
    code: z.number().optional(),
    message: z.string().optional(),
    suggestion: z.string().optional(),
    data: z.object({
      page: z.number().optional(),
      size: z.number().optional(),
      totalItems: z.number().optional(),
      totalPages: z.number().optional(),
      items: z.array(xxxSchema).default([]),
    }),
  })
  .passthrough();
```

## Solução: Usar `createPaginatedSchema` atualizado

```typescript
// ✅ CÓDIGO REUTILIZÁVEL
import { createPaginatedSchema } from "~/server/schemas/common.schema";

export const xxxResponseSchema = createPaginatedSchema(xxxSchema);
```

## Benefícios

1. **Menos código**: 15 linhas → 1 linha
2. **Manutenção centralizada**: Mudanças na estrutura da API afetam apenas 1 arquivo
3. **Consistência garantida**: Todos os módulos usam a mesma estrutura
4. **Type-safe**: TypeScript garante tipagem correta

## Exemplos de Refatoração

### 1. FORNECEDORES

**ANTES (código duplicado)**:
```typescript
// src/layers/fornecedores/schemas/fornecedores.schema.ts
export const fornecedorResponseSchema = z
  .object({
    status: z.number().optional(),
    code: z.number().optional(),
    message: z.string().optional(),
    suggestion: z.string().optional(),
    data: z.object({
      page: z.number().optional(),
      size: z.number().optional(),
      totalItems: z.number().optional(),
      totalPages: z.number().optional(),
      items: z.array(fornecedorSchema).default([]),
    }),
  })
  .passthrough();
```

**DEPOIS (código reutilizado)**:
```typescript
// src/layers/fornecedores/schemas/fornecedores.schema.ts
import { createPaginatedSchema } from "~/server/schemas/common.schema";

export const fornecedorResponseSchema = createPaginatedSchema(fornecedorSchema);
```

### 2. PROSPECTOS

**ANTES**:
```typescript
export const prospectoResponseSchema = z
  .object({
    status: z.coerce.number().optional(),
    code: z.number().optional(),
    message: z.string().optional(),
    suggestion: z.string().optional(),
    data: z.object({
      page: z.coerce.number().optional(),
      size: z.coerce.number().optional(),
      totalItems: z.coerce.number().optional(),
      totalPages: z.coerce.number().optional(),
      items: z.array(prospectoItemSchema).default([]),
    }),
  })
  .passthrough();
```

**DEPOIS**:
```typescript
import { createPaginatedSchema } from "~/server/schemas/common.schema";

export const prospectoResponseSchema = createPaginatedSchema(prospectoItemSchema);
```

### 3. OCORRÊNCIAS

**ANTES**:
```typescript
export const ocorrenciaResponseSchema = z
  .object({
    status: z.number().optional(),
    code: z.number().optional(),
    message: z.string().optional(),
    suggestion: z.string().optional(),
    data: z.object({
      page: z.number().optional(),
      size: z.number().optional(),
      totalItems: z.number().optional(),
      totalPages: z.number().optional(),
      items: z.array(ocorrenciaSchema).default([]),
    }),
  })
  .passthrough();
```

**DEPOIS**:
```typescript
import { createPaginatedSchema } from "~/server/schemas/common.schema";

export const ocorrenciaResponseSchema = createPaginatedSchema(ocorrenciaSchema);
```

### 4. CHECKIN

**ANTES**:
```typescript
export const checkinResponseSchema = z
  .object({
    status: z.number().optional(),
    code: z.number().optional(),
    message: z.string().optional(),
    suggestion: z.string().optional(),
    data: z.object({
      page: z.number().optional(),
      size: z.number().optional(),
      totalItems: z.number().optional(),
      totalPages: z.number().optional(),
      items: z.array(checkinSchema).default([]),
    }),
  })
  .passthrough();
```

**DEPOIS**:
```typescript
import { createPaginatedSchema } from "~/server/schemas/common.schema";

export const checkinResponseSchema = createPaginatedSchema(checkinSchema);
```

### 5. DASHBOARD

**ANTES**:
```typescript
export const dashboardResponseSchema = z
  .object({
    status: z.number().optional(),
    code: z.number().optional(),
    message: z.string().optional(),
    suggestion: z.string().optional(),
    data: z.object({
      page: z.number().optional(),
      size: z.number().optional(),
      totalItems: z.number().optional(),
      totalPages: z.number().optional(),
      items: z.array(metricSchema).default([]),
    }),
  })
  .passthrough();
```

**DEPOIS**:
```typescript
import { createPaginatedSchema } from "~/server/schemas/common.schema";

export const dashboardResponseSchema = createPaginatedSchema(metricSchema);
```

## Arquivos a Modificar

1. `src/layers/fornecedores/schemas/fornecedores.schema.ts`
2. `src/layers/prospectos/schemas/prospectos.schema.ts`
3. `src/layers/ocorrencias/schemas/ocorrencias.schema.ts`
4. `src/layers/checkin/schemas/checkin.schema.ts`
5. `src/layers/painel/schemas/dashboard.schema.ts`

## Validação

Após as mudanças, validar com:
```bash
npm run type-check
npm run build
```

## Resumo da Mudança no `common.schema.ts`

**ANTES**: Helper incompleto (sem `code` e `suggestion`)
```typescript
export function createPaginatedSchema<T extends z.ZodTypeAny>(itemSchema: T) {
  return z.object({
    status: z.coerce.number().optional(),      // ❌ coerce desnecessário
    message: z.string().optional(),
    success: z.boolean().optional(),           // ❌ não existe nas APIs
    data: z.object({
      page: z.coerce.number().optional(),      // ❌ coerce desnecessário
      size: z.coerce.number().optional(),      // ❌ coerce desnecessário
      totalItems: z.coerce.number().optional(), // ❌ coerce desnecessário
      totalPages: z.coerce.number().optional(), // ❌ coerce desnecessário
      items: z.array(itemSchema).default([]),
    }),
  }).passthrough();
}
```

**DEPOIS**: Helper completo e alinhado com APIs reais
```typescript
export function createPaginatedSchema<T extends z.ZodTypeAny>(itemSchema: T) {
  return z.object({
    status: z.number().optional(),             // ✅ sem coerce
    code: z.number().optional(),               // ✅ Campo real da API
    message: z.string().optional(),
    suggestion: z.string().optional(),         // ✅ Campo real da API
    data: z.object({
      page: z.number().optional(),             // ✅ sem coerce
      size: z.number().optional(),             // ✅ sem coerce
      totalItems: z.number().optional(),       // ✅ sem coerce
      totalPages: z.number().optional(),       // ✅ sem coerce
      items: z.array(itemSchema).default([]),
    }),
  }).passthrough();
}
```

## Próximos Passos

1. ✅ Atualizar `createPaginatedSchema` em `common.schema.ts` **JÁ FEITO**
2. ⏳ Refatorar schemas de resposta para usar o helper
3. ⏳ Validar TypeScript
4. ⏳ Testar aplicação

Deseja que eu prossiga com a refatoração dos schemas para usar `createPaginatedSchema`?
