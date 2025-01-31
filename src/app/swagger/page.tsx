"use client";
import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";

const SwaggerUI = dynamic(() => import("swagger-ui-react"), { ssr: false });

export default function SwaggerPage() {
    return (
      <div style={{ height: "100vh", width: "100%", backgroundColor: "#fff", padding: "20px" }} className="swagger-ui">
        <SwaggerUI url="/api/swagger" />
      </div>
    );
  }
