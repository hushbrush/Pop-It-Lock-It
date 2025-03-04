function createForm() {
    // Create the container div for the form
    const formDiv = document.createElement('div');
    formDiv.id = "formDiv";
    
    // Create the first dropdown menu (Select for ARTIST)
    const dropdown1 = document.createElement('select');
    dropdown1.id = "dropdown1";
    
    // Create the default option (Choose ARTIST)
    const defaultOption1 = document.createElement('option');
    defaultOption1.value = "";
    defaultOption1.textContent = "Choose Artist";
    defaultOption1.disabled = true; // this will make the default option unselectable
    defaultOption1.selected = true; // this will make the default option selected by default
    
    // Append the default option to dropdown 1
    dropdown1.appendChild(defaultOption1);

    // Create the second dropdown menu (Select for SONG)
    const dropdown2 = document.createElement('select');
    dropdown2.id = "dropdown2";
    
    // Create the default option (Choose SONG)
    const defaultOption2 = document.createElement('option');
    defaultOption2.value = "";
    defaultOption2.textContent = "Choose Song";
    defaultOption2.disabled = true; // this will make the default option unselectable
    defaultOption2.selected = true; // this will make the default option selected by default
    
    // Append the default option to dropdown 2
    dropdown2.appendChild(defaultOption2);

    // Create the input field
   

// Function to add options to a dropdown dynamically
function addOptionsToDropdown(dropdown, options, placeholderText) {
    dropdown.innerHTML = ""; // Clear existing options

    // Create a dynamic default option
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = placeholderText; // Set dynamic placeholder text
    defaultOption.disabled = true;
    defaultOption.selected = true;
    dropdown.appendChild(defaultOption);

    // Add new options
    options.forEach(option => {
        const optionElement = document.createElement("option");
        optionElement.value = option;
        optionElement.textContent = option;
        dropdown.appendChild(optionElement);
    });
}

// Define artists and their specific songs
const artistSongs = {
    "Michael Jackson": ["I Am A Loser", "Lovin You"],
    "Ed Sheeran": ["Lego House", "Beautiful People"],
    "Taylor Swift": ["Cardigan", "Cruel Summer"]
};

// Create artist dropdown options
const artists = Object.keys(artistSongs);
addOptionsToDropdown(dropdown1, artists, "Choose Artist");

// Event listener to update songs based on selected artist
dropdown1.addEventListener("change", function () {
    const selectedArtist = dropdown1.value;
    if (selectedArtist in artistSongs) {
        addOptionsToDropdown(dropdown2, artistSongs[selectedArtist], `Choose Song by ${selectedArtist}`);
    }
});

function createStoryboard(artist, song) {
    const formattedArtist = artist.toLowerCase().replace(/\s+/g, '-');
    const formattedSong = song.toLowerCase().replace(/\s+/g, '-');

    const jsonFilePath = `./json/${formattedArtist}-${formattedSong}-images.json`;
    const imageFolder = `./make-storyboard/${formattedArtist}/${formattedSong}`;
    const lyricsFilePath = `./lyrics/${formattedArtist}-${formattedSong}-lyrics.csv`;

    console.log("Fetching JSON:", jsonFilePath);

    // First, fetch the JSON file to get the number of images
    fetch(jsonFilePath)
        .then(response => {
            if (!response.ok) throw new Error('Failed to load JSON file');
            return response.json();
        })
        .then(data => {
            const number_of_images = data.files.length;
            console.log("Number of images:", number_of_images);

            // Now create the storyboard using the number_of_images
            generateStoryboard(number_of_images, imageFolder, lyricsFilePath, data.files);
        })
        .catch(error => console.error('Error fetching JSON:', error));
}

function generateStoryboard(number_of_images, imageFolder, lyricsFilePath, files) {
    const storyboardDiv = document.getElementById("storyboard");
    storyboardDiv.innerHTML = "";
    storyboardDiv.style.position = "relative";
    storyboardDiv.style.width = "1000px";
    storyboardDiv.style.height = "auto";
    storyboardDiv.style.display = "inline-block";

    const storyboardImages = document.createElement("div");
    storyboardImages.id = "storyboardImages";
    storyboardImages.style.position = "absolute";
    storyboardImages.style.top = "0";
    storyboardImages.style.left = "0";
    storyboardImages.style.width = "100%";
    storyboardImages.style.height = "auto";

    const columns = 4;
    const rows = Math.ceil(number_of_images / columns);
    const imageSize = 250;

    // Create image elements
    files.forEach((imageFile, index) => {
        const imgElement = document.createElement("img");
        imgElement.src = `${imageFolder}/${imageFile}`;
        imgElement.alt = `Image: ${imageFile}`;
        imgElement.style.width = `${imageSize}px`;
        imgElement.style.height = `${imageSize}px`;
        imgElement.style.position = "absolute";
        imgElement.style.top = `${Math.floor(index / columns) * imageSize}px`;
        imgElement.style.left = `${(index % columns) * imageSize}px`;

        storyboardImages.appendChild(imgElement);
    });

    // Fetch and display lyrics
    fetch(lyricsFilePath)
        .then(response => response.text())
        .then(data => {
            const lines = data.split("\n").map(line => line.replace(/"/g, '').trim());
            const totalRectangles = columns * rows;
            const lyrics = lines.slice(0, totalRectangles);

            lyrics.forEach((text, index) => {
                const rect = document.createElement("div");

                rect.style.width = `${imageSize}px`;
                rect.style.height = `${imageSize}px`;
                rect.style.backgroundColor = "rgba(255, 255, 255, 0)";
                rect.style.position = "absolute";
                rect.style.top = `${Math.floor(index / columns) * imageSize}px`;
                rect.style.left = `${(index % columns) * imageSize}px`;
                rect.style.display = "flex";
                rect.style.alignItems = "center";
                rect.style.justifyContent = "center";
                rect.style.textAlign = "center";
                rect.style.fontSize = "16px";
                rect.style.color = "black";
                rect.style.cursor = "pointer";
                rect.style.opacity = "0";
                rect.style.transition = "opacity 0.3s ease";

                rect.addEventListener("mouseover", () => {
                    rect.style.backgroundColor = "rgba(255, 255, 255, 1)";
                    rect.style.opacity = "1";
                });

                rect.addEventListener("mouseout", () => {
                    rect.style.backgroundColor = "rgba(0, 0, 0, 0)";
                    rect.style.opacity = "0";
                });

                rect.innerText = text;
                storyboardDiv.appendChild(rect);
            });
        })
        .catch(error => console.error("Error fetching lyrics:", error));

    storyboardDiv.appendChild(storyboardImages);
}
    
// Function to check dropdown selections and call createStoryboard
function checkSelections() {
    const selectedArtist = dropdown1.value;
    const selectedSong = dropdown2.value;

    if (selectedArtist && selectedSong) {
        // Get or create the container for the titles
        let titleContainer = document.getElementById("headerContainer");
        
        // Clear previous content
        titleContainer.innerHTML = "";

        // Create and append h1 for the artist
        const artistHeading = document.createElement("h1");
        artistHeading.textContent = selectedArtist;
        titleContainer.appendChild(artistHeading);

        // Create and append h2 for the song
        const songHeading = document.createElement("h2");
        songHeading.textContent = selectedSong;
        titleContainer.appendChild(songHeading);

        // Call createStoryboard after setting the titles
        createStoryboard(selectedArtist, selectedSong);

        // Hide the form once selections are made
        document.getElementById("formDiv").style.display = "none";
    }
}


    
    
    // Add event listeners to both dropdowns to check the selection
    dropdown1.addEventListener('change', checkSelections);
    dropdown2.addEventListener('change', checkSelections);

    // Append the dropdowns and input field to the form container
    formDiv.appendChild(dropdown1);
    formDiv.appendChild(dropdown2);


    // Optionally, append the form to the body or any specific element
    document.body.appendChild(formDiv);
}

// Call the function to create the form
createForm();
