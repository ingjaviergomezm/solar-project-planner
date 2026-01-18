// Motor de cálculo para dimensionamiento de sistemas solares

/**
 * Calcula la energía diaria requerida en kWh
 * @param {number} consumoMensual - Consumo mensual en kWh
 * @param {number} autonomiaPct - Porcentaje de autonomía deseada (0-100)
 * @returns {number} Energía diaria en kWh
 */
export function calcularEnergiaDiaria(consumoMensual, autonomiaPct) {
    return (consumoMensual / 30) * (autonomiaPct / 100);
}

/**
 * Calcula la potencia pico del sistema en kWp
 * @param {number} energiaDiaria - Energía diaria requerida en kWh
 * @param {number} hsp - Horas Sol Pico de la ubicación
 * @param {number} eficienciaSistema - Eficiencia del sistema (0-1), por defecto 0.80
 * @returns {number} Potencia pico en kWp
 */
export function calcularPotenciaPico(energiaDiaria, hsp, eficienciaSistema = 0.80) {
    return energiaDiaria / (hsp * eficienciaSistema);
}

/**
 * Dimensiona los paneles solares para el sistema
 * @param {number} potenciaPico - Potencia pico requerida en kWp
 * @param {Array} catalogoPaneles - Array de paneles disponibles
 * @param {boolean} espacioLimitado - Si hay limitación de espacio
 * @returns {Object} Configuración de paneles seleccionada
 */
export function dimensionarPaneles(potenciaPico, catalogoPaneles, espacioLimitado = false) {
    // Si hay espacio limitado, priorizar paneles de mayor eficiencia
    const panelesOrdenados = espacioLimitado
        ? [...catalogoPaneles].sort((a, b) => b.eficiencia - a.eficiencia)
        : [...catalogoPaneles].sort((a, b) => a.precio_cop / a.potencia_w - b.precio_cop / b.potencia_w);

    const configuraciones = panelesOrdenados.map(panel => {
        const numPaneles = Math.ceil((potenciaPico * 1000) / panel.potencia_w);
        const potenciaReal = (numPaneles * panel.potencia_w) / 1000;
        const areaRequerida = numPaneles * panel.dimensiones_m2;
        const costoTotal = numPaneles * panel.precio_cop;

        return {
            panel,
            numPaneles,
            potenciaReal,
            areaRequerida,
            costoTotal,
            costoPorWp: costoTotal / (potenciaReal * 1000)
        };
    });

    return configuraciones[0]; // Retorna la mejor configuración
}

/**
 * Selecciona el inversor adecuado del catálogo
 * @param {number} potenciaDC - Potencia DC del sistema en kW
 * @param {string} tipoConexion - Tipo de conexión: 'on-grid', 'off-grid', 'hibrido'
 * @param {Array} catalogoInversores - Array de inversores disponibles
 * @returns {Object} Inversor seleccionado
 */
export function seleccionarInversor(potenciaDC, tipoConexion, catalogoInversores) {
    // Relación DC/AC según tipo de conexión
    const relacionDCAC = tipoConexion === 'on-grid' ? 1.25 : 1.0;
    const potenciaAC = potenciaDC / relacionDCAC;

    // Filtrar inversores según tipo
    let inversoresFiltrados = catalogoInversores;
    if (tipoConexion === 'hibrido') {
        inversoresFiltrados = catalogoInversores.filter(inv => inv.tipo === 'Híbrido');
    } else if (tipoConexion === 'on-grid') {
        inversoresFiltrados = catalogoInversores.filter(inv => inv.tipo === 'String on-grid');
    }

    // Buscar el inversor más cercano a la potencia calculada
    const inversorSeleccionado = inversoresFiltrados.reduce((prev, curr) => {
        const diffPrev = Math.abs(prev.potencia_kw - potenciaAC);
        const diffCurr = Math.abs(curr.potencia_kw - potenciaAC);
        return diffCurr < diffPrev ? curr : prev;
    });

    return inversorSeleccionado;
}

