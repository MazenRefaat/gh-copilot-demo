<template>
  <div class="sales-chart-container">
    <h2>Album Sales by Month</h2>

    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Loading sales data...</p>
    </div>

    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
      <button @click="loadSalesData" class="retry-btn">Try Again</button>
    </div>

    <div v-else>
      <div id="sales-chart" ref="chartContainer"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { generateSalesPlot } from "../utils/viz";

interface SalesData {
  month: string;
  year: number;
  albumsSold: number;
}

const chartContainer = ref<HTMLElement | null>(null);
const loading = ref<boolean>(true);
const error = ref<string | null>(null);

const loadSalesData = async (): Promise<void> => {
  try {
    loading.value = true;
    error.value = null;

    // Mock data - replace with actual API call when available
    // Example: const response = await axios.get<SalesData[]>('/api/sales')
    const mockData: SalesData[] = [
      { month: "January", year: 2024, albumsSold: 150 },
      { month: "February", year: 2024, albumsSold: 230 },
      { month: "March", year: 2024, albumsSold: 180 },
      { month: "April", year: 2024, albumsSold: 290 },
      { month: "May", year: 2024, albumsSold: 320 },
      { month: "June", year: 2024, albumsSold: 410 },
      { month: "July", year: 2024, albumsSold: 380 },
      { month: "August", year: 2024, albumsSold: 350 },
      { month: "September", year: 2024, albumsSold: 420 },
      { month: "October", year: 2024, albumsSold: 390 },
      { month: "November", year: 2024, albumsSold: 450 },
      { month: "December", year: 2024, albumsSold: 520 },
    ];

    // Small delay to simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Generate the plot
    generateSalesPlot(mockData, "sales-chart");
  } catch (err) {
    error.value = "Failed to load sales data.";
    console.error("Error loading sales data:", err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadSalesData();
});
</script>

<style scoped>
.sales-chart-container {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 900px;
  margin: 0 auto;
}

h2 {
  color: #333;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1.8rem;
}

#sales-chart {
  width: 100%;
  display: flex;
  justify-content: center;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: #666;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(102, 126, 234, 0.3);
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.error {
  text-align: center;
  padding: 3rem;
  color: #d9534f;
}

.error p {
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
}

.retry-btn {
  background: #667eea;
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 25px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-btn:hover {
  background: #5568d3;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
}

@media (max-width: 768px) {
  .sales-chart-container {
    padding: 1rem;
  }

  h2 {
    font-size: 1.4rem;
  }
}
</style>
