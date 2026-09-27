import json
import os
import sys

from PIL import Image, ImageDraw

HERE = os.path.dirname(os.path.abspath(__file__))
SIZE = 520


def tile(path, label):
    canvas = Image.new('RGB', (SIZE, SIZE + 28), (32, 32, 32))
    if path and os.path.exists(path):
        image = Image.open(path).convert('RGB')
        image.thumbnail((SIZE, SIZE))
        canvas.paste(image, ((SIZE - image.width) // 2, 28 + (SIZE - image.height) // 2))
    ImageDraw.Draw(canvas).text((8, 8), label, fill=(240, 240, 240))
    return canvas


def compose(item_id, photos):
    tiles = [tile(os.path.join(HERE, 'panels', f'{item_id}.png'), f'{item_id}  spec panel')]
    photo = photos.get(item_id)
    if photo:
        tiles.append(tile(os.path.join(HERE, 'photos', f'{item_id}.jpg'), f'photo {photo["file"]}'))
    current = os.path.join(HERE, 'current', f'{item_id}.jpg')
    if not os.path.exists(current):
        current = os.path.join(HERE, 'current', f'{item_id}.png')
    tiles.append(tile(current, 'current Blender render'))
    sheet = Image.new('RGB', (SIZE * len(tiles), SIZE + 28))
    for index, image in enumerate(tiles):
        sheet.paste(image, (index * SIZE, 0))
    os.makedirs(os.path.join(HERE, 'sheets'), exist_ok=True)
    sheet.save(os.path.join(HERE, 'sheets', f'{item_id}.jpg'), quality=85)


if __name__ == '__main__':
    photos_path = os.path.join(HERE, 'photos.json')
    photos = json.load(open(photos_path)) if os.path.exists(photos_path) else {}
    for item in sys.argv[1:]:
        compose(item, photos)
