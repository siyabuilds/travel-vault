// Global variables
let travelData = {};

// Initialize application when page loads
document.addEventListener("DOMContentLoaded", function () {
  loadTravelData();
  initializeNavigation();

  if (document.getElementById("featuredGrid")) {
    showCategory("beaches");
  }

  if (document.getElementById("contactForm")) {
    initializeContactForm();
  }
});

// Load travel data from JSON file
async function loadTravelData() {
  try {
    const response = await fetch("data.json");
    travelData = await response.json();
    console.log("Travel data loaded successfully");
  } catch (error) {
    console.error("Error loading travel data:", error);
    // Fallback data structure
    travelData = {
      countries: [
        {
          id: 1,
          name: "Australia",
          cities: [
            {
              name: "Sydney, Australia",
              imageUrl: "images/sydney.jpg",
              description:
                "A vibrant city known for its iconic landmarks like the Sydney Opera House and Sydney Harbour Bridge.",
            },
            {
              name: "Melbourne, Australia",
              imageUrl: "images/melbourne.jpg",
              description:
                "A cultural hub famous for its art, food, and diverse neighborhoods.",
            },
          ],
        },
        {
          id: 2,
          name: "Japan",
          cities: [
            {
              name: "Tokyo, Japan",
              imageUrl: "images/tokyo.jpg",
              description:
                "A bustling metropolis blending tradition and modernity, famous for its cherry blossoms and rich culture.",
            },
            {
              name: "Kyoto, Japan",
              imageUrl: "images/kyoto.jpg",
              description:
                "Known for its historic temples, gardens, and traditional tea houses.",
            },
          ],
        },
        {
          id: 3,
          name: "Brazil",
          cities: [
            {
              name: "Rio de Janeiro, Brazil",
              imageUrl: "images/rio.jpg",
              description:
                "A lively city known for its stunning beaches, vibrant carnival celebrations, and iconic landmarks.",
            },
            {
              name: "São Paulo, Brazil",
              imageUrl: "images/sao-paulo.jpg",
              description:
                "The financial hub with diverse culture, arts, and a vibrant nightlife.",
            },
          ],
        },
      ],
      temples: [
        {
          id: 1,
          name: "Angkor Wat, Cambodia",
          imageUrl: "images/angkor-wat.jpg",
          description:
            "A UNESCO World Heritage site and the largest religious monument in the world.",
        },
        {
          id: 2,
          name: "Taj Mahal, India",
          imageUrl: "images/taj-mahal.jpg",
          description:
            "An iconic symbol of love and a masterpiece of Mughal architecture.",
        },
      ],
      beaches: [
        {
          id: 1,
          name: "Bora Bora, French Polynesia",
          imageUrl: "images/bora-bora.jpg",
          description:
            "An island known for its stunning turquoise waters and luxurious overwater bungalows.",
        },
        {
          id: 2,
          name: "Copacabana Beach, Brazil",
          imageUrl: "images/copacabana.jpg",
          description:
            "A famous beach in Rio de Janeiro, Brazil, with a vibrant atmosphere and scenic views.",
        },
      ],
    };
  }
}

// Navigation functionality
function initializeNavigation() {
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", function () {
      hamburger.classList.toggle("active");
      navMenu.classList.toggle("active");
    });

    document.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
      });
    });
  }
}

// Search functionality
function searchDestinations() {
  const searchInput = document.getElementById("searchInput");
  const query = searchInput.value.toLowerCase().trim();

  if (!query) {
    alert("Please enter a search term");
    return;
  }

  const results = findDestinations(query);
  displayResults(results, query);
}

function searchFor(category) {
  const results = getDestinationsByCategory(category);
  displayResults(results, category);

  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.value = category;
  }
}

function findDestinations(query) {
  let results = [];

  // Search by category keywords
  if (query.includes("beach") || query.includes("beaches")) {
    results = results.concat(travelData.beaches || []);
  }

  if (query.includes("temple") || query.includes("temples")) {
    results = results.concat(travelData.temples || []);
  }

  if (query.includes("city") || query.includes("cities")) {
    const allCities = [];
    (travelData.countries || []).forEach((country) => {
      allCities.push(...(country.cities || []));
    });
    results = results.concat(allCities);
  }

  // Search for specific city names
  const allCities = [];
  (travelData.countries || []).forEach((country) => {
    (country.cities || []).forEach((city) => {
      if (city.name.toLowerCase().includes(query)) {
        allCities.push(city);
      }
    });
  });
  results = results.concat(allCities);

  // Search in all destinations by name
  const allDestinations = [
    ...(travelData.beaches || []),
    ...(travelData.temples || []),
  ];

  const matchingDestinations = allDestinations.filter((dest) =>
    dest.name.toLowerCase().includes(query)
  );
  results = results.concat(matchingDestinations);

  const uniqueResults = results.filter(
    (item, index, self) => index === self.findIndex((t) => t.name === item.name)
  );

  return uniqueResults;
}

function getDestinationsByCategory(category) {
  switch (category.toLowerCase()) {
    case "beaches":
      return travelData.beaches || [];
    case "temples":
      return travelData.temples || [];
    case "cities":
      const allCities = [];
      (travelData.countries || []).forEach((country) => {
        allCities.push(...(country.cities || []));
      });
      return allCities;
    default:
      return [];
  }
}

