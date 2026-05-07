import cv2
import numpy as np

def process_logo():
    # Load image
    img = cv2.imread(r"c:\Users\Spencer\Desktop\darcy\info-agência\Logo Laercom.png", cv2.IMREAD_UNCHANGED)
    
    # Check if it has alpha channel, if not, add it
    if img.shape[2] == 3:
        img = cv2.cvtColor(img, cv2.COLOR_BGR2BGRA)
        
    # Create a mask for the background. The background is mostly white/light gray.
    # Let's use a threshold on the grayscale image to find the background.
    gray = cv2.cvtColor(img, cv2.COLOR_BGRA2GRAY)
    _, mask = cv2.threshold(gray, 230, 255, cv2.THRESH_BINARY)
    
    # We want to keep everything that is NOT background
    # Let's do some morphological operations to clean the mask if needed, but simple threshold might work.
    
    # Create the light mode version (transparent background)
    light_logo = img.copy()
    light_logo[mask == 255, 3] = 0 # Set alpha to 0 for background pixels
    
    cv2.imwrite(r"c:\Users\Spencer\Desktop\darcy\assets\logo-light.png", light_logo)
    
    # Create the dark mode version
    # Dark blue is approx B: 80, G: 30, R: 10 (Wait, it's #081B3C approx, very dark blue)
    # We want to change the dark blue to white.
    # Let's find dark pixels
    dark_logo = light_logo.copy()
    
    # Find pixels where the value is dark (i.e. all B, G, R are less than some threshold)
    # The orange part is bright in Red and Green.
    b, g, r, a = cv2.split(dark_logo)
    
    # A pixel is dark blue if it's generally dark
    # Let's threshold based on brightness
    # Dark blue text has low R, G, and B. Orange has high R, G, low B.
    # So if R < 100, G < 100, B < 150, it's likely the dark blue part.
    dark_mask = (r < 100) & (g < 100) & (b < 150) & (a > 0)
    
    # Set those dark blue pixels to white
    dark_logo[dark_mask, 0] = 255 # B
    dark_logo[dark_mask, 1] = 255 # G
    dark_logo[dark_mask, 2] = 255 # R
    
    cv2.imwrite(r"c:\Users\Spencer\Desktop\darcy\assets\logo-dark.png", dark_logo)
    print("Logos saved.")

if __name__ == '__main__':
    process_logo()
