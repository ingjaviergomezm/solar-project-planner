# 🚀 Guía de Despliegue en GitHub Pages

## ✅ Cambios Realizados

He realizado las siguientes correcciones para solucionar el problema de la página en blanco:

1. ✅ Actualicé `vite.config.js` con `base: '/solar-project-planner/'`
2. ✅ Agregué archivo `.nojekyll` en la carpeta `public/`
3. ✅ Creé el workflow de GitHub Actions en `.github/workflows/deploy.yml`
4. ✅ Reconstruí el proyecto con `npm run build`

## 📋 Pasos para Desplegar en GitHub

### Opción 1: Despliegue Automático con GitHub Actions (Recomendado)

Si ya tienes un repositorio en GitHub, sigue estos pasos:

#### 1️⃣ Subir los cambios a GitHub

```bash
# Navega a la carpeta del proyecto
cd "C:\Users\Usuario\OneDrive\Documentos\Solar Project Planner\solar-app"

# Inicializar Git (si no está inicializado)
git init

# Agregar todos los archivos
git add .

# Hacer commit
git commit -m "Fix: Configurar base URL para GitHub Pages"

# Conectar con tu repositorio remoto (si no está conectado)
git remote add origin https://github.com/ingjaviergomezm/solar-project-planner.git

# Subir a GitHub
git push -u origin main
```

#### 2️⃣ Configurar GitHub Pages

1. Ve a tu repositorio en GitHub: `https://github.com/ingjaviergomezm/solar-project-planner`
2. Haz clic en **Settings** (Configuración)
3. En el menú lateral, haz clic en **Pages**
4. En **Source**, selecciona **GitHub Actions**
5. ¡Listo! El workflow se ejecutará automáticamente

#### 3️⃣ Esperar el Despliegue

- Ve a la pestaña **Actions** en tu repositorio
- Verás el workflow "Deploy to GitHub Pages" ejecutándose
- Espera a que termine (toma ~2-3 minutos)
- Una vez completado, tu sitio estará disponible en: `https://ingjaviergomezm.github.io/solar-project-planner/`

---

### Opción 2: Despliegue Manual con gh-pages

Si prefieres un despliegue manual:

```bash
# Navega a la carpeta del proyecto
cd "C:\Users\Usuario\OneDrive\Documentos\Solar Project Planner\solar-app"

# Instalar gh-pages globalmente (solo la primera vez)
npm install -g gh-pages

# Desplegar la carpeta dist
gh-pages -d dist
```

Luego configura GitHub Pages:
1. Ve a **Settings → Pages**
2. En **Branch**, selecciona `gh-pages` y carpeta `/root`
3. Haz clic en **Save**

---

## 🔍 Verificar que Funcione

Una vez desplegado, abre tu sitio:
- **URL**: `https://ingjaviergomezm.github.io/solar-project-planner/`

Si aún ves una página en blanco:
1. Abre las **Herramientas de Desarrollador** (F12)
2. Ve a la pestaña **Console**
3. Busca errores de rutas (404)
4. Si hay errores, verifica que el `base` en `vite.config.js` coincida con el nombre del repositorio

---

## 🐛 Solución de Problemas

### Problema: Página en blanco

**Causa**: El `base` en `vite.config.js` no coincide con la URL de GitHub Pages

**Solución**:
- Si tu repositorio se llama `solar-project-planner`, usa `base: '/solar-project-planner/'`
- Si tu dominio es `usuario.github.io`, usa `base: '/'`

### Problema: 404 en recursos (CSS, JS)

**Causa**: Falta el archivo `.nojekyll`

**Solución**:
- Ya lo agregué en `public/.nojekyll`
- Recuerda hacer `npm run build` después de cualquier cambio

### Problema: GitHub Actions falla

**Causa**: Permisos insuficientes

**Solución**:
1. Ve a **Settings → Actions → General**
2. En **Workflow permissions**, selecciona **Read and write permissions**
3. Haz clic en **Save**
4. Vuelve a ejecutar el workflow

---

## 📝 Notas Importantes

- **Cada vez que hagas cambios** en el código, debes:
  1. Hacer commit y push a GitHub
  2. El workflow de GitHub Actions se ejecutará automáticamente
  3. Esperar ~2-3 minutos para que se actualice el sitio

- **Para desarrollo local**, usa:
  ```bash
  npm run dev
  ```
  Esto abrirá el servidor de desarrollo en `http://localhost:5173`

- **Para previsualizar la build de producción**:
  ```bash
  npm run build
  npm run preview
  ```

---

## ✨ ¡Listo!

Tu aplicación Solar Project Planner ahora debería funcionar perfectamente en GitHub Pages.

**URL del Proyecto**: https://ingjaviergomezm.github.io/solar-project-planner/

Si encuentras algún problema, revisa:
1. La consola del navegador (F12 → Console)
2. Los logs de GitHub Actions (pestaña Actions en GitHub)
3. Que el nombre del repositorio coincida con el `base` en `vite.config.js`
