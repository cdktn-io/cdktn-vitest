import { testingMatchers } from "cdktn";
import { expect } from "vitest";
import { parseResult, passEvaluation } from "./matcher.utils.js";

/**
 * Register the cdktn Vitest matchers on the global `expect`.
 *
 * Call this once from a Vitest setup file:
 *
 * ```ts
 * // vitest.setup.ts
 * import { setupVitest } from "@cdktn/vitest";
 * setupVitest();
 * ```
 *
 * The matchers delegate to cdktn core's `testingMatchers`, the same logic the
 * built-in Jest adapter uses, wired to a Vitest `passEvaluation`.
 */
export const setupVitest = (): void => {
  // Build the property-aware matchers once with our Vitest predicate, then
  // reuse them across every matcher invocation.
  const toHaveResourceWithProperties =
    testingMatchers.getToHaveResourceWithProperties(passEvaluation);
  const toHaveDataSourceWithProperties =
    testingMatchers.getToHaveDataSourceWithProperties(passEvaluation);
  const toHaveProviderWithProperties =
    testingMatchers.getToHaveProviderWithProperties(passEvaluation);

  expect.extend({
    toHaveResource(received, resource) {
      return parseResult(toHaveResourceWithProperties(received, resource, {}));
    },
    toHaveResourceWithProperties(received, resource, properties) {
      return parseResult(
        toHaveResourceWithProperties(received, resource, properties),
      );
    },
    toHaveDataSource(received, dataSourceConstructor) {
      return parseResult(
        toHaveDataSourceWithProperties(received, dataSourceConstructor, {}),
      );
    },
    toHaveDataSourceWithProperties(
      received,
      dataSourceConstructor,
      properties,
    ) {
      return parseResult(
        toHaveDataSourceWithProperties(
          received,
          dataSourceConstructor,
          properties,
        ),
      );
    },
    toHaveProvider(received, providerConstructor) {
      return parseResult(
        toHaveProviderWithProperties(received, providerConstructor, {}),
      );
    },
    toHaveProviderWithProperties(received, providerConstructor, properties) {
      return parseResult(
        toHaveProviderWithProperties(received, providerConstructor, properties),
      );
    },
    toBeValidTerraform(received) {
      return parseResult(testingMatchers.toBeValidTerraform(received));
    },
    toPlanSuccessfully(received) {
      return parseResult(testingMatchers.toPlanSuccessfully(received));
    },
  });
};
