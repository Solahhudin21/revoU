fetch('json/nycPropSales.json')
    .then((response) => {
        // Konversi teks menjadi objek JSON
        return response.json();
    })
    .then((data) => {
        window.propertyData = data;
        
        // Hitung total harga jual
        const totalSalePrice = data.reduce((sum, property) => sum + parseFloat(property.SALE_PRICE || 0), 0);
        document.getElementById('total-sale-price').innerText = totalSalePrice.toLocaleString('en-US', {style: 'currency', currency: 'USD'});
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
  
}
