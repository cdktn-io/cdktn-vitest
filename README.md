# @cdktn/vitest

Vitest matchers for [CDK Terrain (cdktn)](https://cdktn.io).

`cdktn` ships [Jest matchers](https://cdktn.io/docs/test/unit-tests#write-assertions)
out of the box but no Vitest adapter. This package fills that gap: it registers
the same assertion logic cdktn core exposes (`testingMatchers`) onto Vitest's
`expect`, mirroring cdktn's built-in Jest adapter (`setupJest()`).

It is the org-owned, provenance-signed successor to the third-party
`cdktn-vitest` package — same public API (`setupVitest()`), published under the
`@cdktn` scope.

> **Long-term direction:** the goal is to fold a Vitest adapter directly into
> cdktn core as `cdktn/lib/testing/adapters/vitest` (mirroring the Jest adapter)
> and deprecate this standalone package. Tracking issue:
> [open-constructs/cdk-terrain#289](https://github.com/open-constructs/cdk-terrain/issues/289).
> Until core ships that, `@cdktn/vitest` is the supported path.

## Installation

```bash
pnpm add -D @cdktn/vitest
# or: npm install -D @cdktn/vitest
```

`cdktn` and `vitest` are peer dependencies:

- `cdktn >= 0.23.0`
- `vitest >= 2.1.0`

## Setup

### 1. Register the matchers

Create a Vitest setup file that calls `setupVitest()`:

```ts
// vitest.setup.ts
import { setupVitest } from "@cdktn/vitest";

setupVitest();
```

### 2. Wire it into your Vitest config

```ts
// vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    setupFiles: ["./vitest.setup.ts"],
  },
});
```

### 3. Enable the matcher types

Add the package to your `tsconfig.json` so the matchers are typed on `expect`:

```json
{
  "compilerOptions": {
    "types": ["@cdktn/vitest"]
  }
}
```

## Available matchers

| Matcher | Asserts that the synthesized stack… |
| --- | --- |
| `toHaveResource(resource)` | contains a resource of the given type |
| `toHaveResourceWithProperties(resource, props)` | contains a matching resource with the given properties |
| `toHaveDataSource(dataSource)` | contains a data source of the given type |
| `toHaveDataSourceWithProperties(dataSource, props)` | contains a matching data source with the given properties |
| `toHaveProvider(provider)` | configures the given provider |
| `toHaveProviderWithProperties(provider, props)` | configures the given provider with the given properties |
| `toBeValidTerraform()` | passes `terraform validate` (requires the `terraform` CLI) |
| `toPlanSuccessfully()` | passes `terraform plan` (requires the `terraform` CLI) |

Property matchers use subset (`objectContaining`) semantics — the resource may
have additional properties beyond those asserted.

## Example

```ts
import { describe, expect, it } from "vitest";
import { Testing } from "cdktn";
import { MyStack } from "./my-stack";

describe("MyStack", () => {
  it("creates the bucket with the right name", () => {
    const synthesized = Testing.synth(new MyStack(Testing.app(), "test"));

    expect(synthesized).toHaveResourceWithProperties(S3Bucket, {
      bucket: "my-bucket",
    });
  });
});
```

> `toBeValidTerraform()` / `toPlanSuccessfully()` operate on a synthesized
> output **directory** (containing `manifest.json`) and shell out to the
> `terraform` CLI, so they require Terraform to be installed.

## Credits

This is a clean-room TypeScript reimplementation that mirrors the public API of
the MIT-licensed [`cdktn-vitest`](https://www.npmjs.com/package/cdktn-vitest) by
Aníbal Jorquera, itself derived from
[`cdktf-vitest`](https://www.npmjs.com/package/cdktf-vitest) by Daniel Grefberg.
See [`NOTICE`](./NOTICE).

## License

[MIT](./LICENSE)
