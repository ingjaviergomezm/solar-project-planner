import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { formatCOP, formatNumber } from '../utils/calculations';
import { FileDown } from 'lucide-react';

export default function PDFGenerator({ datosProyecto, configuracion, recomendacionesIA }) {
    const generarPDF = () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        let yPos = 20;

        // Portada
        doc.setFillColor(249, 115, 22); // solar-500
        doc.rect(0, 0, pageWidth, 60, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(28);
        doc.setFont('helvetica', 'bold');
        doc.text('Solar Project Planner', pageWidth / 2, 30, { align: 'center' });

        doc.setFontSize(14);
        doc.setFont('helvetica', 'normal');
        doc.text('Reporte de Dimensionamiento y Presupuestación', pageWidth / 2, 45, { align: 'center' });

        yPos = 75;
        doc.setTextColor(0, 0, 0);

        // Información del Proyecto
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('Información del Proyecto', 14, yPos);
        yPos += 10;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        const infoProyecto = [
            ['Nombre', datosProyecto.nombreProyecto],
            ['Tipo', datosProyecto.tipoInstalacion],
            ['Ubicación', `${datosProyecto.ciudad}, Colombia`],
            ['HSP', `${datosProyecto.hsp} h/día`],
            ['Consumo Mensual', `${formatNumber(datosProyecto.consumoMensual, 0)} kWh`],
            ['Autonomía Deseada', `${datosProyecto.autonomiaPct}%`],
            ['Tipo de Conexión', datosProyecto.tipoConexion],
        ];

        doc.autoTable({
            startY: yPos,
            head: [],
            body: infoProyecto,
            theme: 'plain',
            styles: { fontSize: 10 },
            columnStyles: {
                0: { fontStyle: 'bold', cellWidth: 50 },
                1: { cellWidth: 'auto' }
            }
        });

        yPos = doc.lastAutoTable.finalY + 15;

        // Configuración Seleccionada
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text(`Configuración: ${configuracion.tipo}`, 14, yPos);
        yPos += 10;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(configuracion.descripcion, 14, yPos, { maxWidth: pageWidth - 28 });
        yPos += 15;

        // Especificaciones Técnicas
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Especificaciones Técnicas', 14, yPos);
        yPos += 8;

        const especificaciones = [
            ['Potencia del Sistema', `${formatNumber(configuracion.potenciaReal, 2)} kWp`],
            ['Paneles Solares', `${configuracion.numPaneles}x ${configuracion.panel.marca} ${configuracion.panel.modelo}`],
            ['Potencia por Panel', `${configuracion.panel.potencia_w}W`],
            ['Eficiencia', `${configuracion.panel.eficiencia}%`],
            ['Tecnología', configuracion.panel.tecnologia],
            ['Área Requerida', `${formatNumber(configuracion.areaRequerida, 1)} m²`],
            ['Inversor', `${configuracion.inversor.marca} ${configuracion.inversor.modelo}`],
            ['Potencia Inversor', `${configuracion.inversor.potencia_kw}kW`],
            ['Eficiencia Inversor', `${configuracion.inversor.eficiencia}%`],
        ];

        if (configuracion.bateria) {
            const numBaterias = Math.ceil(configuracion.capacidadBateria / configuracion.bateria.capacidad_kwh);
            especificaciones.push(
                ['Baterías', `${numBaterias}x ${configuracion.bateria.marca} ${configuracion.bateria.modelo}`],
                ['Capacidad Total', `${formatNumber(configuracion.capacidadBateria, 1)} kWh`],
                ['Tecnología Batería', configuracion.bateria.tecnologia]
            );
        }

        doc.autoTable({
            startY: yPos,
            head: [],
            body: especificaciones,
            theme: 'striped',
            styles: { fontSize: 9 },
            columnStyles: {
                0: { fontStyle: 'bold', cellWidth: 70 },
                1: { cellWidth: 'auto' }
            }
        });

        yPos = doc.lastAutoTable.finalY + 15;

        // Nueva página para análisis financiero
        if (yPos > 240) {
            doc.addPage();
            yPos = 20;
        }

        // Análisis Financiero
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Análisis Financiero', 14, yPos);
        yPos += 8;

        const presupuesto = configuracion.presupuesto;
        const desglose = [
            ['Paneles Solares', formatCOP(presupuesto.costoPaneles)],
            ['Inversor', formatCOP(presupuesto.costoInversor)],
            ['Estructura de Montaje', formatCOP(presupuesto.costoEstructura)],
            ['Protecciones DC (Caja/DPS/Fusibles)', formatCOP(presupuesto.costoProteccionesDC)],
            ['Protecciones AC (Tablero/Breaker/DPS)', formatCOP(presupuesto.costoProteccionesAC)],
            ['Puesta a Tierra RETIE', formatCOP(presupuesto.costoPuestaATierra)],
            ['Cableado Fotovoltaico', formatCOP(presupuesto.costoCableado)],
            ['Mano de Obra Instalación', formatCOP(presupuesto.costoManoObra)],
            ['Ingeniería y Diseño', formatCOP(presupuesto.costoIngenieria)],
            ['Trámites Operador de Red', formatCOP(presupuesto.costoTramitesOperador)],
            ['Certificación RETIE', formatCOP(presupuesto.costoCertificacionRETIE)],
        ];

        if (presupuesto.costoBaterias > 0) {
            desglose.push(['Baterías', formatCOP(presupuesto.costoBaterias)]);
        }

        if (presupuesto.costoTramitesUPME > 0) {
            desglose.push(['Trámites UPME', formatCOP(presupuesto.costoTramitesUPME)]);
        }

        desglose.push(['Imprevistos y Logística (5%)', formatCOP(presupuesto.costoImprevistos)]);
        desglose.push(['Gestión Comercial y Administrativa', formatCOP(presupuesto.margenComercial)]);

        desglose.push(['INVERSIÓN TOTAL', formatCOP(presupuesto.inversionTotal)]);
        desglose.push(['Costo por Wp', formatCOP(presupuesto.costoPorWp)]);

        doc.autoTable({
            startY: yPos,
            head: [],
            body: desglose,
            theme: 'striped',
            styles: { fontSize: 9 },
            columnStyles: {
                0: { fontStyle: 'bold', cellWidth: 70 },
                1: { cellWidth: 'auto', halign: 'right' }
            },
            didParseCell: function (data) {
                if (data.row.index === desglose.length - 2) {
                    data.cell.styles.fillColor = [249, 115, 22];
                    data.cell.styles.textColor = [255, 255, 255];
                    data.cell.styles.fontStyle = 'bold';
                }
            }
        });

        yPos = doc.lastAutoTable.finalY + 15;

        // ROI
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Retorno de Inversión', 14, yPos);
        yPos += 8;

        const roi = configuracion.roi;
        const roiData = [
            ['Ahorro Mensual', formatCOP(roi.ahorroMensual)],
            ['Ahorro Anual', formatCOP(roi.ahorroAnual)],
            ['Tiempo de Retorno', `${roi.tiempoRetornoAnos} años`],
            ['Ahorro Total (25 años)', formatCOP(roi.ahorroTotal25Anos)],
            ['Ganancia Total', formatCOP(roi.gananciaTotal)],
            ['ROI', `${formatNumber(roi.roi, 1)}%`],
        ];

        doc.autoTable({
            startY: yPos,
            head: [],
            body: roiData,
            theme: 'plain',
            styles: { fontSize: 10 },
            columnStyles: {
                0: { fontStyle: 'bold', cellWidth: 70 },
                1: { cellWidth: 'auto', halign: 'right' }
            }
        });

        // Recomendaciones de IA (si existen)
        if (recomendacionesIA) {
            doc.addPage();
            yPos = 20;

            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text('Recomendaciones de IA', 14, yPos);
            yPos += 10;

            doc.setFontSize(9);
            doc.setFont('helvetica', 'normal');
            const splitText = doc.splitTextToSize(recomendacionesIA, pageWidth - 28);
            doc.text(splitText, 14, yPos);
        }

        // Footer en todas las páginas
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(128, 128, 128);
            doc.text(
                `Página ${i} de ${pageCount} | Generado el ${new Date().toLocaleDateString('es-CO')}`,
                pageWidth / 2,
                doc.internal.pageSize.getHeight() - 10,
                { align: 'center' }
            );
        }

        // Guardar PDF
        const fileName = `${datosProyecto.nombreProyecto.replace(/\s+/g, '_')}_${configuracion.tipo.replace(/\s+/g, '_')}.pdf`;
        doc.save(fileName);
    };

    return (
        <button
            onClick={generarPDF}
            className="btn-primary flex items-center justify-center gap-2 w-full md:w-auto"
        >
            <FileDown className="w-5 h-5" />
            Descargar PDF
        </button>
    );
}