/**
 * Calcula el presupuesto detallado del sistema
 * Costos actualizados según mercado colombiano 2026
 * @param {Object} configuracion - Configuración del sistema
 * @param {number} trm - Tasa Representativa del Mercado (COP/USD)
 * @returns {Object} Desglose de costos
 */
export function calcularPresupuesto(configuracion, trm = 4200) {
    const { numPaneles, panel, inversor, potenciaReal, requiereBaterias, capacidadBateria, bateria } = configuracion;

    // =====================================================
    // COSTOS DIRECTOS (EQUIPOS PRINCIPALES)
    // =====================================================
    const costoPaneles = numPaneles * panel.precio_cop;
    const costoInversor = inversor.precio_cop;

    // =====================================================
    // 1. ESTRUCTURA DE MONTAJE (Costo de mercado 2026)
    // Base: $350,000 + $125,000/panel (Incluye rieles, anclajes, unistrut y tornillería inox)
    // =====================================================
    const costoEstructuraBase = 350000;
    const costoEstructuraPorPanel = 125000;
    const costoEstructura = costoEstructuraBase + (numPaneles * costoEstructuraPorPanel);

    // =====================================================
    // 2. PROTECCIONES DC (Cajas combinadoras certificadas)
    // Base: $850,000 + $150,000/string (DPS 600V/1000V, fusibles gPV, seccionadores)
    // =====================================================
    const numStrings = Math.ceil(numPaneles / 4);
    const costoProteccionesDCBase = 850000;
    const costoProteccionesDCPorString = 150000;
    const costoProteccionesDC = costoProteccionesDCBase + (Math.max(0, numStrings - 1) * costoProteccionesDCPorString);

    // =====================================================
    // 3. PROTECCIONES AC Y TABLEROS
    // Tablero general, totalizadores, DPS Clases I/II
    // Base: $450,000 (Residencial monofásico/bifásico)
    // =====================================================
    const costoProteccionesAC = 450000;

    // =====================================================
    // 4. SPT (SISTEMA PUESTA A TIERRA)
    // Kit completo certificado RETIE (Varillas copperweld, cable desnudo, mejoradores)
    // =====================================================
    const costoPuestaATierra = 550000;

    // =====================================================
    // 5. CABLEADO SOLAR Y CANALIZACIÓN
    // Cable PV 4/6mm, conectores MC4, tubería EMT/IMC
    // Base: $250,000 + $120,000/panel
    // =====================================================
    const costoCableadoBase = 250000;
    const costoCableadoPorPanel = 120000;
    const costoCableado = costoCableadoBase + (numPaneles * costoCableadoPorPanel);

    // =====================================================
    // 6. MANO DE OBRA ESPECIALIZADA (Instaladores certificados TE-1)
    // $450,000/kWp instalado (Tarifa mercado 2026)
    // Mínimo de salida: $1,200,000
    // =====================================================
    const costoManoObraPorKw = 450000;
    const costoManoObraMinimo = 1200000;
    const costoManoObra = Math.max(potenciaReal * costoManoObraPorKw, costoManoObraMinimo);

    // =====================================================
    // 7. INGENIERÍA, DISEÑO Y COORDINACIÓN
    // 12% Equipos (Visita técnica, diseño, memorias de cálculo, planos as-built)
    // =====================================================
    const costoIngenieria = (costoPaneles + costoInversor) * 0.12;

    // =====================================================
    // 8. LEGALIZACIÓN Y TRÁMITES (OR + RETIE)
    // Legalización OR (AGPE): $800,000
    // Certificación RETIE plena: $1,400,000
    // =====================================================
    const costoTramitesOperador = 800000;
    const costoCertificacionRETIE = 1400000;
    const costoTramitesUPME = potenciaReal > 100 ? 2500000 : 0; // Exenciones tributarias

    // =====================================================
    // 9. BATERÍAS (Opcional)
    // =====================================================
    let costoBaterias = 0;
    if (requiereBaterias && bateria) {
        const numBaterias = Math.ceil(capacidadBateria / bateria.capacidad_kwh);
        costoBaterias = numBaterias * bateria.precio_cop;
    }

    // =====================================================
    // SUBTOTAL COSTOS DIRECTOS
    // =====================================================
    const subtotalCostos =
        costoPaneles +
        costoInversor +
        costoEstructura +
        costoProteccionesDC +
        costoProteccionesAC +
        costoPuestaATierra +
        costoCableado +
        costoManoObra +
        costoIngenieria +
        costoTramitesOperador +
        costoCertificacionRETIE +
        costoTramitesUPME +
        costoBaterias;

    // =====================================================
    // IMPREVISTOS Y LOGÍSTICA (Transporte, viáticos, menores)
    // 5% del Subtotal
    // =====================================================
    const costoImprevistos = subtotalCostos * 0.05;

    // =====================================================
    // MARGEN COMERCIAL / UTILIDAD / GASTOS ADMINISTRATIVOS
    // 30% sobre costos directos (Mark-up estándar industria)
    // =====================================================
    const margenComercial = (subtotalCostos + costoImprevistos) * 0.30;

    // =====================================================
    // INVERSIÓN TOTAL LLAVE EN MANO
    // =====================================================
    const inversionTotal = subtotalCostos + costoImprevistos + margenComercial;

    const costoPorWp = inversionTotal / (potenciaReal * 1000);

    return {
        // Equipos
        costoPaneles,
        costoInversor,
        costoBaterias,
        // BOS (Balance of System)
        costoEstructura,
        costoProteccionesDC,
        costoProteccionesAC,
        costoPuestaATierra,
        costoCableado,
        // Servicios
        costoManoObra,
        costoIngenieria,
        costoTramitesOperador,
        costoCertificacionRETIE,
        costoTramitesUPME,
        // Indirectos
        costoImprevistos,
        margenComercial,
        // Total
        inversionTotal,
        costoPorWp,
        numStrings
    };
}

