# ☀️ Solar Project Planner

**Planificador técnico-financiero de proyectos de energía solar con inteligencia artificial para el mercado colombiano**

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Gemini-AI-4285F4?style=for-the-badge&logo=google&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

---

## 📋 Descripción

Solar Project Planner es un planificador técnico financiero integral de proyectos de energía solar potenciado con inteligencia artificial. Diseñado para profesionales, empresas e instaladores del sector solar fotovoltaico en Colombia.

### 🎯 Objetivos del Proyecto

- ✅ Democratizar el acceso a herramientas profesionales de dimensionamiento solar
- ✅ Acelerar el proceso de cotización de proyectos fotovoltaicos
- ✅ Garantizar cálculos precisos según normativa colombiana (RETIE, Ley 1715, CREG)
- ✅ Proporcionar análisis financiero realista con proyecciones a 25 años
- ✅ Integrar IA para validación técnica y recomendaciones personalizadas

---

## ✨ Características Principales

### 📱 Interfaz Mobile-First con Navegación por Pestañas

La aplicación cuenta con una **interfaz de aplicación móvil moderna** con 5 pestañas accesibles desde la barra de navegación inferior:

| Pestaña | Icono | Descripción |
|---------|-------|-------------|
| **Proyecto** | 🏠 | Formulario de datos del proyecto solar |
| **Diseño** | ✏️ | Configuraciones optimizadas generadas |
| **+** (FAB) | ➕ | Botón central para nuevo proyecto |
| **IA** | ✨ | Análisis ejecutivo con inteligencia artificial |
| **Config** | ⚙️ | API Key, TRM y tarifa eléctrica |

