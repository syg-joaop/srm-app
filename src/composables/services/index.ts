/**
 * Services Composables - Serviços de domínio
 *
 * Serviços encapsulam lógica de comunicação com APIs.
 * Componentes devem usar serviços ao invés de chamar HTTP diretamente.
 *
 * @example
 * ```ts
 * // Criar um novo serviço:
 * // src/composables/services/useProdutoService.ts
 *
 * import { useBaseService } from "./useBaseService"
 * import { produtoSchema } from "~/schemas/domain/produto"
 *
 * export const useProdutoService = () => {
 *   const { client } = useBaseService()
 *
 *   const listProdutos = async () => {
 *     return client.get("/produtos", z.array(produtoSchema))
 *   }
 *
 *   return { listProdutos }
 * }
 * ```
 */

export * from "./useBaseService";
