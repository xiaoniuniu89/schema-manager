
        const swaggerSpec = {
            openapi: '3.0.0',
            info: {
                title: 'basic_vet API',
                version: '1.0.0',
            },
            paths: {
  "/api/basic_vet_owner": {
    "get": {
      "tags": [
        "basic_vet_owner"
      ],
      "summary": "Get all basic_vet_owner",
      "responses": {
        "200": {
          "description": "A list of basic_vet_owner",
          "content": {
            "application/json": {
              "schema": {
                "type": "array",
                "items": {
                  "$ref": "#/components/schemas/basic_vet_owner"
                }
              }
            }
          }
        }
      }
    },
    "post": {
      "tags": [
        "basic_vet_owner"
      ],
      "summary": "Create a new basic_vet_owner",
      "requestBody": {
        "required": true,
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/basic_vet_owner"
            }
          }
        }
      },
      "responses": {
        "201": {
          "description": "basic_vet_owner created"
        }
      }
    }
  },
  "/api/basic_vet_owner/:id": {
    "get": {
      "tags": [
        "basic_vet_owner"
      ],
      "summary": "Get a single basic_vet_owner by ID",
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
          "description": "A single basic_vet_owner",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/basic_vet_owner"
              }
            }
          }
        }
      }
    },
    "put": {
      "tags": [
        "basic_vet_owner"
      ],
      "summary": "Update an existing basic_vet_owner",
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
              "$ref": "#/components/schemas/basic_vet_owner"
            }
          }
        }
      },
      "responses": {
        "200": {
          "description": "basic_vet_owner updated"
        }
      }
    },
    "delete": {
      "tags": [
        "basic_vet_owner"
      ],
      "summary": "Delete an existing basic_vet_owner",
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
          "description": "basic_vet_owner deleted"
        }
      }
    }
  },
  "/api/basic_vet_cat": {
    "get": {
      "tags": [
        "basic_vet_cat"
      ],
      "summary": "Get all basic_vet_cat",
      "responses": {
        "200": {
          "description": "A list of basic_vet_cat",
          "content": {
            "application/json": {
              "schema": {
                "type": "array",
                "items": {
                  "$ref": "#/components/schemas/basic_vet_cat"
                }
              }
            }
          }
        }
      }
    },
    "post": {
      "tags": [
        "basic_vet_cat"
      ],
      "summary": "Create a new basic_vet_cat",
      "requestBody": {
        "required": true,
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/basic_vet_cat"
            }
          }
        }
      },
      "responses": {
        "201": {
          "description": "basic_vet_cat created"
        }
      }
    }
  },
  "/api/basic_vet_cat/:id": {
    "get": {
      "tags": [
        "basic_vet_cat"
      ],
      "summary": "Get a single basic_vet_cat by ID",
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
          "description": "A single basic_vet_cat",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/basic_vet_cat"
              }
            }
          }
        }
      }
    },
    "put": {
      "tags": [
        "basic_vet_cat"
      ],
      "summary": "Update an existing basic_vet_cat",
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
              "$ref": "#/components/schemas/basic_vet_cat"
            }
          }
        }
      },
      "responses": {
        "200": {
          "description": "basic_vet_cat updated"
        }
      }
    },
    "delete": {
      "tags": [
        "basic_vet_cat"
      ],
      "summary": "Delete an existing basic_vet_cat",
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
          "description": "basic_vet_cat deleted"
        }
      }
    }
  }
},
            components: {
                schemas: {
  "basic_vet_owner": {
    "type": "object",
    "properties": {
      "name": {
        "type": "string"
      },
      "email": {
        "type": "string"
      },
      "id": {
        "type": "integer",
        "exclusiveMinimum": 0
      }
    },
    "required": [
      "name",
      "email"
    ]
  },
  "basic_vet_cat": {
    "type": "object",
    "properties": {
      "name": {
        "type": "string"
      },
      "id": {
        "type": "integer",
        "exclusiveMinimum": 0
      },
      "owner_id": {
        "type": "integer",
        "description": "Reference to the owner"
      }
    },
    "required": [
      "name",
      "owner_id"
    ]
  }
}
            }
        };

        module.exports = swaggerSpec;
        