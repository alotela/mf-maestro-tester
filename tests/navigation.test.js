import { ClientFunction, Selector } from "testcafe";
fixture`isNavigationBlocked`.page`http://localhost:3000`;

const blockNavigation = ClientFunction((context) => window.MfMaestro.navigation.blockNavigation(context));
const unblockNavigation = ClientFunction((context) => window.MfMaestro.navigation.unblockNavigation(context));

test("returns false when no navigation blocked", async t => {
  const result = await t.eval(() => window.MfMaestro.isNavigationBlocked("myContext"));
  await t.expect(result).eql(false);
});

test("returns true when navigation blocked", async t => {
  await blockNavigation("myContext");
  const result = await t.eval(() => window.MfMaestro.isNavigationBlocked("myContext"));
  await t.expect(result).eql(true);
});

fixture`isNavigationUnblocked`.page`http://localhost:3000`;
test("returns false when navigation is not unblocked", async t => {
  const result = await t.eval(() => window.MfMaestro.isNavigationUnblocked("myContext"));
  await t.expect(result).eql(false);
});

test("returns true when navigation is unblocked", async t => {
  await unblockNavigation("myContext");
  const result = await t.eval(() => window.MfMaestro.isNavigationUnblocked("myContext"));
  await t.expect(result).eql(true);
});

