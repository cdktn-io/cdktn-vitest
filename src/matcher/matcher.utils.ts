import type { testingMatchers } from "cdktn";
import { expect } from "vitest";

/**
 * Predicate handed to cdktn's core matchers to decide whether a collection of
 * synthesized items contains one matching the asserted properties.
 *
 * This mirrors the role of the Jest adapter's predicate in cdktn core, but is
 * built on Vitest's asymmetric matchers. An empty property set degrades to a
 * pure existence check.
 */
export const passEvaluation = (
  items: any,
  assertedProperties: Record<string, any>,
): boolean => {
  if (Object.entries(assertedProperties).length === 0) {
    return items.length > 0;
  }

  // `expect().toEqual()` throws on mismatch; we translate that into a boolean.
  // This is more robust across Vitest versions than poking at the asymmetric
  // matcher's semi-internal `asymmetricMatch()` method.
  try {
    expect(items).toEqual(
      expect.arrayContaining([expect.objectContaining(assertedProperties)]),
    );
    return true;
  } catch {
    return false;
  }
};

/**
 * Translate cdktn's `AssertionReturn` ({ message, pass }) into the shape Vitest
 * expects a matcher to return (message as a thunk).
 */
export const parseResult = (result: testingMatchers.AssertionReturn) => ({
  message: () => result.message,
  pass: result.pass,
});
