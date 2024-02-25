import tags from "./tags";
import paths from "./paths";

const apiDocumentation = {
  openapi: "3.0.1",
  info: {
    version: "1.0.0",
    title: "Voice Nest: Api Documentation",
    description:
      "NOTE: You can switch between local and production sever by left side Severs dropdowns options.",
    termsOfService: "https://github.com/ZUBERKHAN034/node-otp-authentication",
    contact: {
      name: "Aayush Rathore",
      email: "aayu.r.2003@gmail.com",
      url: "https://www.linkedin.com/in/aayush-rathore-1a2ab0253/",
    },
  },
  servers: [
    {
      url: "http://localhost:8000/",
      description: "Local Server",
    },
  ],
  tags: tags,
  paths: paths,

  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
};
export { apiDocumentation };
