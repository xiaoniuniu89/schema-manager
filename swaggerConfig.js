
        const swaggerSpec = {
            openapi: '3.0.0',
            info: {
                title: 'swr_post API',
                version: '1.0.0',
            },
            paths: {
  "/api/swr_post_swr_post": {
    "get": {
      "tags": [
        "swr_post_swr_post"
      ],
      "summary": "Get all swr_post_swr_post",
      "responses": {
        "200": {
          "description": "A list of swr_post_swr_post",
          "content": {
            "application/json": {
              "schema": {
                "type": "array",
                "items": {
                  "$ref": "#/components/schemas/swr_post_swr_post"
                }
              }
            }
          }
        }
      }
    },
    "post": {
      "tags": [
        "swr_post_swr_post"
      ],
      "summary": "Create a new swr_post_swr_post",
      "requestBody": {
        "required": true,
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/swr_post_swr_post"
            }
          }
        }
      },
      "responses": {
        "201": {
          "description": "swr_post_swr_post created"
        }
      }
    }
  },
  "/api/swr_post_swr_post/:id": {
    "get": {
      "tags": [
        "swr_post_swr_post"
      ],
      "summary": "Get a single swr_post_swr_post by ID",
      "parameters": [
        {
          "name": "id",
          "in": "path",
          "required": true,
          "schema": {
            "type": "integer"
          }
        }
      ],
      "responses": {
        "200": {
          "description": "A single swr_post_swr_post",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/swr_post_swr_post"
              }
            }
          }
        }
      }
    },
    "put": {
      "tags": [
        "swr_post_swr_post"
      ],
      "summary": "Update an existing swr_post_swr_post",
      "parameters": [
        {
          "name": "id",
          "in": "path",
          "required": true,
          "schema": {
            "type": "integer"
          }
        }
      ],
      "requestBody": {
        "required": true,
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/swr_post_swr_post"
            }
          }
        }
      },
      "responses": {
        "200": {
          "description": "swr_post_swr_post updated"
        }
      }
    },
    "delete": {
      "tags": [
        "swr_post_swr_post"
      ],
      "summary": "Delete an existing swr_post_swr_post",
      "parameters": [
        {
          "name": "id",
          "in": "path",
          "required": true,
          "schema": {
            "type": "integer"
          }
        }
      ],
      "responses": {
        "200": {
          "description": "swr_post_swr_post deleted"
        }
      }
    }
  }
},
            components: {
                schemas: {}
            }
        };

        module.exports = swaggerSpec;
        