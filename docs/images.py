import os
import json
import re

# Define the folder path
image_folder = '/Users/lisaquinley/Dropbox/Parsons_MS_Data-Visualization/Spring-2025/DV-Workshop_Transformers/ChibaUniversity-Parsons_Collab/make-storyboard/ed-sheeran/beautiful-people/'

# Function to get all image files in the folder
def get_image_files(folder_path):
    # List to store image filenames
    image_files = []
    
    if not os.path.exists(folder_path):
        print(f"Error: The folder {folder_path} does not exist.")
        return image_files

    # Loop through the files in the directory
    for file_name in os.listdir(folder_path):
        # Check if the file is an image by looking at the file extension
        if file_name.lower().endswith(('.jpg', '.jpeg', '.png', '.gif', '.bmp')):
            image_files.append(file_name)

    # Sort files in natural order using a key that handles numbers in filenames
    image_files.sort(key=lambda f: [int(text) if text.isdigit() else text.lower() for text in re.split('([0-9]+)', f)])

    return image_files

# Create the JSON data
image_files = get_image_files(image_folder)
if image_files:
    data = {"files": image_files}
    
    # Specify the correct path for saving the JSON file
    json_file_path = '/Users/lisaquinley/Dropbox/Parsons_MS_Data-Visualization/Spring-2025/DV-Workshop_Transformers/ChibaUniversity-Parsons_Collab/ed-sheeran-beautiful-people-images.json'  # Update with a valid path

    try:
        with open(json_file_path, 'w') as json_file:
            json.dump(data, json_file, indent=4)
        print(f"JSON file created: {json_file_path}")
    except Exception as e:
        print(f"Error writing JSON file: {e}")
else:
    print("No image files found.")
