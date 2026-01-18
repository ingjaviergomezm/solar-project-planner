// Integración con Gemini API para análisis y recomendaciones

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent';

/**
 * Genera un análisis ejecutivo corto para el cliente final (máx 300 palabras)
 * @param {Object} datosProyecto - Datos del proyecto
 * @param {Object} configuracion - Configuración seleccionada
 * @param {string} apiKey - API Key de Gemini
 * @returns {Promise<string>} Análisis en formato HTML estructurado
 */
export async function generarAnalisisCliente(datosProyecto, configuracion, apiKey) {
    if (!apiKey) {
        throw new Error('API Key de Gemini no configurada');
    }

    const prompt = `Eres un asesor de energía solar que presenta proyectos a clientes finales en Colombia.
Genera un ANÁLISIS EJECUTIVO de MÁXIMO 300 PALABRAS para este proyecto solar.

DATOS DEL PROYECTO:
- Ciudad: ${datosProyecto.ciudad || 'Bogotá'}
- Consumo mensual: ${datosProyecto.consumoMensual} kWh
- Tipo: ${datosProyecto.tipoInstalacion || 'Residencial'}

CONFIGURACIÓN PROPUESTA:
- Potencia: ${configuracion.potenciaReal?.toFixed(2) || '5.00'} kWp
- Paneles: ${configuracion.numPaneles} × ${configuracion.panel?.modelo || 'Panel Solar'}
- Inversor: ${configuracion.inversor?.modelo || 'Inversor'}
- Inversión: $${configuracion.presupuesto?.inversionTotal?.toLocaleString('es-CO') || '20,000,000'} COP
- Retorno: ${configuracion.roi?.tiempoRetornoAnos || '5'} años
- Ahorro mensual: $${configuracion.roi?.ahorroMensual?.toLocaleString('es-CO') || '200,000'} COP

ESTRUCTURA DEL ANÁLISIS (usa exactamente estas secciones):

<div class="ai-section">
<h3>🎯 Resumen Ejecutivo</h3>
<p>[2-3 oraciones sobre el proyecto y su viabilidad]</p>
</div>

<div class="ai-section">
<h3>⚡ Beneficios Clave</h3>
<ul>
<li><strong>Ahorro:</strong> [beneficio económico]</li>
<li><strong>Sostenibilidad:</strong> [beneficio ambiental]</li>
<li><strong>Valorización:</strong> [beneficio patrimonial]</li>
</ul>
</div>

<div class="ai-section">
<h3>📊 Proyección Financiera</h3>
<p>[explicar retorno de inversión y ahorros en términos simples]</p>
</div>

<div class="ai-section">
<h3>✅ Recomendación</h3>
<p><strong>[APROBAR/CONSIDERAR]:</strong> [conclusión final motivadora]</p>
</div>

REGLAS:
- Máximo 300 palabras
- Lenguaje profesional pero accesible (no técnico)
- Usa números concretos del proyecto
- Tono positivo y motivador
- Responde SOLO con el HTML, sin texto adicional`;

    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 2048,
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error de API: ${errorData.error?.message || 'Error desconocido'}`);
        }

        const data = await response.json();
        const texto = data.candidates[0]?.content?.parts[0]?.text;

        if (!texto) {
            throw new Error('No se recibió respuesta de la API');
        }

        return texto;
    } catch (error) {
        console.error('Error generando análisis:', error);
        throw error;
    }
}

/**
 * Analiza una configuración de sistema solar y genera recomendaciones
 * @param {Object} datosProyecto - Datos del proyecto
 * @param {Object} configuracion - Configuración a analizar
 * @param {string} apiKey - API Key de Gemini
 * @returns {Promise<string>} Recomendaciones generadas por IA
 */
export async function analizarConfiguracion(datosProyecto, configuracion, apiKey) {
    if (!apiKey) {
        throw new Error('API Key de Gemini no configurada');
    }

    const prompt = construirPrompt(datosProyecto, configuracion);

    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 8192,
                },
                safetySettings: [
                    {
                        category: 'HARM_CATEGORY_HARASSMENT',
                        threshold: 'BLOCK_NONE'
                    },
                    {
                        category: 'HARM_CATEGORY_HATE_SPEECH',
                        threshold: 'BLOCK_NONE'
                    },
                    {
                        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
                        threshold: 'BLOCK_NONE'
                    },
                    {
                        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
                        threshold: 'BLOCK_NONE'
                    }
                ]
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error de API: ${errorData.error?.message || 'Error desconocido'}`);
        }

        const data = await response.json();

        // Log para debugging
        console.log('Gemini Response:', data);
        console.log('Finish Reason:', data.candidates[0]?.finishReason);

        const textoRespuesta = data.candidates[0]?.content?.parts[0]?.text;

        if (!textoRespuesta) {
            const finishReason = data.candidates[0]?.finishReason;
            throw new Error(`No se recibió respuesta de la API. Finish Reason: ${finishReason}`);
        }

        return textoRespuesta;
    } catch (error) {
        console.error('Error al llamar a Gemini API:', error);
        throw error;
    }
}

