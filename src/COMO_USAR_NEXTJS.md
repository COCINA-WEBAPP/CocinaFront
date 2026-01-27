# 🚀 Cómo Usar Este Proyecto como Next.js Real

## Situación Actual

Tu proyecto ahora tiene **dos formas de funcionar**:

### 1. En Figma Make (Actual) ✅
- Usa `/App.tsx` como punto de entrada
- Funciona inmediatamente sin instalación
- Ideal para prototipado rápido

### 2. Como Proyecto Next.js Real 🎯
- Usa `/app/page.tsx` y `/app/layout.tsx`
- Requiere instalación con npm
- Ideal para producción y deploy

---

## 🎯 Opción Recomendada: Proyecto Next.js Real

Para tener el equivalente exacto a `npx create-next-app@latest`, sigue estos pasos:

### Paso 1: Descarga el Proyecto

Descarga todos los archivos de Figma Make a tu computadora en una carpeta, por ejemplo:
```
/tu-computadora/RecipeShare/
```

### Paso 2: Abre la Terminal

```bash
# En Mac/Linux
cd /ruta/a/RecipeShare

# En Windows
cd C:\ruta\a\RecipeShare
```

### Paso 3: Instala Node.js

Si no tienes Node.js instalado:
1. Ve a https://nodejs.org
2. Descarga la versión LTS (recomendada)
3. Instala siguiendo el wizard
4. Verifica la instalación:
```bash
node --version
# Debería mostrar algo como: v20.x.x
```

### Paso 4: Instala las Dependencias

```bash
npm install
```

Esto instalará todas las librerías necesarias:
- Next.js
- React
- Tailwind CSS
- Motion (Framer Motion)
- Lucide Icons
- Shadcn/ui components
- Y más...

### Paso 5: Ejecuta el Servidor de Desarrollo

```bash
npm run dev
```

Deberías ver algo como:
```
▲ Next.js 14.2.0
- Local:        http://localhost:3000
- Ready in 2.5s
```

### Paso 6: Abre en el Navegador

Ve a: **http://localhost:3000**

¡Y listo! Tu aplicación estará corriendo como un proyecto Next.js real. 🎉

---

## 📦 Scripts Disponibles

```bash
# Desarrollo (con hot reload)
npm run dev

# Construir para producción
npm run build

# Ejecutar versión de producción
npm start

# Verificar errores de código
npm run lint
```

---

## 🌐 Deploy a Producción

### Opción 1: Vercel (Recomendado para Next.js)

1. Crea cuenta en https://vercel.com
2. Instala Vercel CLI:
```bash
npm install -g vercel
```

3. Deploy:
```bash
vercel
```

4. Sigue las instrucciones en pantalla
5. Tu app estará en: `https://tu-proyecto.vercel.app`

### Opción 2: Netlify

1. Crea cuenta en https://netlify.com
2. Conecta tu repositorio de GitHub
3. Configura:
   - Build command: `npm run build`
   - Publish directory: `.next`
4. Deploy automático en cada push

### Opción 3: Otros

- **AWS Amplify**: Para infraestructura Amazon
- **Digital Ocean**: Para VPS personalizado
- **Railway**: Para deploy rápido
- **Render**: Alternativa a Heroku

---

## 🔧 Diferencias entre Figma Make y Next.js Real

| Característica | Figma Make | Next.js Real |
|----------------|------------|--------------|
| **Punto de entrada** | `/App.tsx` | `/app/page.tsx` |
| **Instalación** | No requiere | `npm install` |
| **Hot Reload** | Automático | `npm run dev` |
| **Build** | Manejado por Figma | `npm run build` |
| **Deploy** | En Figma | Vercel, Netlify, etc. |
| **Backend** | Supabase integrado | Supabase o cualquier backend |
| **Imágenes** | Cualquier URL | Optimizado con `next/image` |
| **Routing** | Una sola página | Multi-página con `/app/*` |
| **SEO** | Limitado | Completo con metadata |
| **Performance** | Bueno | Optimizado con SSR/ISR |

---

## 🆕 Agregar Nuevas Páginas

En un proyecto Next.js real, puedes agregar fácilmente nuevas páginas:

### Ejemplo: Página de Detalle de Receta

Crea `/app/recetas/[id]/page.tsx`:
```tsx
export default function RecipeDetailPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1>Receta #{params.id}</h1>
      {/* Contenido de la receta */}
    </div>
  );
}
```

