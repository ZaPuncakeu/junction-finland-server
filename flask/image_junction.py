from PIL import Image
import urllib.request
from PIL import Image
  
def changeImageSize(maxWidth, 
                    maxHeight, 
                    image):
    
    widthRatio  = maxWidth/image.size[0]
    heightRatio = maxHeight/image.size[1]

    newWidth    = int(widthRatio*image.size[0])
    newHeight   = int(heightRatio*image.size[1])

    newImage    = image.resize((newWidth, newHeight))
    return newImage

def generate_image(path, context, samples=1):
    print(path, context)
    urllib.request.urlretrieve(
        f'https://source.unsplash.com/random/?{context.replace(" ", ",")}',
        "temp.png"
    )

    while samples > 0:
        samples -= 1

        background = Image.open("temp.png")
        background = background.convert('RGBA')
        size = (1280, 720)
        background = background.resize(size, Image.ANTIALIAS)

        foreground = Image.open(path)
        background.paste(foreground, (640, 360), foreground)
        path.replace('.png', f'-sample-{samples}.png')
        background.save(path.replace('.png', f'-sample-{samples}.png'))
    
    return "success"
