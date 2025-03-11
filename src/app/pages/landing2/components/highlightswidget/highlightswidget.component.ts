import { Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { FluidModule } from 'primeng/fluid';
import { Chart } from 'chart.js';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'highlights-widget',
  standalone: true,
  imports: [ChartModule, FluidModule, RouterModule],
  templateUrl: './highlightswidget.component.html',
  styleUrls: ['./highlightswidget.component.scss']
})
export class HighlightsWidget implements OnInit {
  pieData: any;
  pieOptions: any;

  constructor() {}

  ngOnInit(): void {
    // Obtenemos los estilos del documento para usar los colores definidos
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color') || '#000';

    // Definimos un plugin para dibujar texto en el centro del gráfico
    const centerTextPlugin = {
        id: 'centerText',
        beforeDraw: function(chart: any) {
          const ctx = chart.ctx;
          const width = chart.width;
          const height = chart.height;
          ctx.restore();

          // Ajuste dinámico del tamaño de la fuente
          let fontSize = (height / 150).toFixed(2);
          ctx.font = fontSize + "em sans-serif";
          ctx.textBaseline = "middle";
          ctx.fillStyle = textColor;

          // Texto dividido en dos líneas
          const lines = ["ETAPAS", "DEL CONCURSO"];
          lines.forEach((line, index) => {
            const textX = Math.round((width - ctx.measureText(line).width) / 2);
            const textY = height / 2 + (index * 70) - 30; // Ajusta el espaciado entre líneas
            ctx.fillText(line, textX, textY);
          });

          ctx.save();
        }
      };


    // Registramos el plugin globalmente
    Chart.register(centerTextPlugin);

    // Configuración del gráfico, ajustamos el cutout para que el anillo sea más delgado
    this.pieOptions = {
      cutout: '80%', // Aumenta este valor para un anillo más delgado
      plugins: {
        legend: {
          display: false
        }
      }
    };

    this.pieData = {
      labels: [
        'ETAPA #1 INVESTIGACIÓN',
        'ETAPA #2 CONVOCATORIA',
        'ETAPA #3 FORMACIÓN EN METODOLOGÍAS Y PROTOTIPADO',
        'ETAPA #4 SISTEMATIZACIÓN DE DISPOSITIVOS',
        'ETAPA #5 EXHIBICIÓN Y CEREMONIA',
        'ETAPA #6 PRODUCCIÓN/IMPLEMENTACIÓN'
      ],
      datasets: [
        {
          data: [1, 1, 1, 1, 1, 1],
          backgroundColor: [
            documentStyle.getPropertyValue('--p-indigo-500') || '#5a67d8',
            documentStyle.getPropertyValue('--p-purple-500') || '#9f7aea',
            documentStyle.getPropertyValue('--p-teal-500') || '#38b2ac',
            documentStyle.getPropertyValue('--p-blue-500') || '#4299e1',
            documentStyle.getPropertyValue('--p-red-500') || '#f56565',
            documentStyle.getPropertyValue('--p-green-500') || '#48bb78'
          ],
          hoverBackgroundColor: [
            documentStyle.getPropertyValue('--p-indigo-400') || '#667eea',
            documentStyle.getPropertyValue('--p-purple-400') || '#b794f4',
            documentStyle.getPropertyValue('--p-teal-400') || '#4fd1c5',
            documentStyle.getPropertyValue('--p-blue-400') || '#63b3ed',
            documentStyle.getPropertyValue('--p-red-400') || '#fc8181',
            documentStyle.getPropertyValue('--p-green-400') || '#68d391'
          ]
        }
      ]
    };
  }
}