function displayResults(results, query) {
  const resultsSection = document.getElementById("resultsSection");
  const resultsTitle = document.getElementById("resultsTitle");
  const resultsGrid = document.getElementById("resultsGrid");
  const currentTimeDiv = document.getElementById("currentTime");

  if (!resultsSection || !resultsGrid) return;

  resultsSection.style.display = "block";

  if (resultsTitle) {
    resultsTitle.textContent = `Search Results for "${query}"`;
  }

  // Display current time for city searches
  if (
    currentTimeDiv &&
    (query.includes(",") || query.toLowerCase().includes("city"))
  ) {
    displayCurrentTime(query, currentTimeDiv);
  } else if (currentTimeDiv) {
    currentTimeDiv.style.display = "none";
  }

  resultsGrid.innerHTML = "";

  if (results.length === 0) {
    resultsGrid.innerHTML =
      '<p class="no-results">No destinations found. Try searching for "beaches", "temples", or specific cities like "Tokyo, Japan".</p>';
    return;
  }

  // Display results and scroll to section
  results.forEach((destination) => {
    const card = createDestinationCard(destination);
    resultsGrid.appendChild(card);
  });

  resultsSection.scrollIntoView({ behavior: "smooth" });
}

function displayCurrentTime(query, container) {
  // Time zone mapping for major cities
  const cityTimeZones = {
    tokyo: "Asia/Tokyo",
    sydney: "Australia/Sydney",
    melbourne: "Australia/Melbourne",
    rio: "America/Sao_Paulo",
    "são paulo": "America/Sao_Paulo",
    "sao paulo": "America/Sao_Paulo",
    kyoto: "Asia/Tokyo",
  };

  let timeZone = "UTC";
  let cityName = "UTC";

  for (const [city, tz] of Object.entries(cityTimeZones)) {
    if (query.toLowerCase().includes(city)) {
      timeZone = tz;
      cityName = city.charAt(0).toUpperCase() + city.slice(1);
      break;
    }
  }

  try {
    const now = new Date();
    const localTime = now.toLocaleString("en-US", {
      timeZone: timeZone,
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    });

    container.innerHTML = `
            <div class="time-display">
                <i class="fas fa-clock"></i>
                <span>Local time in ${cityName}: ${localTime}</span>
            </div>
        `;
    container.style.display = "block";
  } catch (error) {
    container.style.display = "none";
  }
}

function createDestinationCard(destination) {
  const card = document.createElement("div");
  card.className = "destination-card";

  card.innerHTML = `
        <div class="card-image">
            <img src="${destination.imageUrl}" alt="${destination.name}">
        </div>
        <div class="card-content">
            <h3>${destination.name}</h3>
            <p>${destination.description}</p>
            <button class="learn-more-btn" onclick="showDestinationDetails('${destination.name}')">
                Learn More
            </button>
        </div>
    `;

  return card;
}

function showDestinationDetails(destinationName) {
  alert(
    `More details about ${destinationName} would be displayed here. This could open a modal or navigate to a detailed page.`
  );
}

// Featured destinations functionality
function showCategory(category) {
  const featuredGrid = document.getElementById("featuredGrid");
  if (!featuredGrid) return;

  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.classList.remove("active");
  });
  event?.target?.classList.add("active") ||
    document
      .querySelector(`[onclick="showCategory('${category}')"]`)
      ?.classList.add("active");

  const destinations = getDestinationsByCategory(category);

  featuredGrid.innerHTML = "";
  destinations.forEach((destination) => {
    const card = createDestinationCard(destination);
    featuredGrid.appendChild(card);
  });
}

// Contact form functionality
function initializeContactForm() {
  const contactForm = document.getElementById("contactForm");
  if (!contactForm) return;

  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);

    // Form validation
    if (!data.name || !data.email || !data.subject || !data.message) {
      alert("Please fill in all required fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      alert("Please enter a valid email address.");
      return;
    }

    // Form submission simulation
    const submitBtn = contactForm.querySelector(".submit-btn");
    const originalText = submitBtn.innerHTML;

    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    setTimeout(() => {
      alert(
        "Thank you for your message! We'll get back to you within 24 hours."
      );
      contactForm.reset();
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }, 2000);
  });
}

// FAQ functionality
function toggleFAQ(element) {
  const faqItem = element.parentElement;
  const answer = faqItem.querySelector(".faq-answer");
  const icon = element.querySelector("i");

  faqItem.classList.toggle("active");

  // Toggle icon and answer visibility
  if (faqItem.classList.contains("active")) {
    icon.classList.remove("fa-chevron-down");
    icon.classList.add("fa-chevron-up");
    answer.style.maxHeight = answer.scrollHeight + "px";
  } else {
    icon.classList.remove("fa-chevron-up");
    icon.classList.add("fa-chevron-down");
    answer.style.maxHeight = "0";
  }
}

// Additional event listeners
document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        searchDestinations();
      }
    });
  }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
      });
    }
  });
});
