"use client";

import { useEffect } from "react";

interface AdUnitProps {
  slot: string;
  style?: React.CSSProperties;
  layout?: string;
  format?: string;
}

export default function AdUnit({ slot, style, layout, format }: AdUnitProps) {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error("AdSense error:", err);
    }
  }, []);

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-8 overflow-hidden flex justify-center">
      <ins
        className="adsbygoogle"
        style={style || { display: "block", textAlign: "center" }}
        data-ad-client="ca-pub-5144148071107084"
        data-ad-slot={slot}
        data-ad-layout={layout}
        data-ad-format={format || "auto"}
        data-full-width-responsive="true"
      />
    </div>
  );
}
