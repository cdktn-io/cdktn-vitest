import {
  TerraformDataSource,
  TerraformProvider,
  TerraformResource,
  TerraformStack,
  Testing,
} from "cdktn";
import type { Construct } from "constructs";
import { describe, expect, it } from "vitest";

// Minimal generic constructs so the tests don't depend on any Terraform
// provider package. Each carries the static `tfResourceType` the cdktn matchers
// look up, and forwards arbitrary properties straight into the synthesized JSON
// via `addOverride`.
class TestResource extends TerraformResource {
  public static readonly tfResourceType = "test_resource";

  constructor(
    scope: Construct,
    id: string,
    properties: Record<string, any> = {},
  ) {
    super(scope, id, { terraformResourceType: TestResource.tfResourceType });
    for (const [key, value] of Object.entries(properties)) {
      this.addOverride(key, value);
    }
  }
}

class TestDataSource extends TerraformDataSource {
  public static readonly tfResourceType = "test_data_source";

  constructor(
    scope: Construct,
    id: string,
    properties: Record<string, any> = {},
  ) {
    super(scope, id, { terraformResourceType: TestDataSource.tfResourceType });
    for (const [key, value] of Object.entries(properties)) {
      this.addOverride(key, value);
    }
  }
}

class TestProvider extends TerraformProvider {
  public static readonly tfResourceType = "test";

  constructor(
    scope: Construct,
    id: string,
    properties: Record<string, any> = {},
  ) {
    super(scope, id, { terraformResourceType: TestProvider.tfResourceType });
    for (const [key, value] of Object.entries(properties)) {
      this.addOverride(key, value);
    }
  }
}

function synthFixture(): string {
  const app = Testing.app();
  const stack = new TerraformStack(app, "test-stack");
  new TestProvider(stack, "provider", { region: "us-east-1" });
  new TestResource(stack, "resource", { name: "my-resource", enabled: true });
  new TestDataSource(stack, "data", { filter: "value" });
  return Testing.synth(stack);
}

describe("resource matchers", () => {
  const synthesized = synthFixture();

  it("toHaveResource", () => {
    expect(synthesized).toHaveResource(TestResource);
    expect(synthesized).not.toHaveResource(TestDataSource);
  });

  it("toHaveResourceWithProperties", () => {
    expect(synthesized).toHaveResourceWithProperties(TestResource, {
      name: "my-resource",
      enabled: true,
    });
    expect(synthesized).not.toHaveResourceWithProperties(TestResource, {
      name: "other-resource",
    });
  });
});

describe("data source matchers", () => {
  const synthesized = synthFixture();

  it("toHaveDataSource", () => {
    expect(synthesized).toHaveDataSource(TestDataSource);
    expect(synthesized).not.toHaveDataSource(TestResource);
  });

  it("toHaveDataSourceWithProperties", () => {
    expect(synthesized).toHaveDataSourceWithProperties(TestDataSource, {
      filter: "value",
    });
    expect(synthesized).not.toHaveDataSourceWithProperties(TestDataSource, {
      filter: "nope",
    });
  });
});

describe("provider matchers", () => {
  const synthesized = synthFixture();

  it("toHaveProvider", () => {
    expect(synthesized).toHaveProvider(TestProvider);
  });

  it("toHaveProviderWithProperties", () => {
    expect(synthesized).toHaveProviderWithProperties(TestProvider, {
      region: "us-east-1",
    });
    expect(synthesized).not.toHaveProviderWithProperties(TestProvider, {
      region: "eu-west-1",
    });
  });
});

describe("terraform validation matchers", () => {
  // These matchers shell out to the `terraform` CLI against a synthesized output
  // directory. We assert the graceful failure path (an invalid subject reports
  // `pass: false`) so the suite stays hermetic — no terraform binary required.
  it("toBeValidTerraform fails for a non-directory subject", () => {
    expect("/path/that/does/not/exist").not.toBeValidTerraform();
  });

  it("toPlanSuccessfully fails for a non-directory subject", () => {
    expect("/path/that/does/not/exist").not.toPlanSuccessfully();
  });
});
