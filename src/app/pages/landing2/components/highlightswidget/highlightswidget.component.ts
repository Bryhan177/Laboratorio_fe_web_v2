import { Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { CommonModule } from '@angular/common';
import { FluidModule } from 'primeng/fluid';
import { Chart } from 'chart.js';
import { RouterModule } from '@angular/router';
import { AppFloatingConfigurator } from "../../../../layout/component/app.floatingconfigurator";
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'highlights-widget',
  standalone: true,
  imports: [ChartModule, FluidModule, RouterModule, AppFloatingConfigurator, CommonModule],
  templateUrl: './highlightswidget.component.html',
  styleUrls: ['./highlightswidget.component.scss']
})
export class HighlightsWidget implements OnInit {
  pieData!: { labels: string[]; datasets: any[] };
  pieOptions: any;
  etapas!: { id: string; nombre: string; color: string }[];

  constructor(private router: Router) {}

  ngOnInit(): void {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color') || '#000';

    // Plugin para texto en el centro del gráfico
    const centerTextPlugin = {
      id: 'centerText',
      beforeDraw: function (chart: any) {
        const ctx = chart.ctx;
        const width = chart.width;
        const height = chart.height;
        ctx.restore();

        let fontSize = (height / 150).toFixed(2);
        ctx.font = fontSize + "em sans-serif";
        ctx.textBaseline = "middle";
        ctx.fillStyle = textColor;

        const lines = ["ETAPAS", "DEL CONCURSO"];
        lines.forEach((line, index) => {
          const textX = Math.round((width - ctx.measureText(line).width) / 2);
          const textY = height / 2 + index * 70 - 30;
          ctx.fillText(line, textX, textY);
        });

        ctx.save();
      }
    };

    Chart.register(centerTextPlugin);

    // Definición de etapas con ID, nombre y color
    this.etapas = [
      { id: 'ETAPA 1', nombre: 'INVESTIGACIÓN', color: '#FF5733' },
      { id: 'ETAPA 2', nombre: 'CONVOCATORIA', color: '#33A1FF' },
      { id: 'ETAPA 3', nombre: 'FORMACIÓN EN METODOLOGÍAS Y PROTOTIPADO', color: '#33FF57' },
      { id: 'ETAPA 4', nombre: 'SISTEMATIZACIÓN DE DISPOSITIVOS', color: '#FFC300' },
      { id: 'ETAPA 5', nombre: 'EXHIBICIÓN Y CEREMONIA', color: '#A633FF' },
      { id: 'ETAPA 6', nombre: 'PRODUCCIÓN/IMPLEMENTACIÓN', color: '#FF33A1' }
    ];

    this.pieData = {
      labels: this.etapas.map(etapa => etapa.nombre), // Extraemos solo los nombres
      datasets: [
        {
          data: this.etapas.map(() => 1), // Todas las etapas con el mismo peso
          backgroundColor: this.etapas.map(etapa => etapa.color),
          hoverBackgroundColor: this.etapas.map(etapa => this.darkenColor(etapa.color, 0.2))
        }
      ]
    };

    this.pieOptions = {
      cutout: '80%',
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (tooltipItem: any) => {
              const index = tooltipItem.dataIndex;
              return `${this.etapas[index].id}: ${this.etapas[index].nombre}`;
            }
          }
        }
      }
    };
  }

  mostrarVideo() {
    Swal.fire({
        toast: true,
      title: '🎉 Inscribete ahora 🎉',
      html: `
        <video width="100%" controls autoplay>
          <source src="assets/mp4/Concurso.mov" type="video/mp4">
          Tu navegador no soporta el formato de video.
        </video>
      `,
      width: '600px',
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      },
      showCloseButton: true,
      showConfirmButton: false
    });
  }


  // Función para oscurecer el color en hover
  private darkenColor(color: string, amount: number): string {
    const usePound = color[0] === "#";
    let num = parseInt(color.slice(1), 16);
    let r = (num >> 16) - (amount * 255);
    let g = ((num >> 8) & 0x00FF) - (amount * 255);
    let b = (num & 0x0000FF) - (amount * 255);

    r = Math.max(0, Math.min(255, r));
    g = Math.max(0, Math.min(255, g));
    b = Math.max(0, Math.min(255, b));

    return (usePound ? "#" : "") + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }
}
