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
  pieData!: { labels: { id: string; nombre: string; color: string }[]; datasets: any[] };
  pieOptions: any;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color') || '#000';

    // Definimos un plugin para el texto en el centro del gráfico
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

    this.pieOptions = {
      cutout: '80%',
      plugins: {
        legend: { display: false }
      }
    };

    this.pieData = {
      labels: [
        { id: 'ETAPA 1', nombre: 'INVESTIGACIÓN', color: '#FF5733' },
        { id: 'ETAPA 2', nombre: 'CONVOCATORIA', color: '#33A1FF' },
        { id: 'ETAPA 3', nombre: 'FORMACIÓN EN METODOLOGÍAS Y PROTOTIPADO', color: '#33FF57' },
        { id: 'ETAPA 4', nombre: 'SISTEMATIZACIÓN DE DISPOSITIVOS', color: '#FFC300' },
        { id: 'ETAPA 5', nombre: 'EXHIBICIÓN Y CEREMONIA', color: '#A633FF' },
        { id: 'ETAPA 6', nombre: 'PRODUCCIÓN/IMPLEMENTACIÓN', color: '#FF33A1' }
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
      volverAtras() {
        this.router.navigate(['/']);
      }
      validarUsuario() {
        Swal.fire({
          title: 'Iniciar sesión',
          html: `
            <input id="swal-usuario" class="swal2-input" placeholder="Usuario">
            <input id="swal-password" type="password" class="swal2-input" placeholder="Contraseña">
          `,
          confirmButtonText: 'Ingresar',
          focusConfirm: false,
          preConfirm: () => {
            const usuario = (document.getElementById('swal-usuario') as HTMLInputElement).value;
            const password = (document.getElementById('swal-password') as HTMLInputElement).value;

            if (usuario === 'admin' && password === 'admin123') {
              return { success: true };
            } else {
              return { success: false, message: 'Usuario o contraseña incorrectos' };
            }
          }
        }).then((result) => {
          if (result.value?.success) {
            Swal.fire({
              icon: 'success',
              title: 'Acceso concedido',
              text: 'Redirigiendo...',
              timer: 1500,
              showConfirmButton: false
            });

            setTimeout(() => {
              this.router.navigate(['/list']); // Redirigir a localhost:4200/list
            }, 1500);
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: result.value?.message || 'Algo salió mal',
            });
          }
        });
      }
}
