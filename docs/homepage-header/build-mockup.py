#!/usr/bin/env python3
"""Build a viewable copy of the homepage header mockup.

The source (mockup.html) has placeholders for the Graphik font and five cover images so the
repo doesn't carry large embedded files. This script fills them in and writes one standalone
HTML file you can open in a browser.

Usage:
    python3 docs/homepage-header/build-mockup.py                 # placeholder covers
    python3 docs/homepage-header/build-mockup.py path/to/covers  # real covers: 1.jpg … 5.jpg
    python3 docs/homepage-header/build-mockup.py --out /tmp/header.html

Open the output in a browser. Add #tune to the URL to show the design tuning panel.
"""
import argparse
import base64
import pathlib
import urllib.parse

HERE = pathlib.Path(__file__).resolve().parent
REPO = HERE.parent.parent
FONTS = REPO / 'src' / 'assets' / 'fonts'

# Cover ratios and board colours used by the mockup (must match the data in mockup.html)
PLACEHOLDER_COVERS = [
    (800, 1178, '#7b1650'),
    (800, 1127, '#1f74c4'),
    (800, 1047, '#d7231f'),
    (800, 1048, '#0f5a4f'),
    (800, 1026, '#cfc7bb'),
]


def b64(path: pathlib.Path) -> str:
    return base64.b64encode(path.read_bytes()).decode()


def placeholder_cover(width: int, height: int, colour: str) -> str:
    svg = (
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" '
        f'viewBox="0 0 {width} {height}"><rect width="100%" height="100%" fill="{colour}"/></svg>'
    )
    return 'data:image/svg+xml,' + urllib.parse.quote(svg)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('covers', nargs='?', help='folder containing 1.jpg … 5.jpg')
    parser.add_argument('--out', default=str(HERE / 'mockup.built.html'))
    args = parser.parse_args()

    html = (HERE / 'mockup.html').read_text()
    html = html.replace('__GRAPHIK_REGULAR__', b64(FONTS / 'Graphik-Regular-Trial.otf'))
    html = html.replace('__GRAPHIK_MEDIUM__', b64(FONTS / 'Graphik-Medium-Trial.otf'))

    covers = pathlib.Path(args.covers) if args.covers else None
    for i, (width, height, colour) in enumerate(PLACEHOLDER_COVERS, start=1):
        token = f'data:image/jpeg;base64,__COVER_{i}__'
        image = covers / f'{i}.jpg' if covers else None
        if image and image.exists():
            html = html.replace(token, 'data:image/jpeg;base64,' + b64(image))
        else:
            html = html.replace(token, placeholder_cover(width, height, colour))

    pathlib.Path(args.out).write_text(html)
    print(f'Wrote {args.out}')


if __name__ == '__main__':
    main()
