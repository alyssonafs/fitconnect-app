## 1. Introdução

### Nome do Projeto

**FitConnect** - Sistema de Gestão de Treinos para Personal Trainers e Alunos

### Breve Descrição e Motivação

O FitConnect é uma plataforma digital que conecta personal trainers e alunos, digitalizando a gestão de treinos. Ele resolve o problema da ineficiência de métodos analógicos, oferecendo uma solução moderna e intuitiva para criação, personalização e acompanhamento de programas de exercícios. O sistema visa otimizar o trabalho dos profissionais e melhorar a experiência dos alunos, promovendo saúde e bem-estar.

A motivação para o projeto surgiu da necessidade de aplicar conhecimentos em C# e desenvolvimento web para suprir a carência de ferramentas digitais no mercado fitness brasileiro. O FitConnect demonstra a aplicação de arquitetura de software avançada, integração com inteligência artificial (Google Gemini) para geração de treinos, e otimização de banco de dados com stored procedures.



## 2. Tecnologias Utilizadas

O FitConnect foi desenvolvido com foco em performance, escalabilidade e manutenibilidade, utilizando as seguintes tecnologias:

*   **Backend:** C# (.NET 6) com ASP.NET Core para a API RESTful, utilizando Entity Framework Core para acesso a dados e Microsoft SQL Server como banco de dados. A integração com o Google Gemini AI é fundamental para a funcionalidade de geração de treinos por inteligência artificial.

*   **Frontend:** React 18 com JavaScript (ES6+) para a interface do usuário, utilizando React Router para navegação e Axios para comunicação com a API.

*   **Ferramentas:** Visual Studio 2022, Visual Studio Code, Git, Postman e SQL Server Management Studio.



## 3. Visão Geral do Sistema / Arquitetura

A arquitetura do FitConnect é dividida em três camadas principais, comunicando-se via API RESTful:

*   **Frontend (React):** Interface do usuário, responsável pela interação e apresentação dos dados.
*   **Backend (ASP.NET Core):** Lógica de negócio, autenticação, autorização e comunicação com o banco de dados e serviços externos. Segue princípios de Arquitetura em Camadas.
*   **Banco de Dados (SQL Server):** Persistência de dados, utilizando Entity Framework Core e stored procedures para otimização de consultas.

Uma característica chave é a integração com o **Google Gemini AI** no backend para a geração inteligente de treinos, e o uso de **stored procedures** no SQL Server para otimizar a busca e filtragem de treinos, garantindo alta performance.



## 4. Funcionalidades Principais

O FitConnect oferece as seguintes funcionalidades essenciais:

*   **Cadastro e Autenticação:** Permite o registro e login seguro de personal trainers e alunos.
*   **Criação e Gestão de Treinos:** Personal trainers podem criar treinos personalizados, adicionar exercícios e definir detalhes como séries e repetições.
*   **Geração de Treinos por IA:** Uma funcionalidade inovadora que permite gerar treinos automaticamente com base em dados do aluno (peso, altura, idade, IMC, grupos musculares, objetivo) utilizando o Google Gemini AI.
*   **Visualização de Treinos:** Alunos acessam seus treinos de forma clara e detalhada, com vídeos explicativos para cada exercício.
*   **Compartilhamento de Treinos:** Personal trainers podem compartilhar treinos específicos com seus alunos.
*   **Busca Otimizada:** Funcionalidade de busca e filtro de treinos otimizada por stored procedures no banco de dados, garantindo rapidez e eficiência.
*   **Dashboards:** Painéis personalizados para personal trainers (gerenciamento de alunos e treinos) e alunos (visualização de treinos).



## 5. Configuração do Ambiente

Para configurar o ambiente de desenvolvimento do FitConnect, são necessários:

*   **Software:** .NET SDK 6.0, Node.js (LTS), Microsoft SQL Server, Visual Studio 2022, Visual Studio Code, Git, Postman, SSMS.
*   **Hardware:** Processador i5 (8ª Gen+), 8GB RAM (16GB recomendado), 256GB SSD (512GB recomendado).

**Passos Essenciais:**

1.  Clonar o repositório do projeto.
2.  Configurar a string de conexão do SQL Server no `appsettings.json` do backend e executar as migrações do Entity Framework Core (`dotnet ef database update`).
3.  Configurar a chave da API do Google Gemini e as chaves JWT no `appsettings.json` do backend.
4.  Instalar as dependências do frontend (`npm install`) e verificar a URL da API no `src/services/client.js`.



## 6. Desenvolvimento (Estrutura)

O projeto é dividido em backend (C#) e frontend (React), cada um com sua estrutura organizada:

*   **Backend (`FitconnectAPI`):** Solução .NET com projetos separados por camadas (API, Aplicação, Domínio, Repositório, Serviços Externos), seguindo Clean Architecture para modularidade e testabilidade.
*   **Frontend (`src`):** Aplicação React com pastas para páginas, componentes reutilizáveis, serviços de comunicação com a API e recursos estáticos, promovendo modularidade e reuso.



## 7. API

A API RESTful do FitConnect, desenvolvida em ASP.NET Core, é o ponto central de comunicação. Ela expõe endpoints para gerenciamento de usuários, treinos, exercícios e compartilhamentos. A documentação interativa é gerada automaticamente via Swagger/OpenAPI, acessível em `http://localhost:5000/swagger` (ou porta configurada).

**Principais Endpoints:**

*   `/api/auth/login`: Autenticação de usuários (POST).
*   `/api/usuarios`: Criação e gestão de usuários (POST, PUT, GET).
*   `/api/treinos`: Criação, listagem e detalhes de treinos (POST, GET).
*   `/api/treinos/gerar-ia`: Geração de treinos por IA (POST).
*   `/api/exercicios`: Listagem e detalhes de exercícios (GET).
*   `/api/treinos-compartilhados`: Compartilhamento de treinos (POST, GET).



## 8. Conclusão e Próximos Passos

O FitConnect é uma solução robusta e inovadora para a gestão de treinos, demonstrando a aplicação de tecnologias modernas e boas práticas de desenvolvimento. Ele otimiza o trabalho de personal trainers e enriquece a experiência dos alunos, com destaque para a geração de treinos por IA e a otimização de buscas.

**Melhorias Futuras:**

*   Integração com YouTube API para vídeos de exercícios.
*   Módulo de pagamentos e assinaturas.
*   Acompanhamento de progresso do aluno.
*   Chat e comunicação interna.
*   Desenvolvimento de aplicativo móvel nativo.


