# AdotaJP — Frontend (`adotaJP-front`)

Primeiro vou apresentar o front-end da aplicação. No front end eu optei pelas seguintes tecnologias:
- **React:** Componentes funcionais e construir uma aplicação de pagina única eficiente.
- **TypeScript:** Tipagem estática para ajudar no desenvolvimento.
- **Vite:** Ferramenta de build moderna.
- **Tailwind CSS v4:** Estilização de forma ágil.
- **Lucide React:** Ícones vetoriais modernos e leves.

## 3. Estrutura do Projeto (Clean Code & KISS)

```
src/
├── api/ (Comunicação com o Backend)
│   ├── client.ts             # Cliente HTTP (fetch, baseURL, injeção de JWT e helper de imagens)
│   ├── auth.api.ts           # Login, Cadastro e Perfil (/auth e /users/me)
│   ├── animal.api.ts         # Listagem, Criação (multipart), Renovação e Adoção (/animal-posts)
│   └── favorites.api.ts      # Adicionar, remover e listar favoritos (/users/me/favorites)
├── context/ (Estado Global)
│   └── AuthContext.tsx       # Estado global de autenticação e favoritos com atualização otimista
├── constants/ (Define `SPECIES_OPTIONS`, restringindo as espécies cadastráveis e filtráveis apenas a animais domésticos permitidos de acordo com o IBAMA que é um requisito funcional) 
│   └── species.ts            # Opções padronizadas de espécies (Cachorro, Gato, Ave, Outro)
├── components/ (Componentes e Modais)
│   ├── Navbar.tsx            # Barra superior (Logo, Links, Clínicas Veterinárias, Doar, Login/Perfil)
│   ├── Footer.tsx            # Rodapé institucional (UNINTER, João Pessoa, ODS 15)
│   ├── AnimalCard.tsx        # Card do animal com badges, foto, favoritar e botão Quero Adotar
│   ├── AdoptModal.tsx        # Modal de contato direto com o tutor (WhatsApp e E-mail sem login obrigatório)
│   ├── VeterinaryModal.tsx   # Modal de busca rápida de clínicas veterinárias em João Pessoa (Google Maps)
│   ├── AuthModal.tsx         # Modal com abas de Login e Cadastro completo
│   └── ExpirationBadge.tsx   # Badge dos 3 estados (Disponível, Pausada por 30d, Adotada)
├── pages/ (Telas da Aplicação)
│   ├── HomePage.tsx          # Catálogo público, Hero, busca e filtro por espécie
│   ├── MyPostsPage.tsx       # Gestão dos animais do usuário com botões de Renovar (+30d) e Adotar
│   ├── FavoritesPage.tsx     # Lista dos animais favoritados
│   ├── CreateAnimalPage.tsx  # Formulário de publicação com preview de 1 foto
│   └── ProfilePage.tsx       # Visualização e atualização de celular e endereço (RF11)
├── types/
│   └── index.ts              # Interfaces e tipos TypeScript compartilhados
├── App.tsx                   # Roteamento e orquestração de páginas e modais
├── index.css                 # Configuração do Tailwind CSS e variáveis de cores da marca
└── main.tsx                  # Ponto de entrada React DOM
```

---

## 4. Mapeamento dos Requisitos da UNINTER

| Requisito | Descrição | Onde está implementado |
| :--- | :--- | :--- |
| **RF01 & RF02** | Cadastro e Login de Usuários com JWT | `AuthModal.tsx` + `AuthContext.tsx` |
| **RF03** | Filtro de postagens por espécie de animal | `HomePage.tsx` com `SPECIES_OPTIONS` (`species.ts`) |
| **RF04** | Criar postagem de animal com upload de foto | `CreateAnimalPage.tsx` (multipart/form-data) |
| **RF05** | Listagem pública com dados do animal e contato do responsável | `HomePage.tsx` + `AnimalCard.tsx` + `AdoptModal.tsx` |
| **RF06** | Visualizar todas as postagens criadas pelo usuário | `MyPostsPage.tsx` |
| **RF07** | Desativação após 30 dias com botão de renovar | `ExpirationBadge.tsx` + botão "Renovar (+30d)" em `MyPostsPage.tsx` |
| **RF08** | Direcionar usuário para mapa de clínicas veterinárias próximas | `VeterinaryModal.tsx` (integração direta com Google Maps) |
| **RF09** | Lista de favoritos em aba dedicada | `FavoritesPage.tsx` + coração em `AnimalCard.tsx` |
| **RF10** | Marcar animal como adotado | Botão "Já foi Adotado" em `MyPostsPage.tsx` |
| **RF11** | Atualização de número de celular e localização | `ProfilePage.tsx` |
| **RF12** | Atualização de dados da postagem | Suporte via `animal.api.ts` |
| **RNF01-08** | React + Tailwind, Segurança JWT, Usabilidade simples e fauna doméstica IBAMA | Todo o projeto |

* **Usabilidade e Inclusão Digital:** Interface limpa, totalmente em português (incluindo tradução automática de erros de rede do navegador em `src/api/client.ts`), com feedbacks visuais claros de carregamento, erro e sucesso, e contato facilitado via WhatsApp com um clique.
* **Responsividade:** Layout adaptável para celulares, tablets e computadores utilizando utilitários responsivos do Tailwind CSS e menu mobile dedicado na `Navbar`.
* **Segurança e Controle de Acesso:** Proteção das áreas restritas (`Meus Favoritos`, `Minhas Postagens`, `Quero Doar Animal`, `Meu Perfil`), higienização de sessão em caso de token expirado (`AuthContext.tsx`) e envio autenticado via JWT.
* **Conformidade Legal (Fauna Doméstica):** Restrição estrita das espécies disponíveis para cadastro e filtro (`src/constants/species.ts`), evitando o anúncio de animais silvestres.