import Store from 'electron-store'

const schema = {
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

    "properties": {
        "tasks": {  // mapping of task uuids to tasks
            "type": "object",
            "additionalProperties": { "type": "#/definitions/task" }
        },
        "schedule": {   // list of task uuids
            "type": "array",
            "items": { "type": "string" }
        },
        "topics": { // mapping of topic uuids to topics
            "type": "object",
            "additionalProperties": { "type": "#/definitions/topic" }
        }
    }
};

export const store = new Store({ schema });