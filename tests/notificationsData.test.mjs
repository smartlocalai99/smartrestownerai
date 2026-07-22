import assert from "node:assert/strict";
import test from "node:test";
import { sendBroadcastNotification } from "../lib/notificationsData.mjs";

test("invokes one owner-authenticated direct broadcast", async () => {
  const calls = [];
  const client = {
    functions: {
      invoke: async (name, options) => {
        calls.push([name, options]);
        return {
          data: {
            recipientCount: 3,
            acceptedCount: 2,
            rejectedCount: 1,
            skippedCount: 0,
          },
          error: null,
        };
      },
    },
  };

  const result = await sendBroadcastNotification(
    { title: "Sale", body: "Today", offerId: "offer-1" },
    client
  );

  assert.deepEqual(calls, [
    [
      "broadcast-push",
      { body: { title: "Sale", body: "Today", offerId: "offer-1" } },
    ],
  ]);
  assert.equal(result.acceptedCount, 2);
});
