# 🚀 Inicio Rápido - RecipeShare

## ¡Tu aplicación está lista! 🎉

Esta es la guía más simple para empezar.

---

## 🎯 Dos Formas de Usar el Proyecto

### 1️⃣ Usar AHORA en Figma Make (Ya funciona)

✅ **No requiere instalación**
✅ **Ya está funcionando**
✅ **Solo navega y prueba**

La aplicación ya está corriendo en Figma Make mostrando las 12 recetas de ejemplo.

---

### 2️⃣ Usar como Proyecto Next.js Real (Recomendado)

Para tener el proyecto completo en tu computadora:

```bash
# 1. Descarga todos los archivos a una carpeta
# 2. Abre la terminal en esa carpeta
# 3. Ejecuta:

npm install
npm run dev

# 4. Abre tu navegador en:
http://localhost:3000
```

✅ **¡Eso es todo!** En 3 comandos tienes la app corriendo.

---

## 📂 Archivos Importantes

### Para Editar Contenido

| Archivo | Qué Hace | Para Qué Editarlo |
|---------|----------|-------------------|
| `RecipeCatalogue.tsx` | Datos de recetas | Agregar más recetas |
| `RecipeFilterPanel.tsx` | Filtros | Cambiar categorías |
| `Header.tsx` | Encabezado | Cambiar links de navegación |
| `Footer.tsx` | Pie de página | Cambiar info de contacto |
| `globals.css` | Estilos | Cambiar colores |

### Para Configuración Next.js

| Archivo | Qué Hace |
|---------|----------|
| `app/layout.tsx` | Layout y metadata |
| `app/page.tsx` | Página principal |
| `package.json` | Dependencias |
| `next.config.js` | Config de Next.js |

---

## 🎨 Personalización Rápida

### Cambiar Colores

Edita `/styles/globals.css`:

```css
:root {
  --primary: TU_COLOR_PRINCIPAL;
  --secondary: TU_COLOR_SECUNDARIO;
}
```

### Agregar Recetas

Edita `/components/RecipeCatalogue.tsx`:

```typescript
const MOCK_RECIPES: Recipe[] = [
  // ... recetas existentes
  {
    id: "13",
    title: "Tu Nueva Receta",
    // ... más campos
  }
];
```

### Cambiar Logo/Nombre

Edita `/components/Header.tsx` y `/components/Footer.tsx`:

```tsx
<span className="font-bold text-lg">TU_NOMBRE</span>
```

---

## 📖 Documentación Completa

| Archivo | Contenido |
|---------|-----------|
| `README.md` | Guía completa del proyecto |
| `INSTRUCCIONES.md` | Instrucciones detalladas |
| `COMO_USAR_NEXTJS.md` | Cómo ejecutar Next.js |
| `MIGRACION_COMPLETA.md` | Detalles técnicos |
| `INICIO_RAPIDO.md` | Esta guía rápida |

---

## ✅ Lo que Tienes

- ✅ 12 recetas de ejemplo
- ✅ Sistema de filtros (categorías, tiempo, dificultad)
- ✅ Ordenamiento (rating, tiempo, dificultad)
- ✅ Diseño responsive (mobile, tablet, desktop)
- ✅ Animaciones suaves
- ✅ Sistema de favoritos
- ✅ Header y Footer completos
- ✅ Estructura Next.js profesional

---

## 🎯 Próximos Pasos

1. **Hoy**: Explora la aplicación
2. **Esta semana**: Personaliza colores y contenido
3. **Próxima semana**: Agrega más recetas
4. **Este mes**: Conecta con backend (Supabase)
5. **Deploy**: Publica en Vercel

---

## ❓ Ayuda Rápida

### Error al instalar
```bash
# Limpia y reinstala
rm -rf node_modules package-lock.json
npm install
```

### Puerto 3000 ocupado
```bash
# Usa otro puerto
npm run dev -- -p 3001
```

### Imágenes no cargan
Verifica tu conexión a internet (las imágenes vienen de Unsplash)

---

## 🆘 ¿Necesitas Más Ayuda?

1. Lee `README.md` para visión general
2. Lee `INSTRUCCIONES.md` para detalles paso a paso
3. Lee `COMO_USAR_NEXTJS.md` para info técnica de Next.js
4. Lee `MIGRACION_COMPLETA.md` para entender todos los cambios

---

## 🎉 ¡Disfruta tu App!

Tu aplicación de recetas está **100% lista** para usar.

**RecipeShare** - Descubre y Comparte Recetas 👨‍🍳

---

*¿Preguntas? Revisa la documentación completa en los archivos .md* 📚
