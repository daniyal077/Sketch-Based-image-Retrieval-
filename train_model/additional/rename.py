import os

# Path to the folder containing images
folder_path = r'F:\3rd milestone\train_model\Dataset\umbrella'

# Get a list of all files in the folder
files = os.listdir(folder_path)

# Initialize a counter for naming
counter = 1

# Loop through each file in the folder
for file in files:
    # Get the full file path
    old_file_path = os.path.join(folder_path, file)
    
    # Skip if it's not a file
    if not os.path.isfile(old_file_path):
        continue
    
    # Get the file extension
    file_extension = os.path.splitext(file)[1]
    
    # Define the new file name
    new_file_name = f"umbrella_{counter}{file_extension}"
    new_file_path = os.path.join(folder_path, new_file_name)
    
    # Rename the file
    os.rename(old_file_path, new_file_path)
    
    # Increment the counter
    counter += 1

print("Renaming completed!")
