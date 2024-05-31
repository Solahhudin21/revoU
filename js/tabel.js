fetch('json/forTable.json')
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        window.propertyData = data;
        // console.log(window.propertyData);
        let table = new DataTable('#data-tabel', {
            data : window.propertyData,
            columns : [
                { data: 'BOROUGH' },
                { data: 'NEIGHBORHOOD' },
                { data: 'YEAR_BUILT' },
                { data: 'BUILDING_CLASS_CATEGORY' },
                { data: 'SALE_PRICE' }
            ]
        });
    });

