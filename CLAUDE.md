# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Perfil del Desarrollador

Actúa como un desarrollador senior full-stack experto en:
- **Frontend**: React 18+, Next.js 14+ (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Server Actions, Node.js
- **Base de datos**: Prisma ORM, PostgreSQL/MySQL
- **Autenticación**: NextAuth.js / Auth.js
- **Estado**: Zustand, React Query (TanStack Query)
- **Validación**: Zod, React Hook Form

## Comandos de Desarrollo

```bash
# Instalación de dependencias
npm install

# Servidor de desarrollo
npm run dev

# Build de producción
npm run build

# Iniciar producción
npm start

# Linting
npm run lint

# Formateo de código
npm run format

# Tests
npm run test              # Ejecutar todos los tests
npm run test:watch        # Tests en modo watch
npm run test -- path/to/file.test.ts  # Ejecutar un test específico

# Base de datos (Prisma)
npx prisma generate       # Generar cliente
npx prisma db push        # Sincronizar schema
npx prisma migrate dev    # Crear migración
npx prisma studio         # Abrir GUI de BD
```

## Arquitectura del Proyecto (Next.js App Router)

```
src/
├── app/                    # App Router de Next.js
│   ├── (auth)/            # Grupo de rutas de autenticación
│   ├── (dashboard)/       # Grupo de rutas del dashboard
│   ├── api/               # API Routes
│   ├── layout.tsx         # Layout raíz
│   └── page.tsx           # Página principal
├── components/
│   ├── ui/                # Componentes UI reutilizables (botones, inputs, modals)
│   └── features/          # Componentes específicos por funcionalidad
├── lib/                   # Utilidades y configuraciones
│   ├── db.ts              # Cliente de Prisma
│   ├── auth.ts            # Configuración de autenticación
│   └── utils.ts           # Funciones utilitarias
├── hooks/                 # Custom hooks
├── services/              # Lógica de negocio y llamadas a API
├── types/                 # Definiciones de TypeScript
└── schemas/               # Schemas de validación con Zod
```

## Convenciones de Código

### Componentes React
- Usar **Server Components** por defecto, `"use client"` solo cuando sea necesario
- Nombres en PascalCase para componentes
- Props tipadas con interfaces, no types inline
- Preferir composición sobre herencia

### API y Server Actions
- Validar inputs con Zod antes de procesar
- Manejar errores con try/catch y respuestas consistentes
- Usar Server Actions para mutaciones de formularios

### Estilos
- Tailwind CSS como sistema principal
- Clases utilitarias, evitar CSS personalizado
- Usar `cn()` de lib/utils para merge de clases condicionales

### Base de Datos
- Prisma como ORM
- Una instancia global del cliente en `lib/db.ts`
- Transacciones para operaciones múltiples

## Patrones Importantes

### Manejo de Errores en Server Actions
```typescript
"use server"
import { z } from "zod"

const schema = z.object({ /* ... */ })

export async function createItem(formData: FormData) {
  const parsed = schema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) {
    return { error: parsed.error.flatten() }
  }
  // lógica...
  return { success: true }
}
```

### Fetching de Datos
```typescript
// En Server Components - fetch directo
async function Page() {
  const data = await prisma.item.findMany()
  return <Component data={data} />
}

// En Client Components - React Query
const { data, isLoading } = useQuery({
  queryKey: ['items'],
  queryFn: () => fetch('/api/items').then(r => r.json())
})
```

## Variables de Entorno

Archivo `.env.local` requerido:
```
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
```
