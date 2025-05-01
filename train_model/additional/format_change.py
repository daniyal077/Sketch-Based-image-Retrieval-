import os
from PIL import Image

def convert_all_to_png(folder_path, delete_original=False):
    supported_formats = ['.jpg', '.jpeg', '.webp', '.avif', '.bmp', '.tiff', '.gif', '.png']

    for filename in os.listdir(folder_path):
        file_path = os.path.join(folder_path, filename)
        name, ext = os.path.splitext(filename)

        if ext.lower() not in supported_formats:
            continue  # Skip unsupported files

        try:
            with Image.open(file_path) as img:
                rgb_img = img.convert('RGBA') if img.mode != 'RGBA' else img
                new_filename = f"{name}.png"
                new_path = os.path.join(folder_path, new_filename)
                rgb_img.save(new_path, "PNG")
                print(f"Converted: {filename} → {new_filename}")

            if delete_original and ext.lower() != '.png':
                os.remove(file_path)
                print(f"Deleted original: {filename}")

        except Exception as e:
            print(f"Failed to convert {filename}: {e}")

    print("\nAll conversions complete.")

# Example usage
convert_all_to_png(r"Dataset\umbrella", delete_original=True)
