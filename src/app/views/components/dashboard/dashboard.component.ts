import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  data1: any;
  options1: any;

  data2: any;
  options2: any;
  ngOnInit() {
    //chart1
    const documentStyle1 = getComputedStyle(document.documentElement);
    const textColor1 = documentStyle1.getPropertyValue('--text-color');
    this.data1 = {
      labels: ['A', 'B', 'C'],
      datasets: [
        {
          data: [300, 50, 100],
          backgroundColor: [documentStyle1.getPropertyValue('--blue-500'), documentStyle1.getPropertyValue('--yellow-500'), documentStyle1.getPropertyValue('--green-500')],
          hoverBackgroundColor: [documentStyle1.getPropertyValue('--blue-400'), documentStyle1.getPropertyValue('--yellow-400'), documentStyle1.getPropertyValue('--green-400')]
        }
      ]
    };
    this.options1 = {
      cutout: '60%',
      plugins: {
        legend: {
          labels: {
            color: textColor1
          }
        }
      }
    };

    //chart2
    const documentStyle2 = getComputedStyle(document.documentElement);
    const textColor2 = documentStyle2.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle2.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle2.getPropertyValue('--surface-border');

    this.data2 = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'First Dataset',
          data: [65, 59, 80, 81, 56, 55, 40],
          fill: false,
          tension: 0.4,
          borderColor: documentStyle2.getPropertyValue('--blue-500')
        },
        {
          label: 'Second Dataset',
          data: [28, 48, 40, 19, 86, 27, 90],
          fill: false,
          borderDash: [5, 5],
          tension: 0.4,
          borderColor: documentStyle2.getPropertyValue('--teal-500')
        },
        {
          label: 'Third Dataset',
          data: [12, 51, 62, 33, 21, 62, 45],
          fill: true,
          borderColor: documentStyle2.getPropertyValue('--orange-500'),
          tension: 0.4,
          backgroundColor: 'rgba(255,167,38,0.2)'
        }
      ]
    };

    this.options2 = {
      maintainAspectRatio: false,
      aspectRatio: 1.1,
      plugins: {
        legend: {
          labels: {
            color: textColor2
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder
          }
        },
        y: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder
          }
        }
      }
    };
  }

  getTotal(): number {
    let total = 0;
    for (const dataset of this.data1.datasets) {
      for (const value of dataset.data) {
        total += value;
      }
    }
    return total;
  }
}
