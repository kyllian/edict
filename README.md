# Edict Solution

## Overview

Edict is a full-stack web search engine for Magic: the Gathering rules and glossary terms.

It is built with .NET Aspire for frontend/backend orchestration. The backend provides a robust Web API, data access, and search capabilities, while the frontend offers a responsive user interface.

### Solution Structure

- **Edict.Api**: .NET Web API project (OpenAPI, PostgreSQL, Elasticsearch, Scalar.AspNetCore)
- **Edict.AppHost**: Aspire orchestration host (entry point for Aspire dashboard and orchestration)
- **Edict.Application**: Business logic and application services
- **Edict.Domain**: Data models, entities, and database context
- **Edict.Migration**: Database migration utilities
- **Edict.ServiceDefaults**: Shared service configuration
- **app**: React frontend (Next.js, Tailwind CSS, DaisyUI, TypeScript)

## Getting Started

### Prerequisites
- [.NET 9 SDK](https://dotnet.microsoft.com/download)
- [Node.js 20+](https://nodejs.org/)
- [Aspire CLI](https://learn.microsoft.com/dotnet/aspire/overview) (for orchestration)

### Running with Aspire

1. **Start the Aspire Orchestration:**
   ```sh
   dotnet run --project Edict.AppHost
   ```
   This will launch the Aspire dashboard and orchestrate all backend services.

2. **Access the Aspire Dashboard:**
   - The dashboard will open automatically in your browser.
   - **Navigate to the `gateway` service** in the dashboard to access the Web API (serves as the API gateway).
   - The app is hosted at http://localhost:{gateway_port}/
   - The API is accessible at http://localhost:{gateway_port}/api
   - The API docs (scalar) is accessible at http://localhost:{gateway_port}/api/scalar

## License

See [LICENSE](LICENSE) for details.

