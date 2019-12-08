import { ClientFunction, Selector } from "testcafe";
fixture`eventHasBeenEmitted`.page`http://localhost:3000`;

const emittedEvent = [
  "event1",
  [1, "string", {a: 1, b: "c", c: {e: 12}}, [1, "a"]]
];

const emittedEvent1 = ["event2", [123]];

const emitEvent = ClientFunction((ee) => window.MfMaestro.events.emit(ee[0], ...ee[1]));

test("return false when event has not been emitted", async t => {
  const result = await t.eval(
    () => window.MfMaestro.eventHasBeenEmitted(emittedEvent[0], emittedEvent[1]),
    {
      dependencies: {emittedEvent}
    }
  );
  await t.expect(result).eql(
    {
      events: [],
      count: 0,
      isOk: false,
      errors: ['events pushed 0 times.']
    }
  );
});

test("count 1 time by defaut", async t => {
  await emitEvent(emittedEvent);
  const result = await t.eval(
    () => window.MfMaestro.eventHasBeenEmitted(emittedEvent[0], emittedEvent[1]),
    {
      dependencies: {emittedEvent}
    }
  );
  await t.expect(result).eql(
    {
      events: [['event1', emittedEvent[1]]],
      count: 1,
      isOk: true,
      errors: []
    }
  );
});

test("count options.count times", async t => {
  await emitEvent(emittedEvent);
  await emitEvent(emittedEvent);
  const result = await t.eval(
    () => window.MfMaestro.eventHasBeenEmitted(emittedEvent[0], emittedEvent[1], {count: 2}),
    {
      dependencies: {emittedEvent}
    }
  );
  await t.expect(result).eql(
    {
      events: [
        ['event1', emittedEvent[1]],
        ['event1', emittedEvent[1]]
      ],
      count: 2,
      isOk: true,
      errors: []
    }
  );
});

test("store all emitted events", async t => {
  await emitEvent(emittedEvent);
  await emitEvent(emittedEvent1);
  const result = await t.eval(
    () => window.MfMaestro.eventHasBeenEmitted(emittedEvent[0], emittedEvent[1]),
    {
      dependencies: {emittedEvent}
    }
  );
  await t.expect(result).eql({events: [['event1', emittedEvent[1]]], count: 1, isOk: true, errors: []});
  const result1 = await t.eval(
    () => window.MfMaestro.eventHasBeenEmitted(emittedEvent1[0], emittedEvent1[1]),
    {
      dependencies: {emittedEvent1}
    }
  );
  await t.expect(result1).eql({events: [['event2', emittedEvent1[1]]], count: 1, isOk: true, errors: []});
});
