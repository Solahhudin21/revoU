fetch('json/nycPropSales.json')
.then((response) => response.json())
.then((data) => {
    // Proses data
    const salesByBuildingClass = {};
    const avgPriceByBuildingClass = {};

    data.forEach((property) => {
        const buildingClass = property.BUILDING_CLASS_CATEGORY;
        const salePrice = parseFloat(property.SALE_PRICE || 0);

        // Total Penjualan berdasarkan Kelas Bangunan
        if (salePrice > 0) {
            if (!salesByBuildingClass[buildingClass]) {
                salesByBuildingClass[buildingClass] = 1;
            } else {
                salesByBuildingClass[buildingClass] += 1;
            }
        }

        // Rata-rata Harga Penjualan berdasarkan Kelas Bangunan
        if (!avgPriceByBuildingClass[buildingClass]) {
            avgPriceByBuildingClass[buildingClass] = [salePrice, 1]; // [totalPrice, count]
        } else {
            avgPriceByBuildingClass[buildingClass][0] += salePrice;
            avgPriceByBuildingClass[buildingClass][1] += 1;
        }
    });

    // Hitung rata-rata harga jual
    Object.keys(avgPriceByBuildingClass).forEach((buildingClass) => {
        const [totalPrice, count] = avgPriceByBuildingClass[buildingClass];
        avgPriceByBuildingClass[buildingClass] = totalPrice / count;
    });

    // Isi dropdown filter
    const filterDropdown = document.getElementById('buildingClassFilter');
    Object.keys(salesByBuildingClass).forEach((buildingClass) => {
        const option = document.createElement('option');
        option.value = buildingClass;
        option.text = buildingClass;
        filterDropdown.appendChild(option);
    });

    const sortOrderDropdown = document.getElementById('sortOrderFilter');
    const dataDisplayDropdown = document.getElementById('dataDisplayFilter');

    // Siapkan data untuk grafik
    const prepareChartData = (selectedClass, sortOrder) => {
        let labels, totalSalesData, avgPriceData;

        if (selectedClass === 'all') {
            labels = Object.keys(salesByBuildingClass);
            totalSalesData = Object.values(salesByBuildingClass);
            avgPriceData = Object.values(avgPriceByBuildingClass);
        } else {
            labels = [selectedClass];
            totalSalesData = [salesByBuildingClass[selectedClass]];
            avgPriceData = [avgPriceByBuildingClass[selectedClass]];
        }

        // Urutkan data
        const sortedData = labels.map((label, index) => ({
            label,
            totalSales: totalSalesData[index],
            avgPrice: avgPriceData[index]
        }))
        .sort((a, b) => sortOrder === 'asc' ? a.avgPrice - b.avgPrice : b.avgPrice - a.avgPrice,
        (a, b) => sortOrder === 'asc' ? a.totalSales - b.totalSales : b.totalSales - a.totalSales);
        
        labels = sortedData.map(data => data.label);
        totalSalesData = sortedData.map(data => data.totalSales);
        avgPriceData = sortedData.map(data => data.avgPrice);

        return { labels, totalSalesData, avgPriceData };
    };

    const initialData = prepareChartData('all', 'desc');

    // Buat grafik menggunakan Chart.js
    const ctx = document.getElementById('salesVsAvgPriceChart').getContext('2d');

    const chartConfig = {
        type: 'line', // Ubah menjadi grafik garis
        data: {
            labels: initialData.labels,
            datasets: [{
                label: 'Total Penjualan',
                data: initialData.totalSalesData,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 1,
                hidden: false // Tampilkan secara default
            }, {
                label: 'Rata-rata Harga Penjualan',
                data: initialData.avgPriceData,
                borderColor: 'rgba(192, 75, 192, 1)',
                backgroundColor: 'rgba(192, 75, 192, 0.2)',
                borderWidth: 1,
                hidden: false // Tampilkan secara default
            }]
        },
        options: {
            responsive: false,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Dollar ($)'
                    }
                }
            }
        }
    };

    const salesVsAvgPriceChart = new Chart(ctx, chartConfig);

    // Perbarui grafik berdasarkan pilihan filter
    const updateChart = () => {
        const selectedClass = filterDropdown.value;
        const sortOrder = sortOrderDropdown.value;
        const dataDisplay = dataDisplayDropdown.value;
        const chartData = prepareChartData(selectedClass, sortOrder);

        chartConfig.data.labels = chartData.labels;
        chartConfig.data.datasets[0].data = chartData.totalSalesData;
        chartConfig.data.datasets[1].data = chartData.avgPriceData;

        // Tentukan dataset mana yang akan ditampilkan
        if (dataDisplay === 'both') {
            chartConfig.data.datasets[0].hidden = false;
            chartConfig.data.datasets[1].hidden = false;
        } else if (dataDisplay === 'total') {
            chartConfig.data.datasets[0].hidden = false;
            chartConfig.data.datasets[1].hidden = true;
        } else if (dataDisplay === 'average') {
            chartConfig.data.datasets[0].hidden = true;
            chartConfig.data.datasets[1].hidden = false;
        }

        salesVsAvgPriceChart.update();
    };

    filterDropdown.addEventListener('change', updateChart);
    sortOrderDropdown.addEventListener('change', updateChart);
    dataDisplayDropdown.addEventListener('change', updateChart);
})
.catch((error) => {
    console.error('Error fetching the property data:', error);
});