/**
 * Calcula el ROI y tiempo de retorno de inversión con modelo financiero realista
 * Incluye: mantenimiento, degradación de paneles e inflación energética
 * @param {number} inversionTotal - Inversión total en COP
 * @param {number} energiaMensual - Energía generada mensualmente en kWh (año 1)
 * @param {number} tarifaKwh - Tarifa eléctrica en COP/kWh (año 1)
 * @param {Object} parametros - Parámetros adicionales del modelo
 * @returns {Object} Análisis de ROI detallado
 */
export function calcularROI(inversionTotal, energiaMensual, tarifaKwh = 750, parametros = {}) {
    // =====================================================
    // PARÁMETROS DEL MODELO FINANCIERO (Colombia 2026)
    // =====================================================
    const {
        tasaMantenimiento = 0.01,      // 1% de la inversión inicial por año
        tasaDegradacion = 0.005,        // 0.5% de pérdida de eficiencia por año
        tasaInflacionEnergia = 0.05,    // 5% aumento anual del costo de energía
        vidaUtilAnos = 25,              // Vida útil típica de paneles solares
        tasaDescuento = 0.08            // Tasa de descuento para VPN (8% anual)
    } = parametros;

    // Cálculos base año 1
    const energiaAnualBase = energiaMensual * 12;
    const costoMantenimientoAnual = inversionTotal * tasaMantenimiento;

    // =====================================================
    // PROYECCIÓN AÑO POR AÑO
    // =====================================================
    let flujosCaja = [];
    let ahorroAcumulado = 0;
    let costoMantenimientoAcumulado = 0;
    let tiempoRetornoAnos = null;
    let vpn = -inversionTotal; // Valor Presente Neto inicia con inversión negativa

    for (let ano = 1; ano <= vidaUtilAnos; ano++) {
        // Producción del año (disminuye por degradación)
        const factorDegradacion = Math.pow(1 - tasaDegradacion, ano - 1);
        const energiaAnual = energiaAnualBase * factorDegradacion;

        // Tarifa del año (aumenta por inflación)
        const factorInflacion = Math.pow(1 + tasaInflacionEnergia, ano - 1);
        const tarifaAnual = tarifaKwh * factorInflacion;

        // Ahorro bruto del año
        const ahorroBruto = energiaAnual * tarifaAnual;

        // Costo de mantenimiento del año (puede aumentar levemente)
        const costoMantenimiento = costoMantenimientoAnual * Math.pow(1.02, ano - 1);

        // Ahorro neto del año
        const ahorroNeto = ahorroBruto - costoMantenimiento;

        // Acumulados
        ahorroAcumulado += ahorroNeto;
        costoMantenimientoAcumulado += costoMantenimiento;

        // Detectar punto de retorno (payback)
        if (tiempoRetornoAnos === null && ahorroAcumulado >= inversionTotal) {
            // Interpolación para calcular el mes exacto
            const ahorroAnterior = ahorroAcumulado - ahorroNeto;
            const fraccionAno = (inversionTotal - ahorroAnterior) / ahorroNeto;
            tiempoRetornoAnos = (ano - 1) + fraccionAno;
        }

        // Calcular VPN (Valor Presente Neto)
        const factorDescuento = Math.pow(1 + tasaDescuento, ano);
        vpn += ahorroNeto / factorDescuento;

        // Guardar flujo de caja del año
        flujosCaja.push({
            ano,
            energiaAnual: Math.round(energiaAnual),
            tarifaKwh: Math.round(tarifaAnual),
            ahorroBruto: Math.round(ahorroBruto),
            costoMantenimiento: Math.round(costoMantenimiento),
            ahorroNeto: Math.round(ahorroNeto),
            ahorroAcumulado: Math.round(ahorroAcumulado)
        });
    }

    // Si no se recuperó la inversión en 25 años
    if (tiempoRetornoAnos === null) {
        tiempoRetornoAnos = vidaUtilAnos + 1; // Indica que excede vida útil
    }

    // =====================================================
    // MÉTRICAS FINALES
    // =====================================================
    const ahorroMensualAno1 = energiaMensual * tarifaKwh;
    const ahorroAnualAno1 = ahorroMensualAno1 * 12;
    const gananciaTotal = ahorroAcumulado - inversionTotal;
    const roi = (gananciaTotal / inversionTotal) * 100;

    // TIR aproximada (Tasa Interna de Retorno)
    const tir = calcularTIR(inversionTotal, flujosCaja.map(f => f.ahorroNeto));

    return {
        // Métricas básicas (año 1)
        ahorroMensual: Math.round(ahorroMensualAno1),
        ahorroAnual: Math.round(ahorroAnualAno1),
        costoMantenimientoAnual: Math.round(costoMantenimientoAnual),

        // Métricas de retorno
        tiempoRetornoAnos: Math.round(tiempoRetornoAnos * 10) / 10,

        // Métricas a 25 años
        ahorroTotal25Anos: Math.round(ahorroAcumulado),
        costoMantenimientoTotal: Math.round(costoMantenimientoAcumulado),
        gananciaTotal: Math.round(gananciaTotal),
        roi: Math.round(roi * 10) / 10,

        // Métricas financieras avanzadas
        vpn: Math.round(vpn),
        tir: Math.round(tir * 10) / 10,

        // Parámetros utilizados
        parametros: {
            tasaMantenimiento: tasaMantenimiento * 100,
            tasaDegradacion: tasaDegradacion * 100,
            tasaInflacionEnergia: tasaInflacionEnergia * 100,
            tasaDescuento: tasaDescuento * 100
        },

        // Proyección detallada (primeros 10 años + años 15, 20, 25)
        proyeccion: flujosCaja.filter(f =>
            f.ano <= 10 || f.ano === 15 || f.ano === 20 || f.ano === 25
        )
    };
}

