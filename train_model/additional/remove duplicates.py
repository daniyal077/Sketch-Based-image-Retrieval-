import os
from PIL import Image
import imagehash

def remove_duplicate_images(folder_path):
    seen_hashes = {}
    deleted_count = 0

    for filename in os.listdir(folder_path):
        file_path = os.path.join(folder_path, filename)

        try:
            with Image.open(file_path) as img:
                img_hash = imagehash.phash(img)

            if img_hash in seen_hashes:
                print(f"Duplicate found: {filename} == {seen_hashes[img_hash]}")
                os.remove(file_path)
                deleted_count += 1
            else:
                seen_hashes[img_hash] = filename

        except Exception as e:
            print(f"Could not process {filename}: {e}")

    print(f"\nDone. {deleted_count} duplicate images removed.")

# Example usage
remove_duplicate_images(r"F:\3rd milestone\train_model\Dataset\umbrella")
