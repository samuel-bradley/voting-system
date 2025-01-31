"use client";
import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";

const SwaggerUI = dynamic(() => import("swagger-ui-react"), { ssr: false });

export default function SwaggerPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#fff", paddingBottom: "50px" }}>
      <style>{`
        :root {
          --background: #ffffff !important;
          --foreground: #171717 !important;
        }
        body {
          background: #fff !important;
          color: #171717 !important;
        }
      `}</style>
      <SwaggerUI url="/api/swagger" />
    </div>
  );
}