/**
 * Calcula la TIR (Tasa Interna de Retorno) aproximada
 * @param {number} inversionInicial - Inversión inicial
 * @param {Array} flujos - Array de flujos de caja anuales
 * @returns {number} TIR en porcentaje
 */
function calcularTIR(inversionInicial, flujos) {
    let tirMin = 0;
    let tirMax = 1;
    let tir = 0.1;

    for (let i = 0; i < 100; i++) {
        let vpn = -inversionInicial;
        for (let j = 0; j < flujos.length; j++) {
            vpn += flujos[j] / Math.pow(1 + tir, j + 1);
        }

        if (Math.abs(vpn) < 1000) break;

        if (vpn > 0) {
            tirMin = tir;
            tir = (tir + tirMax) / 2;
        } else {
            tirMax = tir;
            tir = (tir + tirMin) / 2;
        }
    }

    return tir * 100;
}

/**
 * Calcula la capacidad de batería requerida
 * @param {number} energiaDiaria - Energía diaria en kWh
 * @param {number} diasAutonomia - Días de autonomía deseados
 * @param {number} profundidadDescarga - Profundidad de descarga permitida (0-100)
 * @returns {number} Capacidad de batería en kWh
 */
export function calcularCapacidadBateria(energiaDiaria, diasAutonomia = 2, profundidadDescarga = 80) {
    return (energiaDiaria * diasAutonomia) / (profundidadDescarga / 100);
}

