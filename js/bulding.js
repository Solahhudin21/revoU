fetch('json/nycPropSales.json')
    .then((response) => {
        //Dari text file dikonversi menjadi JSON Object (Parsing) : response.json()
        //Bisa juga cara lainnya adalah JSON.parse(response)
        return response.json();
    })
    .then((data) => {
        window.propertyData = data;
        document.getElementById('total-property').innerText = data.length;
        
        })
        .catch((error) => {
            console.error('Error fetching the property data:', error);
        });
    
    // Handle borough selection
    document.querySelectorAll('.borough-dropdwn-content a').forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            var id = event.target.getAttribute('data-id'); // Assuming you have data-id attribute for borough ID
            var arrayFiltered = window.propertyData.filter((property) => property.BOROUGH == id);
            document.getElementById('total-property').innerText = arrayFiltered.length;
        });
    });