#### Diseño Visual
- **Tema oscuro profesional** con gradientes (#0F172A → #1E293B)
- **Glassmorphism** en tarjetas y navegación
- **Indicadores de color** en secciones (teal, purple, amber)
- **FAB central** con gradiente naranja elevado
- **Tipografía Inter** de Google Fonts

### 🔧 Motor de Cálculo Técnico

- **Dimensionamiento automático** basado en consumo y HSP
- **32 ciudades colombianas** con datos de radiación solar
- **Selección inteligente** de paneles e inversores
- **3 configuraciones optimizadas**: Costo, Calidad, Sostenibilidad

### 🤖 Análisis con Inteligencia Artificial

Nueva pestaña **"IA"** con análisis ejecutivo personalizado:

- **Máximo 300 palabras** - conciso y profesional
- **4 secciones estructuradas**:
  - 🎯 Resumen Ejecutivo
  - ⚡ Beneficios Clave
  - 📊 Proyección Financiera
  - ✅ Recomendación Final
- **Formato HTML** con estilos profesionales
- **Modelo Gemini 2.5 Flash** de Google

### 💰 Análisis Financiero Completo

- **ROI a 25 años** con degradación de paneles
- **VPN y TIR** calculados automáticamente
- **Desglose de costos** "llave en mano"
- **Tiempo de retorno** de inversión

---

## 🚀 Instalación

### Prerrequisitos
- **Node.js** 18 o superior
- **npm** 9 o superior

### Instalación Local

```bash
# Clonar el repositorio
git clone https://github.com/ingjaviergomezm/solar-project-planner.git

# Navegar a la carpeta
cd solar-project-planner/solar-app

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### Configuración de API Key

1. Obtener API Key gratuita en [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Abrir la pestaña **Config** en la aplicación
3. Pegar la API Key y guardar

---

## 📖 Guía de Uso

### Flujo de Trabajo

```mermaid
graph LR
    A[Config] --> B[Proyecto]
    B --> C[Calcular]
    C --> D[Diseño]
    D --> E[Seleccionar]
    E --> F[IA]
    F --> G[Análisis]
```

### Pestañas

#### 1️⃣ Config (Configuración)
- API Key de Gemini
- TRM (Tasa de Cambio COP/USD)
- Tarifa eléctrica (COP/kWh)

#### 2️⃣ Proyecto (Datos del Proyecto)
- **Información General**: Nombre, tipo, ciudad, conexión
- **Consumo Energético**: kWh/mes o valor de factura
- **Preferencias**: Presupuesto, prioridad, autonomía

#### 3️⃣ Diseño (Resultados)
- 3 configuraciones optimizadas
- Métricas: potencia, paneles, inversión, ROI
- Botón "Seleccionar" para análisis detallado

#### 4️⃣ IA (Análisis con IA)
- Resumen de configuración seleccionada
- Botón "Generar Análisis con IA"
- Análisis ejecutivo de 300 palabras

---

## 🛠️ Stack Tecnológico

| Categoría | Tecnología |
|-----------|------------|
| Frontend | React 18, Vite 7 |
| Estilos | TailwindCSS 4, CSS Variables |
| Iconos | Lucide React |
| IA | Gemini API (2.5 Flash) |
| PDF | jsPDF + AutoTable |
| Deploy | Vercel |

---

## 📊 Estructura del Proyecto

```
solar-app/
├── src/
│   ├── components/
│   │   ├── BottomNav.jsx      # Navegación inferior
│   │   ├── ProjectTab.jsx     # Formulario de proyecto
│   │   ├── ResultsTab.jsx     # Configuraciones
│   │   ├── DetailsTab.jsx     # Desglose de costos
│   │   ├── AITab.jsx          # Análisis con IA
│   │   └── SettingsTab.jsx    # Configuración
│   ├── utils/
│   │   ├── calculations.js    # Motor de cálculo
│   │   └── gemini.js          # Integración IA
│   ├── data/
│   │   ├── paneles.json       # Catálogo de paneles
│   │   ├── inversores.json    # Catálogo de inversores
│   │   └── hsp.json           # HSP ciudades Colombia
│   ├── App.jsx                # Componente principal
│   └── index.css              # Estilos globales
├── package.json
├── vite.config.js
└── tailwind.config.js
```

---

## 🌐 Despliegue

### Vercel (Recomendado)

```bash
npm install -g vercel
vercel
```

### GitHub Pages

1. Actualizar `vite.config.js`:
   ```javascript
   base: '/nombre-repositorio/',
   ```
2. Push a main → GitHub Actions despliega automáticamente

---

## 📝 Notas Importantes

- ✅ Cálculos basados en normativa colombiana (RETIE, Ley 1715)
- ✅ Precios actualizados al mercado 2026
- ⚠️ Los resultados son estimaciones que requieren validación profesional
- ⚠️ La API Key se almacena localmente en el navegador

---

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas!

1. Fork el proyecto
2. Crea una rama: `git checkout -b feature/NuevaCaracteristica`
3. Commit: `git commit -m 'Agregar característica'`
4. Push: `git push origin feature/NuevaCaracteristica`
5. Pull Request

---

## 📄 Licencia

Este proyecto está bajo la **Licencia MIT**.

---

## 👨‍💻 Autor

Desarrollado con ❤️ por Javier Gómez Martínez para impulsar la **transición energética** en Colombia

- 📧 Email: ingjaviergomez222@gmail.com
- 💼 LinkedIn: [Javier Gómez M.](https://linkedin.com/in/jogomezm)
- 🐛 Issues: [GitHub Issues](https://github.com/ingjaviergomezm/solar-project-planner/issues)

---

## 📈 Roadmap

### v1.1 (Q2 2026)
- [ ] Reportes PDF descargables
- [ ] Gráficos interactivos
- [ ] Modo claro/oscuro

### v2.0 (Q4 2026)
- [ ] Backend con autenticación
- [ ] Guardado en la nube
- [ ] App móvil nativa

---

**¡Gracias por usar Solar Project Planner! ☀️**

*Juntos construimos un futuro más sostenible para Colombia* 🇨🇴