Acceso en: `http://localhost:3000/recetas/1`

### Ejemplo: Página de Perfil

Crea `/app/perfil/page.tsx`:
```tsx
export default function ProfilePage() {
  return (
    <div>
      <h1>Mi Perfil</h1>
      {/* Contenido del perfil */}
    </div>
  );
}
```

Acceso en: `http://localhost:3000/perfil`

---

## 🔄 Estructura de Next.js vs React SPA

### React SPA (Como Figma Make)
```
/App.tsx
  └─ Toda la lógica de routing manualmente
  └─ Una sola página HTML
  └─ Client-side rendering
```

### Next.js App Router
```
/app/
  ├─ layout.tsx        (Layout global)
  ├─ page.tsx          (Home /)
  ├─ recetas/
  │  └─ [id]/
  │     └─ page.tsx    (Detalle /recetas/123)
  └─ perfil/
     └─ page.tsx       (Perfil /perfil)
```

**Ventajas:**
- ✅ Routing automático basado en carpetas
- ✅ Cada página se carga independientemente
- ✅ SEO mejorado
- ✅ Performance optimizado
- ✅ Server-side rendering

---

## 💻 Comandos Útiles para Desarrollo

```bash
# Limpiar cache y reinstalar
rm -rf node_modules .next package-lock.json
npm install

# Ver todos los archivos del proyecto
ls -la

# Buscar errores de TypeScript
npx tsc --noEmit

# Formatear código
npx prettier --write .

# Analizar bundle size
npm run build
npm run analyze  # (requiere configuración adicional)
```

---

## 🐳 Docker (Opcional)

Si quieres containerizar tu app:

Crea `Dockerfile`:
```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Ejecuta:
```bash
docker build -t recipeshare .
docker run -p 3000:3000 recipeshare
```

---

## 📊 Comparación: `npx create-next-app` vs Este Proyecto

### Este Proyecto ✅
```
✅ Estructura completa de Next.js
✅ Componentes pre-diseñados
✅ Sistema de diseño implementado
✅ 12 recetas de ejemplo
✅ Filtros y ordenamiento funcionales
✅ Responsive design completo
✅ Animaciones implementadas
✅ TypeScript configurado
✅ Tailwind CSS v4
✅ Listo para usar
```

### `npx create-next-app` (proyecto vacío)
```
❌ Solo estructura básica
❌ Una página vacía
❌ Sin componentes
❌ Sin datos de ejemplo
❌ Sin diseño
❌ Requiere configurar todo manualmente
```

**Conclusión:** Este proyecto está **mucho más avanzado** que un `create-next-app` básico. ¡Ya tienes una aplicación completa y funcional! 🎉

---

## 🎓 Recursos para Aprender Más

- **Next.js Docs**: https://nextjs.org/docs
- **React Docs**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com
- **TypeScript**: https://www.typescriptlang.org
- **Motion**: https://motion.dev

---

## ❓ FAQ

### ¿Puedo usar este proyecto en producción?
✅ Sí! Solo necesitas:
1. Reemplazar datos mock con una API real
2. Implementar autenticación
3. Configurar variables de entorno
4. Deploy en Vercel o similar

### ¿Necesito saber Next.js para usarlo?
No necesariamente. El proyecto funciona out-of-the-box. Pero aprender Next.js te ayudará a agregar más features.

### ¿Cuál es la diferencia con el proyecto anterior?
Antes era un catálogo de productos e-commerce. Ahora es una plataforma de recetas con las mismas características técnicas.

### ¿Puedo volver a e-commerce?
Sí, pero necesitarías cambiar:
- RecipeCard → ProductCard
- RecipeCatalogue → ProductCatalogue
- Filtros de recetas → Filtros de productos
- Mock data de recetas → Mock data de productos

### ¿Funciona sin internet?
No, requiere conexión para:
- Cargar imágenes de Unsplash
- Instalar dependencias con npm
- Deploy en servicios cloud

---

## 🎯 Próximos Pasos Recomendados

1. **Hoy**: Ejecuta `npm run dev` y explora la app
2. **Esta semana**: Personaliza colores y agrega más recetas
3. **Este mes**: Implementa backend con Supabase
4. **Próximo mes**: Deploy a producción en Vercel

---

**¡Disfruta tu nueva aplicación de recetas con Next.js!** 👨‍🍳🚀

---

*Última actualización: Enero 2026*