/**
 * Genera 2 configuraciones optimizadas usando IA
 * @param {Object} datosProyecto - Datos del proyecto del usuario
 * @param {Object} catalogos - Catálogos de paneles, inversores y accesorios
 * @param {string} apiKey - API Key de Gemini
 * @returns {Promise<Object>} Objeto con 2 configuraciones: calidad y economia
 */
export async function generarConfiguracionesIA(datosProyecto, catalogos, apiKey) {
    if (!apiKey) {
        throw new Error('API Key de Gemini no configurada');
    }

    const prompt = construirPromptConfiguraciones(datosProyecto, catalogos);

    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.3, // Más determinístico para cálculos
                    maxOutputTokens: 8192
                },
                safetySettings: [
                    { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
                    { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
                    { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
                    { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' }
                ]
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error de API: ${errorData.error?.message || 'Error desconocido'}`);
        }

        const data = await response.json();
        console.log('Gemini Configuraciones Response:', data);

        let textoRespuesta = data.candidates[0]?.content?.parts[0]?.text;

        if (!textoRespuesta) {
            throw new Error('No se recibió respuesta de la API');
        }

        // Limpiar bloques de código markdown si existen
        textoRespuesta = textoRespuesta.trim();
        if (textoRespuesta.startsWith('```json')) {
            textoRespuesta = textoRespuesta.slice(7);
        } else if (textoRespuesta.startsWith('```')) {
            textoRespuesta = textoRespuesta.slice(3);
        }
        if (textoRespuesta.endsWith('```')) {
            textoRespuesta = textoRespuesta.slice(0, -3);
        }
        textoRespuesta = textoRespuesta.trim();

        // Parsear JSON de respuesta
        const configuraciones = JSON.parse(textoRespuesta);

        // Validar y completar campos faltantes
        validarYCompletarConfiguracion(configuraciones.configuracionCalidad);
        validarYCompletarConfiguracion(configuraciones.configuracionEconomica);

        console.log('Respuesta IA:', configuraciones);
        return configuraciones;

    } catch (error) {
        console.error('Error al generar configuraciones IA:', error);
        throw error;
    }
}

/**
 * Valida y completa campos faltantes en una configuración
 */
function validarYCompletarConfiguracion(config) {
    if (!config) return;

    // Función auxiliar para convertir a número seguro
    const toNumber = (value, defaultValue = 0) => {
        if (value === null || value === undefined) return defaultValue;
        const num = typeof value === 'string' ? parseFloat(value) : Number(value);
        return isNaN(num) ? defaultValue : num;
    };

    // Validar y convertir campos numéricos del panel
    if (config.panel) {
        config.panel.potencia_w = toNumber(config.panel.potencia_w, 450);
        config.panel.eficiencia = toNumber(config.panel.eficiencia, 20);
        config.panel.precio_cop = toNumber(config.panel.precio_cop, 250000);
        config.panel.garantia_anos = toNumber(config.panel.garantia_anos, 25);
        config.panel.dimensiones_m2 = toNumber(config.panel.dimensiones_m2, 2.5);
    }

    // Validar y convertir campos numéricos del inversor
    if (config.inversor) {
        config.inversor.potencia_kw = toNumber(config.inversor.potencia_kw, 5);
        config.inversor.eficiencia = toNumber(config.inversor.eficiencia, 97);
        config.inversor.precio_cop = toNumber(config.inversor.precio_cop, 3000000);
        config.inversor.garantia_anos = toNumber(config.inversor.garantia_anos, 10);
    }

    // Validar campos principales de la configuración
    config.numPaneles = toNumber(config.numPaneles, 10);
    config.potenciaReal = toNumber(config.potenciaReal, config.numPaneles * config.panel.potencia_w / 1000);

    // Calcular área requerida si falta
    if (!config.areaRequerida || isNaN(config.areaRequerida)) {
        const areaPromedioPorPanel = config.panel.dimensiones_m2 || 2.5;
        config.areaRequerida = Math.round(config.numPaneles * areaPromedioPorPanel * 10) / 10;
    } else {
        config.areaRequerida = toNumber(config.areaRequerida, config.numPaneles * 2.5);
    }

    // Calcular puntuación si falta
    if (!config.puntuacion || isNaN(config.puntuacion)) {
        const eficienciaScore = Math.min((config.panel.eficiencia / 25) * 40, 40); // 40% peso
        const garantiaScore = Math.min((config.panel.garantia_anos / 30) * 30, 30); // 30% peso
        const inversorScore = Math.min((config.inversor.eficiencia / 98) * 30, 30); // 30% peso
        config.puntuacion = Math.round(eficienciaScore + garantiaScore + inversorScore);
    } else {
        config.puntuacion = toNumber(config.puntuacion, 75);
    }
}


/**
 * Construye el prompt para generar configuraciones
 */
function construirPromptConfiguraciones(datosProyecto, catalogos) {
    const { paneles, inversores } = catalogos;

    return `Eres un ingeniero experto en energía solar fotovoltaica especializado en el mercado colombiano.
Tu tarea es analizar los catálogos de equipos y generar 2 configuraciones óptimas para este proyecto.

## DATOS DEL PROYECTO:
- Nombre: ${datosProyecto.nombreProyecto || 'Proyecto Solar'}
- Ciudad: ${datosProyecto.ciudad || 'Bogotá'} (HSP: ${datosProyecto.hsp || 4.5} h/día)
- Consumo mensual: ${datosProyecto.consumoMensual} kWh/mes
- Tipo instalación: ${datosProyecto.tipoInstalacion || 'Residencial'}
- Presupuesto máximo: ${datosProyecto.presupuestoMaximo ? '$' + datosProyecto.presupuestoMaximo.toLocaleString() + ' COP' : 'No especificado'}
- Autonomía objetivo: ${datosProyecto.autonomiaPct || 100}%

## CATÁLOGO DE PANELES DISPONIBLES:
${JSON.stringify(paneles.slice(0, 12), null, 2)}

## CATÁLOGO DE INVERSORES DISPONIBLES:
${JSON.stringify(inversores.slice(0, 12), null, 2)}

## CÁLCULOS QUE DEBES REALIZAR:

1. **Energía diaria requerida** = (consumoMensual / 30) / (autonomiaPct/100)
2. **Potencia del sistema** = energiaDiaria / HSP / 0.85 (factor de pérdidas)
3. **Número de paneles** = potenciaSistema * 1000 / potenciaPanel
4. **Selección de inversor** = elegir uno con potencia ≥ potenciaSistema * 0.8 (ratio DC/AC ~1.2)

## GENERA 2 CONFIGURACIONES:

### CONFIGURACIÓN 1: CALIDAD Y CONFIABILIDAD
- Prioriza: eficiencia máxima, garantía extendida, tecnología TOPCon/N-Type, marcas premium
- Inversores: Fronius, SMA o Huawei
- Paneles: mayor eficiencia disponible

### CONFIGURACIÓN 2: MEJOR PRECIO
- Prioriza: menor costo total, buena relación precio/Wp
- Sin sacrificar calidad básica (solo Tier 1)
- Buscar el equilibrio óptimo precio/rendimiento

## FORMATO DE RESPUESTA (JSON ESTRICTO):

Responde ÚNICAMENTE con este JSON, sin texto adicional:

{
  "configuracionCalidad": {
    "tipo": "Máxima Calidad",
    "prioridad": "calidad",
    "panel": {
      "id": <número>,
      "marca": "<marca>",
      "modelo": "<modelo>",
      "potencia_w": <número>,
      "eficiencia": <número>,
      "precio_cop": <número>,
      "garantia_anos": <número>,
      "tecnologia": "<tipo>"
    },
    "numPaneles": <número calculado>,
    "potenciaReal": <número en kW>,
    "areaRequerida": <número en m²>,
    "inversor": {
      "id": <número>,
      "marca": "<marca>",
      "modelo": "<modelo>",
      "potencia_kw": <número>,
      "eficiencia": <número>,
      "precio_cop": <número>,
      "garantia_anos": <número>,
      "tipo": "<tipo>"
    },
    "puntuacion": <número entre 0-100>,
    "justificacionHTML": "<p>Párrafo explicando por qué esta configuración es ideal para calidad.</p><ul><li>Punto 1</li><li>Punto 2</li><li>Punto 3</li></ul><p><strong>Conclusión:</strong> texto</p>"
  },
  "configuracionEconomica": {
    "tipo": "Mejor Precio",
    "prioridad": "economia",
    "panel": { ... mismo formato ... },
    "numPaneles": <número>,
    "potenciaReal": <número en kW>,
    "areaRequerida": <número en m²>,
    "inversor": { ... mismo formato ... },
    "puntuacion": <número entre 0-100>,
    "justificacionHTML": "<p>Párrafo explicando por qué esta configuración ofrece el mejor valor.</p><ul><li>Punto 1</li><li>Punto 2</li><li>Punto 3</li></ul><p><strong>Ahorro vs calidad:</strong> texto</p>"
  },
  "comparativaHTML": "<table style='width:100%'><tr><th>Aspecto</th><th>Calidad</th><th>Económica</th></tr><tr><td>Inversión</td><td>$X COP</td><td>$Y COP</td></tr><tr><td>Eficiencia</td><td>X%</td><td>Y%</td></tr><tr><td>Garantía</td><td>X años</td><td>Y años</td></tr></table>"
}

IMPORTANTE:
- Los precios deben venir del catálogo, NO inventados
- Las justificaciones DEBEN ser HTML válido, no Markdown
- El numPaneles debe ser un número entero calculado correctamente
- La potenciaReal = numPaneles * potencia_panel / 1000`;
}

/**
 * Construye el prompt para Gemini
 */
function construirPrompt(datosProyecto, configuracion) {
    const {
        nombreProyecto,
        tipoInstalacion,
        ciudad,
        hsp,
        consumoMensual,
        autonomiaPct,
        presupuestoMaximo,
        espacioLimitado
    } = datosProyecto;

    const {
        tipo,
        panel,
        numPaneles,
        potenciaReal,
        inversor,
        presupuesto,
        roi,
        bateria,
        capacidadBateria
    } = configuracion;

    // Calcular métricas adicionales
    const relacionDCAC = potenciaReal / inversor.potencia_kw;
    const areaM2 = numPaneles * (panel.dimensiones?.area || 2.5); // área aproximada por panel
    const produccionAnualKwh = potenciaReal * hsp * 365 * (inversor.eficiencia / 100) * 0.85; // factor de pérdidas
    const coberturaPct = (produccionAnualKwh / 12 / consumoMensual) * 100;
    const ahorroMensual = roi.ahorroAnual / 12;
    const requiereBaterias = bateria ? 'Sí' : 'No';

    return `Eres un ingeniero especialista en energía solar fotovoltaica con experiencia 
en proyectos comerciales en Colombia. Analiza la siguiente configuración 
calculada y proporciona una recomendación ejecutiva profesional.

CONTEXTO DEL PROYECTO:
- Tipo de instalación: ${tipoInstalacion}
- Ubicación: ${ciudad}, Colombia (HSP promedio: ${hsp} h/día)
- Consumo energético: ${consumoMensual} kWh/mes
- Autonomía objetivo: ${autonomiaPct}%
- Presupuesto disponible: $${presupuestoMaximo ? presupuestoMaximo.toLocaleString('es-CO') : 'No especificado'} COP
- Restricción de espacio: ${espacioLimitado ? 'Sí' : 'No'}
- Requiere baterías: ${requiereBaterias}

CONFIGURACIÓN TÉCNICA CALCULADA:
- Potencia del sistema: ${potenciaReal.toFixed(2)} kWp
- Paneles seleccionados: ${numPaneles} unidades × ${panel.marca} ${panel.modelo} 
  (${panel.potencia_w}W, eficiencia ${panel.eficiencia}%)
- Inversor: ${inversor.marca} ${inversor.modelo} (${inversor.potencia_kw} kW, 
  eficiencia ${inversor.eficiencia}%)
- Relación DC/AC: ${relacionDCAC.toFixed(2)}
- Área de techo requerida: ${areaM2.toFixed(1)} m²
- Producción anual estimada: ${produccionAnualKwh.toLocaleString('es-CO', { maximumFractionDigits: 0 })} kWh/año
- Cobertura del consumo: ${coberturaPct.toFixed(1)}%

ANÁLISIS ECONÓMICO:
- Inversión total: $${presupuesto.inversionTotal.toLocaleString('es-CO')} COP
- Costo por Wp instalado: $${Math.round(presupuesto.costoPorWp).toLocaleString('es-CO')} COP/Wp
- Ahorro mensual estimado: $${ahorroMensual.toLocaleString('es-CO', { maximumFractionDigits: 0 })} COP
- Periodo de retorno simple: ${roi.tiempoRetornoAnos} años

GENERA UN ANÁLISIS ESTRUCTURADO CON LOS SIGUIENTES APARTADOS:

**1. VALIDACIÓN DE LA CONFIGURACIÓN:**
Evalúa si la configuración es óptima o si requiere ajustes. Considera:
- Si la relación DC/AC está en rango ideal (1.1-1.3 para on-grid)
- Si el número de paneles es múltiplo adecuado para strings balanceados
- Si el inversor está subdimensionado o sobredimensionado
- Si el área de techo es realista para una instalación ${tipoInstalacion}

**2. RECOMENDACIONES TÉCNICAS ESPECÍFICAS:**
Proporciona 2-3 ajustes concretos si aplican (de lo contrario, confirma 
que la configuración es adecuada):
- Cambio de modelo de panel (ej: "Considera paneles de 550W en vez de 425W 
  para reducir área y mano de obra")
- Ajuste en cantidad para optimizar configuración de strings
- Inversor alternativo si hay mejor opción técnica/económica
- Inclusión/exclusión de baterías según patrón de consumo

**3. CONSIDERACIONES CRÍTICAS DEL PROYECTO:**
Lista 3 aspectos técnicos o regulatorios que el cliente DEBE considerar:
- Riesgos técnicos (ej: sombreado, orientación óptima de techo)
- Requisitos normativos Colombia (RETIE, Resolución CREG, Ley 1715)
- Mantenimiento preventivo y garantías
- Condiciones climáticas específicas de ${ciudad}

**4. ANÁLISIS DE VIABILIDAD ECONÓMICA:**
Valida si el costo está en rango de mercado y si el ROI es atractivo:
- Comparar costo/Wp contra benchmarks Colombia 2026: 
  * Residencial: 4,000-5,500 COP/Wp
  * Comercial: 3,500-4,800 COP/Wp
  * Industrial: 3,200-4,200 COP/Wp
- Evaluar si payback < 7 años es competitivo
- Confirmar si ahorro mensual justifica inversión

**5. VEREDICTO FINAL:**
Resume en 2-3 oraciones si recomiendas APROBAR, AJUSTAR o REPLANTEAR 
el proyecto, y cuál es la acción inmediata sugerida.

FORMATO DE RESPUESTA:

- Usa párrafos cortos y bullets cuando sea necesario
- Lenguaje técnico pero accesible para cliente comercial/industrial
- Sé específico: menciona modelos de equipos alternativos si sugieres cambios
- Incluye números concretos en tus recomendaciones
- Tono profesional y concluyente, no especulativo`;
}

/**
 * Obtiene la API Key almacenada en localStorage
 * @returns {string|null} API Key o null si no está configurada
 */
export function obtenerAPIKey() {
    return localStorage.getItem('gemini_api_key');
}

/**
 * Guarda la API Key en localStorage
 * @param {string} apiKey - API Key a guardar
 */
export function guardarAPIKey(apiKey) {
    localStorage.setItem('gemini_api_key', apiKey);
}

/**
 * Elimina la API Key de localStorage
 */
export function eliminarAPIKey() {
    localStorage.removeItem('gemini_api_key');
}

/**
 * Verifica si hay una API Key configurada
 * @returns {boolean} True si hay API Key configurada
 */
export function tieneAPIKey() {
    const apiKey = obtenerAPIKey();
    return apiKey !== null && apiKey.trim() !== '';
}