/**
 * Formatea números a formato de moneda colombiana
 * @param {number} valor - Valor numérico
 * @returns {string} Valor formateado
 */
export function formatCOP(valor) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(valor);
}

/**
 * Formatea números con separadores de miles
 * @param {number} valor - Valor numérico
 * @param {number} decimales - Número de decimales
 * @returns {string} Valor formateado
 */
export function formatNumber(valor, decimales = 2) {
    return new Intl.NumberFormat('es-CO', {
        minimumFractionDigits: decimales,
        maximumFractionDigits: decimales
    }).format(valor);
}

/**
 * Genera múltiples configuraciones optimizadas según diferentes criterios
 * @param {Object} datosProyecto - Datos del proyecto del usuario
 * @returns {Array} Array de configuraciones optimizadas
 */
export function calcularConfiguraciones(datosProyecto) {
    // Import catalogs dynamically
    const panelesCatalog = [
        { modelo: "JA Solar Deep Blue 3.0", potencia_w: 565, eficiencia: 21.8, precio_cop: 520000, tier: 1, tecnologia: "Monocristalino PERC", dimensiones_m2: 2.59 },
        { modelo: "Canadian Solar HiKu6", potencia_w: 545, eficiencia: 21.3, precio_cop: 490000, tier: 1, tecnologia: "Monocristalino", dimensiones_m2: 2.56 },
        { modelo: "Longi Hi-MO 5", potencia_w: 550, eficiencia: 21.5, precio_cop: 510000, tier: 1, tecnologia: "Monocristalino PERC", dimensiones_m2: 2.57 },
        { modelo: "Trina Vertex S+", potencia_w: 430, eficiencia: 21.0, precio_cop: 380000, tier: 1, tecnologia: "Monocristalino", dimensiones_m2: 2.04 },
        { modelo: "Risen RSM120", potencia_w: 410, eficiencia: 20.2, precio_cop: 310000, tier: 2, tecnologia: "Monocristalino", dimensiones_m2: 2.04 },
        { modelo: "Jinko Tiger Neo", potencia_w: 580, eficiencia: 22.5, precio_cop: 680000, tier: 1, tecnologia: "N-Type TOPCon", dimensiones_m2: 2.58 },
    ];

    const inversoresCatalog = [
        { modelo: "Huawei SUN2000-5KTL-L1", potencia_kw: 5, eficiencia: 97.6, precio_cop: 2730000, tipo: "String on-grid", mppw: 2 },
        { modelo: "Huawei SUN2000-8KTL-M1", potencia_kw: 8, eficiencia: 98.0, precio_cop: 4200000, tipo: "String on-grid", mppw: 2 },
        { modelo: "Huawei SUN2000-3KTL-L1", potencia_kw: 3, eficiencia: 97.0, precio_cop: 1950000, tipo: "String on-grid", mppw: 2 },
        { modelo: "Growatt SPF 5000ES", potencia_kw: 5, eficiencia: 93.0, precio_cop: 2200000, tipo: "Híbrido", mppw: 2 },
        { modelo: "Deye SUN-8K-SG04LP3", potencia_kw: 8, eficiencia: 97.0, precio_cop: 5500000, tipo: "Híbrido", mppw: 2 },
        { modelo: "Fronius Primo 5.0", potencia_kw: 5, eficiencia: 98.1, precio_cop: 5200000, tipo: "String on-grid", mppw: 2 },
    ];

    const { consumoMensual, autonomiaPct, hsp, tipoConexion, tarifaKwh, trm, espacioLimitado, prioridad } = datosProyecto;

    // Calculate energy requirements
    const energiaDiaria = calcularEnergiaDiaria(consumoMensual, autonomiaPct);
    const potenciaPico = calcularPotenciaPico(energiaDiaria, hsp);

    // Generate configurations based on priority
    const configuraciones = [];

    // Sort panels by different criteria
    const panelesPorCosto = [...panelesCatalog].sort((a, b) => a.precio_cop / a.potencia_w - b.precio_cop / b.potencia_w);
    const panelesPorCalidad = [...panelesCatalog].sort((a, b) => (b.tier * 100 + b.eficiencia) - (a.tier * 100 + a.eficiencia));
    const panelesPorSostenibilidad = [...panelesCatalog].sort((a, b) => b.eficiencia - a.eficiencia);

    const tiposConfig = [
        { tipo: "Optimizado por Costo", paneles: panelesPorCosto, descripcion: "Minimiza inversión inicial" },
        { tipo: "Optimizado por Calidad", paneles: panelesPorCalidad, descripcion: "Equipos Tier 1 premium" },
        { tipo: "Optimizado por Sostenibilidad", paneles: panelesPorSostenibilidad, descripcion: "Mayor producción de energía limpia" },
    ];

    // Reorder based on user priority
    if (prioridad === 'calidad') {
        [tiposConfig[0], tiposConfig[1]] = [tiposConfig[1], tiposConfig[0]];
    } else if (prioridad === 'sostenibilidad') {
        [tiposConfig[0], tiposConfig[2]] = [tiposConfig[2], tiposConfig[0]];
    }

    for (const { tipo, paneles, descripcion } of tiposConfig) {
        const panel = paneles[0];
        const numPaneles = Math.ceil((potenciaPico * 1000) / panel.potencia_w);
        const potenciaReal = (numPaneles * panel.potencia_w) / 1000;
        const energiaMensual = potenciaReal * hsp * 30 * 0.8; // kWh/month

        // Select inverter
        const inversor = seleccionarInversor(potenciaReal, tipoConexion, inversoresCatalog);

        // Create configuration object
        const config = {
            tipo,
            descripcion,
            panel,
            numPaneles,
            potenciaReal,
            inversor,
            tipoConexion,
            energiaMensual,
            requiereBaterias: datosProyecto.requiereBaterias || false,
        };

        // Calculate budget
        const presupuesto = calcularPresupuesto(config, trm);
        config.presupuesto = presupuesto;

        // Calculate ROI
        const roi = calcularROI(presupuesto.inversionTotal, energiaMensual, tarifaKwh);
        config.roi = roi;

        configuraciones.push(config);
    }

    return configuraciones;
}
