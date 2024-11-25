// Resources Data
const resources = [
    { title: "Soil Health and Preparation Guide", link: "https://www.fao.org/soils-portal/en/" },
    { title: "Pest Control Strategies", link: "https://www.epa.gov/safepestcontrol" },
    { title: "Seasonal Crop Planning", link: "https://www.nifa.usda.gov/seasonal-crop-planning" },
    { title: "Organic Farming Methods", link: "https://www.organic-center.org/resources" },
    { title: "Water Management for Smallholder Farmers", link: "https://www.icrisat.org/water-management/" },
];

// Videos Data (YouTube URLs)
const videos = [
    { title: "5 Tips for Growing Healthy Maize", url: "https://www.youtube.com/embed/dtjnVRONL0k" },
    { title: "How to Manage Water for Crops", url: "https://www.youtube.com/embed/ba0In5ezHXc" },
    { title: "Maximizing Crop Yield with Minimal Resources", url: "https://www.youtube.com/embed/23iNxOP2eT4" },
    { title: "Sustainable Farming Techniques for Beginners", url: "https://www.youtube.com/embed/heTxEsrPVdQ" },
    { title: "How to Start Organic Farming", url: "https://www.youtube.com/embed/1RfWgWZg7w4" },
];
// Populate Resources
const resourceList = document.getElementById("resource-list");
resources.forEach((resource) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `<a href="${resource.link}" target="_blank">${resource.title}</a>`;
    resourceList.appendChild(listItem);
});

// Populate Videos
const videoContainer = document.getElementById("video-container");
videos.forEach((video) => {
    const iframe = document.createElement("iframe");
    iframe.src = video.url;
    iframe.width = "360";
    iframe.height = "215";
    iframe.title = video.title;
    iframe.frameBorder = "0";
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    iframe.allowFullscreen = true;

    // Adding title below iframe
    const videoTitle = document.createElement("p");
    videoTitle.innerText = video.title;

    // Create video wrapper for styling
    const videoWrapper = document.createElement("div");
    videoWrapper.className = "video";
    videoWrapper.appendChild(iframe);
    videoWrapper.appendChild(videoTitle);

    videoContainer.appendChild(videoWrapper);
});
