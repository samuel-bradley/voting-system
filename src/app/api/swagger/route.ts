import { NextResponse } from "next/server";
import swaggerJsDoc from "swagger-jsdoc";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Voting System API",
      description: "API for managing polls, options, and votes",
      version: "1.0.0",
    },
    servers: [{ url: "http://localhost:3000/api" }],
  },
  apis: ["src/app/api/**/*.ts"], // Looks at all API files for docs
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);

export async function GET() {
  return NextResponse.json(swaggerSpec);
}
