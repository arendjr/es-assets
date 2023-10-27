import React, { SVGAttributes, useEffect, useState } from "react";

type Asset = LinkAsset | InlineAsset;

type InlineAsset = { type: "inline"; data: string };

type LinkAsset = { type: "link"; url: string };

export function process(asset: Asset): React.FC<SVGAttributes<SVGElement>> {
  return function Svg(props: SVGAttributes<SVGElement>) {
    const [svgContent, setSvgContent] = useState<JSX.Element | null>(null);

    useEffect(() => {
      if (asset.type === "inline") {
        let { data } = asset;
        if (data.startsWith("base64,")) {
          data = data.slice(7);
        }
        setSvgContent(elementFromSvg(atob(data)));
      } else if (asset.type === "link") {
        const { abort, signal } = new AbortController();
        fetch(asset.url, { signal })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`Cannot load SVG: ${asset.url}`);
            }

            return response.blob();
          })
          .then((blob) => blob.text())
          .then((svg) => {
            setSvgContent(elementFromSvg(svg));
          });

        return () => abort("component unmounted or props changed");
      }
    }, [asset]);

    if (!svgContent) {
      return null;
    }

    return (
      <svg xmlns="http://www.w3.org/2000/svg" {...props}>
        {svgContent}
      </svg>
    );
  };
}

function elementFromSvg(svg: string): JSX.Element {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svg, "image/svg+xml");
  return mapElement(doc.firstElementChild);
}

function mapElement(el: Element): JSX.Element {
  const attrs: React.SVGAttributes<SVGElement> = {};
  for (const attr of el.attributes) {
    attrs[attr.name] = attr.value;
  }

  const children: Array<React.ReactNode> = [];
  for (const child of el.childNodes) {
    switch (child.nodeType) {
      case Node.ELEMENT_NODE:
        children.push(mapElement(child as Element));
        break;
      case Node.TEXT_NODE:
        children.push(child.nodeValue);
        break;
    }
  }

  return React.createElement(el.localName, attrs, children);
}
