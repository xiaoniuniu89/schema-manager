
    const swaggerSpec = {
  "openapi": "3.0.0",
  "info": {
    "title": "classRoom API",
    "version": "1.0.0",
    "description": "Documentation includes: family and other schemas"
  },
  "paths": {
    "/api/classRoom_teacher": {
      "get": {
        "tags": [
          "classRoom_teacher"
        ],
        "summary": "Get all classRoom_teacher",
        "responses": {
          "200": {
            "description": "A list of classRoom_teacher",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/classRoom_teacher"
                  }
                }
              }
            }
          }
        }
      },
      "post": {
        "tags": [
          "classRoom_teacher"
        ],
        "summary": "Create a new classRoom_teacher",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/classRoom_teacher"
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "classRoom_teacher created"
          }
        }
      }
    },
    "/api/classRoom_teacher/:id": {
      "get": {
        "tags": [
          "classRoom_teacher"
        ],
        "summary": "Get a single classRoom_teacher by ID",
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
            "description": "A single classRoom_teacher",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/classRoom_teacher"
                }
              }
            }
          }
        }
      },
      "put": {
        "tags": [
          "classRoom_teacher"
        ],
        "summary": "Update an existing classRoom_teacher",
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
                "$ref": "#/components/schemas/classRoom_teacher"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "classRoom_teacher updated"
          }
        }
      },
      "delete": {
        "tags": [
          "classRoom_teacher"
        ],
        "summary": "Delete an existing classRoom_teacher",
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
            "description": "classRoom_teacher deleted"
          }
        }
      }
    },
    "/api/classRoom_student": {
      "get": {
        "tags": [
          "classRoom_student"
        ],
        "summary": "Get all classRoom_student",
        "responses": {
          "200": {
            "description": "A list of classRoom_student",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/classRoom_student"
                  }
                }
              }
            }
          }
        }
      },
      "post": {
        "tags": [
          "classRoom_student"
        ],
        "summary": "Create a new classRoom_student",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/classRoom_student"
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "classRoom_student created"
          }
        }
      }
    },
    "/api/classRoom_student/:id": {
      "get": {
        "tags": [
          "classRoom_student"
        ],
        "summary": "Get a single classRoom_student by ID",
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
            "description": "A single classRoom_student",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/classRoom_student"
                }
              }
            }
          }
        }
      },
      "put": {
        "tags": [
          "classRoom_student"
        ],
        "summary": "Update an existing classRoom_student",
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
                "$ref": "#/components/schemas/classRoom_student"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "classRoom_student updated"
          }
        }
      },
      "delete": {
        "tags": [
          "classRoom_student"
        ],
        "summary": "Delete an existing classRoom_student",
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
            "description": "classRoom_student deleted"
          }
        }
      }
    },
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
    },
    "/api/family_person": {
      "get": {
        "tags": [
          "family_person"
        ],
        "summary": "Get all family_person",
        "responses": {
          "200": {
            "description": "A list of family_person",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/family_person"
                  }
                }
              }
            }
          }
        }
      },
      "post": {
        "tags": [
          "family_person"
        ],
        "summary": "Create a new family_person",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/family_person"
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "family_person created"
          }
        }
      }
    },
    "/api/family_person/:id": {
      "get": {
        "tags": [
          "family_person"
        ],
        "summary": "Get a single family_person by ID",
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
            "description": "A single family_person",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/family_person"
                }
              }
            }
          }
        }
      },
      "put": {
        "tags": [
          "family_person"
        ],
        "summary": "Update an existing family_person",
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
                "$ref": "#/components/schemas/family_person"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "family_person updated"
          }
        }
      },
      "delete": {
        "tags": [
          "family_person"
        ],
        "summary": "Delete an existing family_person",
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
            "description": "family_person deleted"
          }
        }
      }
    }
  },
  "components": {
    "schemas": {
      "classRoom_teacher": {
        "type": "object",
        "properties": {
          "firstName": {
            "type": "string"
          },
          "lastName": {
            "type": "string"
          },
          "id": {
            "type": "integer",
            "exclusiveMinimum": 0
          }
        },
        "required": [
          "firstName",
          "lastName"
        ]
      },
      "classRoom_student": {
        "type": "object",
        "properties": {
          "firstName": {
            "type": "string"
          },
          "lastName": {
            "type": "string"
          },
          "age": {
            "type": "number"
          },
          "id": {
            "type": "integer",
            "exclusiveMinimum": 0
          },
          "teacher_id": {
            "type": "integer",
            "description": "Reference to the teacher"
          }
        },
        "required": [
          "firstName",
          "lastName",
          "teacher_id"
        ]
      },
      "family_person": {
        "type": "object",
        "properties": {
          "firstName": {
            "type": "string"
          },
          "lastName": {
            "type": "string"
          },
          "hairColor": {
            "type": "string"
          },
          "toy": {
            "type": "string"
          },
          "id": {
            "type": "integer",
            "exclusiveMinimum": 0
          }
        },
        "required": []
      }
    }
  }
};

    module.exports = swaggerSpec;
    