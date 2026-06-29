import "vitest";
import type { testingMatchers } from "cdktn";

type TerraformConstructor = testingMatchers.TerraformConstructor;

/**
 * Ambient typing for the cdktn matchers registered by {@link setupVitest}.
 *
 * Consumers opt in by adding this package to their tsconfig:
 *
 * ```json
 * { "compilerOptions": { "types": ["@cdktn/vitest"] } }
 * ```
 */
export interface CdktnVitestMatchers<R = unknown> {
  toHaveResource(resource: TerraformConstructor): R;
  toHaveResourceWithProperties(
    resource: TerraformConstructor,
    properties: Record<string, any>,
  ): R;
  toHaveDataSource(dataSourceConstructor: TerraformConstructor): R;
  toHaveDataSourceWithProperties(
    dataSourceConstructor: TerraformConstructor,
    properties: Record<string, any>,
  ): R;
  toHaveProvider(providerConstructor: TerraformConstructor): R;
  toHaveProviderWithProperties(
    providerConstructor: TerraformConstructor,
    properties: Record<string, any>,
  ): R;
  toBeValidTerraform(): R;
  toPlanSuccessfully(): R;
}

declare module "vitest" {
  interface Assertion<T = any> extends CdktnVitestMatchers<T> {}
  interface AsymmetricMatchersContaining extends CdktnVitestMatchers {}
}
