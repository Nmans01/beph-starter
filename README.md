# 🥟 BEPH-Starter 🦊

A Web Application Template Powered by Bun + Elysia + Prisma + HTMX + Tailwind

## Getting Started

To get started with this template, clone this repo and run:

```bash
bun install
```

## Development

To start the development server run:

```bash
bun dev
```

Open http://localhost:3000/ with your browser to view the development server.

## Project Structure

- public/ - static assets
- src/
    - `main.ts` - Invokes the server
    - middleware/ 
        - `swaggerContrller.ts` - exposes OpenAPI docs
    - routes/ - Top-Level routes
        - `pageRoutes.ts` - "app router"
        - `apiRoutes.ts` - mounts module controllers
        - `staticRoutes.ts` - exposes routes to public directory
    - modules/ - Application-domain modules
        - common/
        - `[module]`/
            - `[module]Controller.ts` - dictates endpoints
            - `[module]Service.ts` - exposes useful functions to controller
            - `[module]Model.ts` - defines models/schema
            - `[module]Page.tsx` - home page for module
            - components/ - additional JSX components

