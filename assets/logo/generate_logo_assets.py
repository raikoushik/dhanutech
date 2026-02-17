"""Generate PNG + favicon assets from SVG logo files.
Requires: playwright with firefox available.
"""
from pathlib import Path
import struct
from playwright.sync_api import sync_playwright

root = Path(__file__).parent

with sync_playwright() as p:
    browser = p.firefox.launch()
    page = browser.new_page()

    for s in [1024, 512]:
        page.set_viewport_size({"width": s, "height": s})
        page.goto((root / "dhanutech-logo.svg").resolve().as_uri(), wait_until="load")
        page.screenshot(path=str(root / f"dhanutech-logo-{s}.png"))

    for s in [1024, 512, 180, 64, 48, 32, 16]:
        page.set_viewport_size({"width": s, "height": s})
        page.goto((root / "dhanutech-symbol.svg").resolve().as_uri(), wait_until="load")
        page.screenshot(path=str(root / f"dhanutech-symbol-{s}.png"))

    browser.close()

for s, name in [
    (16, "favicon-16x16.png"),
    (32, "favicon-32x32.png"),
    (48, "favicon-48x48.png"),
    (64, "favicon-64x64.png"),
    (180, "apple-touch-icon-180x180.png"),
]:
    (root / name).write_bytes((root / f"dhanutech-symbol-{s}.png").read_bytes())

imgs = [(s, (root / f"favicon-{s}x{s}.png").read_bytes()) for s in [16, 32, 48, 64]]
out = bytearray(struct.pack("<HHH", 0, 1, len(imgs)))
offset = 6 + 16 * len(imgs)
for s, data in imgs:
    out += struct.pack("<BBBBHHII", s, s, 0, 0, 1, 32, len(data), offset)
    offset += len(data)
for _, data in imgs:
    out += data
(root / "favicon.ico").write_bytes(out)
print("Generated logo PNGs and favicon files.")
