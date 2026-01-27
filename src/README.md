# RecipeShare - Plataforma de Recetas 🍳

Una aplicación web moderna construida con Next.js para descubrir y compartir recetas increíbles de cocineros de todo el mundo.

## 🚀 Tecnologías

- **Next.js 14+** con App Router
- **React 18+**
- **TypeScript**
- **Tailwind CSS v4**
- **Motion (Framer Motion)** para animaciones
- **Lucide React** para iconos
- **Shadcn/ui** componentes de UI

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build

# Ejecutar en producción
npm start
```

## 🏗️ Estructura del Proyecto

```
/
├── app/
│   ├── layout.tsx      # Layout principal de Next.js
│   └── page.tsx        # Página de inicio
├── components/
│   ├── RecipeCard.tsx          # Tarjeta de receta individual
│   ├── RecipeCatalogue.tsx     # Catálogo principal con grid
│   ├── RecipeFilterPanel.tsx   # Panel de filtros laterales
│   ├── RecipeSortDropdown.tsx  # Dropdown de ordenamiento
│   ├── Header.tsx              # Encabezado con navegación
│   ├── Footer.tsx              # Pie de página
│   └── ui/                     # Componentes de UI reutilizables
├── styles/
│   └── globals.css     # Estilos globales y Tailwind
└── next.config.js      # Configuración de Next.js
```

## ✨ Características

### 🃏 Tarjetas de Receta (RecipeCard)
- Diseño de 300x400px con imagen destacada
- Efectos hover con escala y sombra
- Badges para recetas "Nuevas" y "Destacadas"
- Botón de favoritos (corazón) en esquina superior
- Información: autor, tiempo de cocción, dificultad, porciones
- Sistema de calificación con estrellas
- Tags de categorías
- Animaciones suaves con Motion

### 🔍 Panel de Filtros (RecipeFilterPanel)
- **Categorías**: Desayuno, Almuerzo, Cena, Postre, etc.
- **Tiempo de Cocción**: Slider de 0-180 minutos
- **Dificultad**: Fácil, Intermedio, Difícil
- **Calificación**: Filtro por rating mínimo
- **Porciones**: Slider de 1-12 personas
- Secciones colapsables con acordeón
- Contador de filtros activos
- Sticky positioning en desktop
- Animaciones de transición

### 🔽 Ordenamiento (RecipeSortDropdown)
- Más Relevantes (destacados primero)
- Mejor/Menor Calificadas
- Más Rápidas/Lentas
- Más Fáciles/Difíciles
- Más Recientes
- Iconos descriptivos
- Accesible con teclado

### 🧭 Header
- Logo de RecipeShare con ícono de chef
- Navegación principal (Inicio, Explorar, Destacados, Mis Recetas)
- Barra de búsqueda integrada
- Contador de recetas guardadas
- Botón de perfil de usuario
- Sticky al hacer scroll
- Menú hamburguesa en mobile

### 🦶 Footer
- Información de la empresa
- Enlaces rápidos
- Categorías principales
- Suscripción a newsletter
- Redes sociales
- Links legales
- Responsive con stacking en mobile

## 📱 Responsive Design

- **Mobile First**: Optimizado para dispositivos móviles
- **Breakpoints**:
  - Mobile: < 640px
  - Tablet: 640px - 1024px
  - Desktop: > 1024px
- Grid adaptativo: 1 columna (mobile) → 2 columnas (tablet) → 3 columnas (desktop)
- Panel de filtros lateral en desktop, drawer en mobile

## 🎨 UI/UX Enhancements

- **Animaciones**: Transiciones suaves con Motion
- **Hover Effects**: Escalado, sombras y overlays
- **Loading States**: Animaciones de entrada escalonadas
- **Empty States**: Mensaje cuando no hay resultados
- **Accessibility**: ARIA labels, navegación con teclado
- **Dark Mode Support**: Sistema de temas con Tailwind

## 🔄 Estado y Lógica

- Gestión de estado con React hooks (`useState`, `useMemo`)
- Filtrado reactivo en tiempo real
- Ordenamiento dinámico con múltiples criterios
- Optimización de rendimiento con `useMemo`
- Componentes "use client" para interactividad

## 📊 Datos Mock

El proyecto incluye 12 recetas de ejemplo que demuestran:
- Variedad de categorías (Desayuno, Almuerzo, Cena, Postre, etc.)
- Diferentes niveles de dificultad
- Rangos variados de tiempo de cocción
- Imágenes de alta calidad de Unsplash
- Calificaciones y reviews realistas

## 🚧 Próximos Pasos

Para convertir esto en una aplicación real, considera:

1. **Backend con Supabase**:
   - Autenticación de usuarios
   - Base de datos para recetas
   - Storage para imágenes
   - API para CRUD de recetas

2. **Funcionalidades Adicionales**:
   - Búsqueda por texto
   - Páginas de detalle de receta
   - Sistema de comentarios
   - Compartir en redes sociales
   - Crear y editar recetas propias
   - Lista de compras generada automáticamente

3. **Optimizaciones**:
   - Paginación o infinite scroll
   - Caché de datos
   - Optimización de imágenes con Next.js Image
   - SEO con metadatos dinámicos

## 📝 Notas

- Las imágenes provienen de Unsplash y son solo para demostración
- Los datos de recetas son mock data para propósitos de prototipado
- El proyecto usa Tailwind CSS v4 con la nueva sintaxis
- Compatible con las últimas versiones de Next.js y React

## 🤝 Contribuir

Este es un proyecto de demostración. Para usarlo en producción:
1. Reemplaza los datos mock con una API real
2. Implementa autenticación de usuarios
3. Agrega páginas de detalle de recetas
4. Configura variables de entorno
5. Optimiza para SEO y rendimiento

---

**Construido con ❤️ usando Next.js y React**
