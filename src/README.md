# Orchestrator SDK

**A TypeScript Library for Interacting with the Rhinestone Orchestrator**

> [!WARNING]  
> This SDK is deprecated. Please switch to the [new SDK](http://github.com/rhinestonewtf/sdk) to continue getting updates. See [the migration note](https://github.com/rhinestonewtf/sdk?tab=readme-ov-file#migrating-from-orchestrator-sdk).

### For Developers

The Orchestrator SDK provides the following capabilities:

- **Create a User Account Cluster:** Add accounts across multiple chains to a single cluster.
- **Fetch Total Portfolio Balance:** Retrieve the overall balance of a user account cluster.
- **Obtain Order Bundles:** Get an order bundle for a specific meta intent associated with a user account.
- **Sign Order Bundles:** Utilize an ownable validator to sign order bundles (please create an issue for support regarding specific validators).
- **Post Signed Order Bundles:** Submit signed order bundles to the orchestrator for processing by relayers.
- **Check Order Bundle Status:** Monitor the status of submitted order bundles.

Additionally, the Orchestrator SDK exposes useful types and ABIs that developers can leverage when interacting with the Orchestrator.

### For Solvers

If you are looking for a mock implementation of a relayer, please visit our [Rhinestone Relayer Repository](https://github.com/rhinestonewtf/rhinestone-relayer).

For comprehensive documentation on the Chain Abstraction System, please refer to: [Chain Abstraction Docs](https://rhinestone.notion.site/Chain-Abstraction-Docs-External-4790f4303e934b16a6fb24637e6f67e7?pvs=4).

For API documentation, visit: [Swagger Docs](https://orchestrator-prototype-38oyp.ondigitalocean.app/api-docs/).

### Note

> You need an API key to interact with most useful Orchestrator functions. If you're interested in building on top of our system, please reach out to the team.

## Using the Orchestrator SDK

### Installation

```bash
npm install viem @rhinestone/orchestrator-sdk
```

```bash
pnpm install viem @rhinestone/orchestrator-sdk
```

```bash
yarn add viem @rhinestone/orchestrator-sdk
```

```bash
bun install viem @rhinestone/orchestrator-sdk
```

### Quick Start

```typescript
Coming soon ...

( Please refer to the tests for now )
```

## Using this repo

To install dependencies, run:

```bash
pnpm install
```

To build the sdk, run:

```bash
pnpm build
```

To run tests, run:

```bash
pnpm test
```

## Contributing

For feature or change requests, feel free to open a PR, start a discussion or get in touch with us.
