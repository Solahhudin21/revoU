fetch('json/nycPropSales.json')
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        window.propertyData = data;
        document.getElementById('total-building').innerText = data.length;
    });

function getTotalPropertyByMonth(id, monthName) {
    document.getElementById('dropbtn-month').innerText = monthName;
    var arrayFiltered = window.propertyData.filter((property) => {
        var saleDate = new Date(property.SALE_DATE);
        return saleDate.getMonth() + 1 === id;
    });
  
    document.getElementById('total-building').innerText = arrayFiltered.length;
  }