import { Component, type OnInit, ViewChild, type ElementRef } from "@angular/core"
import { CommonModule } from "@angular/common"
import { HttpClient, HttpClientModule, HttpHeaders } from "@angular/common/http"
import { Chart, registerables } from "chart.js"

// Angular Material Imports
import { MatCardModule } from "@angular/material/card"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar"
import { MatTooltipModule } from "@angular/material/tooltip"

// Register all Chart.js components
Chart.register(...registerables)

interface WarrantyData {
  id: string
  productName: string
  expirationDate: string
  purchaseDate: string
  category: string
  // Add other fields as needed
}

interface MonthlyData {
  month: string
  count: number
  color?: string
}

interface CategoryData {
  category: string
  count: number
}

interface StatusData {
  status: string
  count: number
}

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTooltipModule,
  ],
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit {
  @ViewChild("monthlyChart") monthlyChartRef!: ElementRef
  @ViewChild("categoryChart") categoryChartRef!: ElementRef
  @ViewChild("statusChart") statusChartRef!: ElementRef
  @ViewChild("trendChart") trendChartRef!: ElementRef

  warrantiesByMonth: MonthlyData[] = []
  warrantiesByCategory: CategoryData[] = []
  warrantiesByStatus: StatusData[] = []
  trendData: { months: string[]; expirations: number[]; additions: number[] } = { months: [], expirations: [], additions: [] }

  totalWarranties = 0
  expiringThisMonth = 0
  expiredWarranties = 0
  averageWarrantyLength = 0

  isLoading = true
  error: string | null = null

  // Chart instances
  monthlyChart: Chart | null = null
  categoryChart: Chart | null = null
  statusChart: Chart | null = null
  trendChart: Chart | null = null

  // Color palette for charts
  chartColors = [
    "rgba(75, 192, 192, 0.7)",
    "rgba(54, 162, 235, 0.7)",
    "rgba(153, 102, 255, 0.7)",
    "rgba(255, 159, 64, 0.7)",
    "rgba(255, 99, 132, 0.7)",
    "rgba(255, 206, 86, 0.7)",
    "rgba(231, 233, 237, 0.7)",
    "rgba(97, 205, 187, 0.7)",
    "rgba(140, 91, 143, 0.7)",
    "rgba(232, 126, 4, 0.7)",
    "rgba(148, 159, 177, 0.7)",
    "rgba(77, 83, 96, 0.7)",
  ]

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.loadData()
  }

  loadData(): void {
    const token = sessionStorage.getItem("token")

    if (!token) {
      this.error = "Authentication token not found"
      this.isLoading = false
      this.showNotification("Authentication error. Please login again.", "error")
      return
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    })

    this.http.get<WarrantyData[]>("https://warranty-server-g7vn.onrender.com/api/Warranty", { headers }).subscribe({
      next: (data) => {
        this.processData(data)
        this.isLoading = false
      },
      error: (err) => {
        console.error("Error fetching warranty data:", err)
        this.error = "Failed to load warranty data"
        this.isLoading = false
        this.showNotification("Failed to load data. Please try again later.", "error")
      },
    })
  }

  processData(data: WarrantyData[]): void {
    if (!data || data.length === 0) {
      this.error = "No warranty data available"
      return
    }

    this.totalWarranties = data.length

    // Process monthly data
    this.warrantiesByMonth = this.groupByExpirationMonth(data)

    // Process category data
    this.warrantiesByCategory = this.groupByCategory(data)

    // Process status data
    this.warrantiesByStatus = this.groupByStatus(data)

    // Calculate expiring this month
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    this.expiringThisMonth = data.filter((w) => {
      const expDate = new Date(w.expirationDate)
      return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear
    }).length

    // Calculate expired warranties
    const today = new Date()
    this.expiredWarranties = data.filter((w) => new Date(w.expirationDate) < today).length

    // Calculate average warranty length in months
    let totalMonths = 0
    data.forEach((w) => {
      const purchaseDate = new Date(w.purchaseDate)
      const expirationDate = new Date(w.expirationDate)
      const diffTime = Math.abs(expirationDate.getTime() - purchaseDate.getTime())
      const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30))
      totalMonths += diffMonths
    })
    this.averageWarrantyLength = Math.round(totalMonths / data.length)

    // Generate trend data (last 12 months)
    this.trendData = this.generateTrendData(data)

    // Initialize charts after data is processed
    setTimeout(() => {
      this.initializeCharts()
    }, 0)
  }

  groupByExpirationMonth(data: WarrantyData[]): MonthlyData[] {
    const groups: Record<string, number> = {}
    const sortedMonths: string[] = []

    // Get next 12 months
    const today = new Date()
    for (let i = 0; i < 12; i++) {
      const date = new Date(today.getFullYear(), today.getMonth() + i, 1)
      const monthYear = date.toLocaleString("default", { month: "long", year: "numeric" })
      groups[monthYear] = 0
      sortedMonths.push(monthYear)
    }

    // Count warranties by month
    data.forEach((w) => {
      const expDate = new Date(w.expirationDate)
      const month = expDate.toLocaleString("default", { month: "long", year: "numeric" })
      if (groups[month] !== undefined) {
        groups[month] += 1
      }
    })

    // Convert to array and add colors
    return sortedMonths.map((month, index) => ({
      month,
      count: groups[month],
      color: this.chartColors[index % this.chartColors.length],
    }))
  }

  groupByCategory(data: WarrantyData[]): CategoryData[] {
    const groups: Record<string, number> = {}

    data.forEach((w) => {
      const category = w.category || "Uncategorized"
      groups[category] = (groups[category] || 0) + 1
    })

    return Object.entries(groups).map(([category, count]) => ({ category, count }))
  }

  groupByStatus(data: WarrantyData[]): StatusData[] {
    const today = new Date()
    const nextMonth = new Date()
    nextMonth.setMonth(nextMonth.getMonth() + 1)

    let active = 0
    let expiringSoon = 0
    let expired = 0

    data.forEach((w) => {
      const expDate = new Date(w.expirationDate)
      if (expDate < today) {
        expired++
      } else if (expDate < nextMonth) {
        expiringSoon++
      } else {
        active++
      }
    })

    return [
      { status: "Active", count: active },
      { status: "Expiring Soon", count: expiringSoon },
      { status: "Expired", count: expired },
    ]
  }

  generateTrendData(data: WarrantyData[]): { months: string[]; expirations: number[]; additions: number[] } {
    const months: string[] = []
    const expirations: number[] = []
    const additions: number[] = []

    // Get last 12 months
    const today = new Date()
    for (let i = 11; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1)
      const monthYear = date.toLocaleString("default", { month: "short", year: "2-digit" })
      months.push(monthYear)

      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1)
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0)

      // Count expirations in this month
      const expCount = data.filter((w) => {
        const expDate = new Date(w.expirationDate)
        return expDate >= monthStart && expDate <= monthEnd
      }).length
      expirations.push(expCount)

      // Count additions in this month
      const addCount = data.filter((w) => {
        const purchaseDate = new Date(w.purchaseDate)
        return purchaseDate >= monthStart && purchaseDate <= monthEnd
      }).length
      additions.push(addCount)
    }

    return { months, expirations, additions } as { months: string[]; expirations: number[]; additions: number[] }
  }

  initializeCharts(): void {
    this.initializeMonthlyChart()
    this.initializeCategoryChart()
    this.initializeStatusChart()
    this.initializeTrendChart()
  }

  initializeMonthlyChart(): void {
    if (this.monthlyChartRef && this.monthlyChartRef.nativeElement) {
      const ctx = this.monthlyChartRef.nativeElement.getContext("2d")

      if (this.monthlyChart) {
        this.monthlyChart.destroy()
      }

      this.monthlyChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: this.warrantiesByMonth.map((item) => item.month),
          datasets: [
            {
              label: "Warranties Expiring",
              data: this.warrantiesByMonth.map((item) => item.count),
              backgroundColor: this.warrantiesByMonth.map((item) => item.color),
              borderColor: this.warrantiesByMonth.map((item) => item.color?.replace("0.7", "1")),
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
            title: {
              display: true,
              text: "Warranty Expirations by Month",
              font: {
                size: 16,
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                precision: 0,
              },
            },
          },
        },
      })
    }
  }

  initializeCategoryChart(): void {
    if (this.categoryChartRef && this.categoryChartRef.nativeElement) {
      const ctx = this.categoryChartRef.nativeElement.getContext("2d")

      if (this.categoryChart) {
        this.categoryChart.destroy()
      }

      this.categoryChart = new Chart(ctx, {
        type: "pie",
        data: {
          labels: this.warrantiesByCategory.map((item) => item.category),
          datasets: [
            {
              data: this.warrantiesByCategory.map((item) => item.count),
              backgroundColor: this.chartColors.slice(0, this.warrantiesByCategory.length),
              borderColor: "#ffffff",
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "right",
            },
            title: {
              display: true,
              text: "Warranties by Category",
              font: {
                size: 16,
              },
            },
          },
        },
      })
    }
  }

  initializeStatusChart(): void {
    if (this.statusChartRef && this.statusChartRef.nativeElement) {
      const ctx = this.statusChartRef.nativeElement.getContext("2d")

      if (this.statusChart) {
        this.statusChart.destroy()
      }

      const statusColors = [
        "rgba(75, 192, 192, 0.7)", // Active - Green
        "rgba(255, 206, 86, 0.7)", // Expiring Soon - Yellow
        "rgba(255, 99, 132, 0.7)", // Expired - Red
      ]

      this.statusChart = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: this.warrantiesByStatus.map((item) => item.status),
          datasets: [
            {
              data: this.warrantiesByStatus.map((item) => item.count),
              backgroundColor: statusColors,
              borderColor: "#ffffff",
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom",
            },
            title: {
              display: true,
              text: "Warranty Status",
              font: {
                size: 16,
              },
            },
          },
        },
      })
    }
  }

  initializeTrendChart(): void {
    if (this.trendChartRef && this.trendChartRef.nativeElement) {
      const ctx = this.trendChartRef.nativeElement.getContext("2d")

      if (this.trendChart) {
        this.trendChart.destroy()
      }

      this.trendChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: this.trendData.months,
          datasets: [
            {
              label: "Expirations",
              data: this.trendData.expirations,
              borderColor: "rgba(255, 99, 132, 1)",
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              borderWidth: 2,
              fill: true,
              tension: 0.4,
            },
            {
              label: "New Warranties",
              data: this.trendData.additions,
              borderColor: "rgba(54, 162, 235, 1)",
              backgroundColor: "rgba(54, 162, 235, 0.2)",
              borderWidth: 2,
              fill: true,
              tension: 0.4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "top",
            },
            title: {
              display: true,
              text: "Warranty Trends (Last 12 Months)",
              font: {
                size: 16,
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                precision: 0,
              },
            },
          },
        },
      })
    }
  }

  showNotification(message: string, type: "success" | "error" | "info"): void {
    this.snackBar.open(message, "Close", {
      duration: 5000,
      horizontalPosition: "end",
      verticalPosition: "top",
      panelClass: [`notification-${type}`],
    })
  }

  refreshData(): void {
    this.isLoading = true
    this.error = null
    this.loadData()
  }
}

