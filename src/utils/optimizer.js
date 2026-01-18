// Algoritmo de optimización para generar configuraciones según preferencias

import {
    calcularEnergiaDiaria,
    calcularPotenciaPico,
    dimensionarPaneles,
    seleccionarInversor,
    calcularPresupuesto,
    calcularROI,
    calcularCapacidadBateria
} from './calculations.js';

/**
 * Optimiza la configuración del sistema según las preferencias del usuario
 * @param {Object} datosEntrada - Datos del proyecto ingresados por el usuario
 * @param {Object} catalogos - Catálogos de componentes
 * @returns {Array} Array con 3 configuraciones optimizadas
 */
export function optimizarConfiguracion(datosEntrada, catalogos) {
    const {
        consumoMensual,
        autonomiaPct,
        hsp,
        tipoConexion,
        requiereBaterias,
        espacioLimitado,
        presupuestoMaximo,
        tarifaKwh
    } = datosEntrada;

    const { paneles, inversores, baterias } = catalogos;

    // Cálculos base
    const energiaDiaria = calcularEnergiaDiaria(consumoMensual, autonomiaPct);
    const potenciaPico = calcularPotenciaPico(energiaDiaria, hsp);

    // Generar 3 configuraciones optimizadas
    const configuraciones = [];

    // 1. CONFIGURACIÓN OPTIMIZADA POR COSTO
    configuraciones.push(
        generarConfiguracionCosto(
            potenciaPico,
            energiaDiaria,
            tipoConexion,
            requiereBaterias,
            espacioLimitado,
            tarifaKwh,
            paneles,
            inversores,
            baterias
        )
    );

    // 2. CONFIGURACIÓN OPTIMIZADA POR CALIDAD
    configuraciones.push(
        generarConfiguracionCalidad(
            potenciaPico,
            energiaDiaria,
            tipoConexion,
            requiereBaterias,
            espacioLimitado,
            tarifaKwh,
            paneles,
            inversores,
            baterias
        )
    );

    // 3. CONFIGURACIÓN OPTIMIZADA POR SOSTENIBILIDAD (MEJOR ROI)
    configuraciones.push(
        generarConfiguracionSostenibilidad(
            potenciaPico,
            energiaDiaria,
            tipoConexion,
            requiereBaterias,
            espacioLimitado,
            tarifaKwh,
            paneles,
            inversores,
            baterias
        )
    );

    // Filtrar por presupuesto si se especificó
    if (presupuestoMaximo && presupuestoMaximo > 0) {
        return configuraciones.filter(config => config.presupuesto.inversionTotal <= presupuestoMaximo);
    }

    return configuraciones;
}

/**
 * Genera configuración optimizada por COSTO (menor inversión inicial)
 */
function generarConfiguracionCosto(
    potenciaPico,
    energiaDiaria,
    tipoConexion,
    requiereBaterias,
    espacioLimitado,
    tarifaKwh,
    paneles,
    inversores,
    baterias
) {
    // Ordenar paneles por menor costo por Wp
    const panelesEconomicos = [...paneles].sort(
        (a, b) => a.precio_cop / a.potencia_w - b.precio_cop / b.potencia_w
    );

    const configPaneles = dimensionarPaneles(potenciaPico, panelesEconomicos, espacioLimitado);
    const inversor = seleccionarInversor(configPaneles.potenciaReal, tipoConexion, inversores);

    let bateria = null;
    let capacidadBateria = 0;
    if (requiereBaterias) {
        capacidadBateria = calcularCapacidadBateria(energiaDiaria);
        // Seleccionar batería más económica
        bateria = [...baterias].sort((a, b) => a.precio_cop / a.capacidad_kwh - b.precio_cop / b.capacidad_kwh)[0];
    }

    const configuracion = {
        ...configPaneles,
        inversor,
        requiereBaterias,
        capacidadBateria,
        bateria
    };

    const presupuesto = calcularPresupuesto(configuracion);
    const energiaMensual = (configPaneles.potenciaReal * 30 * energiaDiaria) / potenciaPico;
    const roi = calcularROI(presupuesto.inversionTotal, energiaMensual, tarifaKwh);

    return {
        tipo: 'Optimizado por Costo',
        descripcion: 'Minimiza la inversión inicial con componentes económicos de calidad',
        prioridad: 'costo',
        ...configPaneles,
        inversor,
        bateria,
        capacidadBateria,
        presupuesto,
        roi,
        puntuacion: calcularPuntuacionCosto(presupuesto, roi)
    };
}

/**
 * Genera configuración optimizada por CALIDAD (máxima eficiencia y confiabilidad)
 */
