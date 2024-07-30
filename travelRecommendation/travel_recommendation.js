document.addEventListener("DOMContentLoaded", () => {
    const searchButton = document.getElementById("searchButton");
    const clearButton = document.getElementById("clearButton");
    const searchInput = document.getElementById("searchInput");
    const tilesContainer = document.getElementById("tiles");

    // Fetch data from JSON
    const fetchRecommendations = async () => {
        try {
            const response = await fetch('travel_recommendation_api.json');
            const data = await response.json();
            console.log("Fetched data:", data); // Log fetched data
            return data;
        } catch (error) {
            console.error("Error fetching recommendations:", error);
        }
    };

    // Handle search functionality
    searchButton.addEventListener("click", async () => {
        const query = searchInput.value.toLowerCase();
        const data = await fetchRecommendations();
        const results = searchItems(data, query);
        displayResults(results);
    });

    // Clear results
    clearButton.addEventListener("click", () => {
        searchInput.value = "";
        fetchRecommendations().then(data => {
            displayResults(data.attractions.slice(0, 6)); // Display default destinations when cleared
        });
    });

    // Search items in the JSON data
    const searchItems = (data, query) => {
        let results = [];
        for (const category in data) {
            data[category].forEach(item => {
                if ((item.name.toLowerCase().includes(query) || item.description.toLowerCase().includes(query)) && query !== "china") {
                    results.push(item);
                }
            });
        }
        console.log("Search results:", results); // Log search results
        return results;
    };

    // Display results function
    const displayResults = (results) => {
        tilesContainer.innerHTML = '';
        results.forEach(result => {
            const resultDiv = document.createElement("div");
            resultDiv.className = 'col-md-4 tile';
            resultDiv.innerHTML = `
                <img src="${result.imageUrl}" alt="${result.name}" class="img-fluid">
                <h3>${result.name}</h3>
                <p>${result.description}</p>
                <button class="btn btn-red">Learn More</button>
            `;
            tilesContainer.appendChild(resultDiv);
        });
    };

    // Initialize tiles with default destinations
    fetchRecommendations().then(data => {
        console.log("Default data:", data); // Log default data
        const defaultDestinations = data.attractions.slice(0, 6);
        displayResults(defaultDestinations);
    });
});
