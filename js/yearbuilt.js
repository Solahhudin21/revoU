let sortedLabels = [];
let sortedData = [];

fetch('json/nycPropSales.json')
.then((response) => response.json())
.then((data) => {
    const salesByYearBuilt = {};

    data.forEach((property) => {
        const yearBuilt = property.YEAR_BUILT;
        const salePrice = parseFloat(property.SALE_PRICE || 0);

        if (!salesByYearBuilt[yearBuilt]) {
            salesByYearBuilt[yearBuilt] = salePrice;
        } else {
            salesByYearBuilt[yearBuilt] += salePrice;
        }
    });

    sortedLabels = Object.keys(salesByYearBuilt);
    sortedData = Object.values(salesByYearBuilt);

    createChart(sortedLabels, sortedData);
})
.catch((error) => {
    console.error('Error fetching the property data:', error);
});

function createChart(labels, data) {
    const ctx = document.getElementById('propertySalesByYearBuiltChart').getContext('2d');
    const propertySalesByYearBuiltChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Total Property Sales',
                data: data,
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y', // Mengatur orientasi sumbu x menjadi sumbu y
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Year Built'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Total Sales ($)'
                    }
                }
            }
        }
    });
}

function sortData(order) {
    if (order === 'asc') {
        sortedLabels.sort();
        sortedData.sort((a, b) => sortedLabels.indexOf(a) - sortedLabels.indexOf(b));
    } else if (order === 'desc') {
        sortedLabels.sort().reverse();
        sortedData.sort((a, b) => sortedLabels.indexOf(b) - sortedLabels.indexOf(a));
    }
    
    propertySalesByYearBuiltChart.destroy();
    createChart(sortedLabels, sortedData);
}
