import Store from "electron-store";

const schema = {
  definitions: {
    task: {
      type: "object",
      properties: {
        uuid: { type: "string" },
        topicUuid: { type: "string" },
        content: { type: "string" },
        date: { type: "date" },
      },
      required: ["uuid", "content"],
    },
    topic: {
      type: "object",
      properties: {
        uuid: { type: "string" },
        name: { type: "string" },
        color: { type: "string" },
        tasks: {
          type: "array",
          items: {
            type: "string",
          },
        },
      },
      required: ["uuid", "name", "color", "tasks"],
    },
  },

  properties: {
    tasks: {
      // mapping of task uuids to tasks
      type: "object",
      additionalProperties: { type: "#/definitions/task" },
    },
    topics: {
      // mapping of topic uuids to topics
      type: "object",
      additionalProperties: { type: "#/definitions/topic" },
    },
    schedule: {
      // list of task uuids
      type: "array",
      items: { type: "string" },
    },
    topicOrder: {
      type: "array",
      items: { type: "string" },
    },
  },
};

export const store = new Store({ schema });