function generarConfiguracionCalidad(
    potenciaPico,
    energiaDiaria,
    tipoConexion,
    requiereBaterias,
    espacioLimitado,
    tarifaKwh,
    paneles,
    inversores,
    baterias
) {
    // Ordenar paneles por mayor eficiencia y tecnología premium
    const panelesPremium = [...paneles].sort((a, b) => {
        // Priorizar N-Type y TOPCon
        const scoreA = a.eficiencia + (a.tecnologia.includes('N-Type') || a.tecnologia.includes('TOPCon') ? 2 : 0);
        const scoreB = b.eficiencia + (b.tecnologia.includes('N-Type') || b.tecnologia.includes('TOPCon') ? 2 : 0);
        return scoreB - scoreA;
    });

    const configPaneles = dimensionarPaneles(potenciaPico, panelesPremium, espacioLimitado);

    // Seleccionar inversores premium (Fronius, SMA)
    const inversoresPremium = inversores.filter(inv =>
        inv.marca === 'Fronius' || inv.marca === 'SMA'
    );
    const inversor = seleccionarInversor(
        configPaneles.potenciaReal,
        tipoConexion,
        inversoresPremium.length > 0 ? inversoresPremium : inversores
    );

    let bateria = null;
    let capacidadBateria = 0;
    if (requiereBaterias) {
        capacidadBateria = calcularCapacidadBateria(energiaDiaria);
        // Seleccionar batería premium (mayor ciclos de vida)
        bateria = [...baterias].sort((a, b) => b.ciclos_vida - a.ciclos_vida)[0];
    }

    const configuracion = {
        ...configPaneles,
        inversor,
        requiereBaterias,
        capacidadBateria,
        bateria
    };

    const presupuesto = calcularPresupuesto(configuracion);
    const energiaMensual = (configPaneles.potenciaReal * 30 * energiaDiaria) / potenciaPico;
    const roi = calcularROI(presupuesto.inversionTotal, energiaMensual, tarifaKwh);

    return {
        tipo: 'Optimizado por Calidad',
        descripcion: 'Máxima eficiencia con componentes premium y mayor garantía',
        prioridad: 'calidad',
        ...configPaneles,
        inversor,
        bateria,
        capacidadBateria,
        presupuesto,
        roi,
        puntuacion: calcularPuntuacionCalidad(configPaneles, inversor, bateria)
    };
}

/**
 * Genera configuración optimizada por SOSTENIBILIDAD (mejor ROI)
 */
function generarConfiguracionSostenibilidad(
    potenciaPico,
    energiaDiaria,
    tipoConexion,
    requiereBaterias,
    espacioLimitado,
    tarifaKwh,
    paneles,
    inversores,
    baterias
) {
    // Balance entre costo y eficiencia - buscar mejor relación calidad-precio
    const panelesBalanceados = [...paneles].sort((a, b) => {
        const scoreA = (a.eficiencia * a.garantia_anos) / (a.precio_cop / a.potencia_w);
        const scoreB = (b.eficiencia * b.garantia_anos) / (b.precio_cop / b.potencia_w);
        return scoreB - scoreA;
    });

    const configPaneles = dimensionarPaneles(potenciaPico, panelesBalanceados, espacioLimitado);

    // Seleccionar inversores con mejor eficiencia
    const inversoresEficientes = [...inversores].sort((a, b) => b.eficiencia - a.eficiencia);
    const inversor = seleccionarInversor(configPaneles.potenciaReal, tipoConexion, inversoresEficientes);

    let bateria = null;
    let capacidadBateria = 0;
    if (requiereBaterias) {
        capacidadBateria = calcularCapacidadBateria(energiaDiaria);
        // Balance entre costo y ciclos de vida
        bateria = [...baterias].sort((a, b) => {
            const scoreA = a.ciclos_vida / (a.precio_cop / a.capacidad_kwh);
            const scoreB = b.ciclos_vida / (b.precio_cop / b.capacidad_kwh);
            return scoreB - scoreA;
        })[0];
    }

    const configuracion = {
        ...configPaneles,
        inversor,
        requiereBaterias,
        capacidadBateria,
        bateria
    };

    const presupuesto = calcularPresupuesto(configuracion);
    const energiaMensual = (configPaneles.potenciaReal * 30 * energiaDiaria) / potenciaPico;
    const roi = calcularROI(presupuesto.inversionTotal, energiaMensual, tarifaKwh);

    return {
        tipo: 'Optimizado por Sostenibilidad',
        descripcion: 'Mejor retorno de inversión con balance costo-beneficio óptimo',
        prioridad: 'sostenibilidad',
        ...configPaneles,
        inversor,
        bateria,
        capacidadBateria,
        presupuesto,
        roi,
        puntuacion: calcularPuntuacionSostenibilidad(presupuesto, roi)
    };
}

/**
 * Calcula puntuación para configuración de costo
 */
function calcularPuntuacionCosto(presupuesto, roi) {
    // Menor costo = mayor puntuación
    return 100 - (presupuesto.costoPorWp / 50); // Normalizado
}

/**
 * Calcula puntuación para configuración de calidad
 */
function calcularPuntuacionCalidad(configPaneles, inversor, bateria) {
    let puntuacion = configPaneles.panel.eficiencia * 4; // 0-100
    puntuacion += inversor.eficiencia - 95; // Bonus por eficiencia
    if (bateria) {
        puntuacion += (bateria.ciclos_vida / 6000) * 10; // Bonus por ciclos
    }
    return Math.min(100, puntuacion);
}

/**
 * Calcula puntuación para configuración de sostenibilidad
 */
function calcularPuntuacionSostenibilidad(presupuesto, roi) {
    // Mejor ROI y menor tiempo de retorno = mayor puntuación
    const puntuacionROI = Math.min(50, roi.roi / 10);
    const puntuacionRetorno = Math.max(0, 50 - roi.tiempoRetornoAnos * 5);
    return puntuacionROI + puntuacionRetorno;
}
