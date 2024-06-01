fetch('json/nycPropSales.json')
.then((response) => response.json())
.then((data) => {
    window.propertyData = data;

    // Hitung total harga jual
    const totalSalePrice = data.reduce((sum, property) => sum + parseFloat(property.SALE_PRICE || 0), 0);
    document.getElementById('total-sale-price').innerText = totalSalePrice.toLocaleString('en-US', {style: 'currency', currency: 'USD'});

    // Inisialisasi penjualan per bulan untuk setiap borough
    const boroughs = ['Manhattan', 'Bronx', 'Brooklyn', 'Queens', 'Staten Island'];
    const salesPerMonth = boroughs.map(() => Array(12).fill(0));

    // Hitung total properti per bulan untuk setiap borough
    data.forEach((property) => {
        const saleDate = new Date(property.SALE_DATE);
        const month = saleDate.getMonth(); // Mendapatkan bulan (0 - 11)
        const boroughIndex = property.BOROUGH - 1; // Asumsikan BOROUGH adalah 1 untuk Manhattan, 2 untuk Bronx, dst.
        salesPerMonth[boroughIndex][month] += 1; // Increment total properti di bulan dan borough ini
    });

    // Buat grafik garis menggunakan Chart.js
    const ctx = document.getElementById('propertySalesChart').getContext('2d');
    const propertySalesChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: boroughs.map((borough, index) => ({
                label: `${borough}`,
                data: salesPerMonth[index],
                borderColor: `rgba(${75 + index * 40}, ${192 - index * 30}, ${192 - index * 30}, 1)`,
                backgroundColor: `rgba(${75 + index * 40}, ${192 - index * 30}, ${192 - index * 30}, 0.2)`,
                borderWidth: 1
            }))
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            },
        }
    });
})
.catch((error) => {
    console.error('Error fetching the property data:', error);
});

// Tangani seleksi borough
document.querySelectorAll('.borough-dropdwn-content a').forEach(button => {
    button.addEventListener('click', (event) => {
        event.preventDefault();
        var id = event.target.getAttribute('data-id'); // Mengambil atribut data-id untuk ID borough
        var arrayFiltered = window.propertyData.filter((property) => property.BOROUGH == id);
        
        // Hitung total harga jual untuk borough yang dipilih
        const totalBoroughSalePrice = arrayFiltered.reduce((sum, property) => sum + parseFloat(property.SALE_PRICE || 0), 0);
        document.getElementById('total-sale-price').innerText = totalBoroughSalePrice.toLocaleString('en-US', {style: 'currency', currency: 'USD'});
    });
});

// Tambahkan fungsi perbulan
function getTotalPropertyByMonth(id, monthName) {
    document.getElementById('dropbtn-month').innerText = monthName;
    var arrayFiltered = window.propertyData.filter((property) => {
        var saleDate = new Date(property.SALE_DATE);
        return saleDate.getMonth() + 1 === id;
    });

    document.getElementById('total-building').innerText = arrayFiltered.length;
}
