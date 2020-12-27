const Store = require('electron-store');

const schema = {
    "$schema": "http://json-schema.org/draft-07/schema#",

    "definitions": {
        "task": {
            "type": "object",
            "properties": {
                "uuid": { "type": "string" },
                "topic_uuid": { "type": "string" },
                "note": { "type": "string" }
            },
            "required": ["uuid", "note"]
        },
        "topic": {
            "type": "object",
            "properties": {
                "uuid": { "type": "string" },
                "name": { "type": "string" },
                "color": { "type": "string" }
            },
            "required": ["uuid", "name", "color"]
        }
    },

    "type": "object",

    "properties": {
        "tasks": {
            "type": "array",
            "items": { "type": "#/definitions/task" }
        },
        "schedule": {
            "type": "array",
            "items": { "type": "string" }   // task uuids
        },
        "topics": {
            "type": "array",
            "items": { "type": "#/definitions/topic" }
        }
    }
};

export default store = new Store({ schema });