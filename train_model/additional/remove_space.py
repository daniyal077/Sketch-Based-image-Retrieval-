import pickle
import os

def replace_spaces_in_filenames(pkl_path):
    # Load the pickle file
    with open(pkl_path, 'rb') as f:
        image_paths = pickle.load(f)

    # Replace spaces with underscore before the file extension
    new_image_paths = []
    for path in image_paths:
        dirname, filename = os.path.split(path)
        new_filename = filename.replace(" ", "_")
        new_path = os.path.join(dirname, new_filename)
        new_image_paths.append(new_path)

    # Save updated paths back to pkl
    with open(pkl_path, 'wb') as f:
        pickle.dump(new_image_paths, f)

    print("All spaces replaced with underscores in file names.")

# Example usage
replace_spaces_in_filenames("image_paths.pkl")
