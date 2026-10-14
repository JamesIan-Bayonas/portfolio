# Application evidence execution — 14 October 2026

These are scoped executions of the historical versions referenced by the portfolio. They are not results for the applications' current working trees or live deployments. Existing application edits were preserved. Public execution data is maintained in `src/data/applicationTestRuns.json`; the portfolio build emits its downloadable counterpart at `/verification/application-tests-2026-10-14.json`.

| Application / commit | Executed scope | Result |
| --- | --- | --- |
| DormFix / `55d6076fd4d36d390b2fc4d76985a3041cdca519` | `client/tests/payments.test.mjs` | 7 passed |
| PharmaLink / `31524d96da2f40dd1c34fe47fcf957ae03c84d5b` | `tests/exportSalesCsv.test.mjs` | 6 passed |
| IsdaLog / `df1ca46b37737a5811ef5c19393d7d276da6febb` | CargoHandshakeTest and OrderSettlementIntegrationTest | 4 passed, 1 failed |
| CentraLog / `2374c261689c9f2bec1617a2d12757c4c3f8cbe9` | DashboardSummaryTests | 3 passed |
| CentraLog / same commit | ExecuteBulkTransfer_OnDisposedAsset_ReturnsUnprocessableEntityOrBadRequest | 1 passed; HTTP 422 |

## Isolation and reproduction

DormFix, PharmaLink, and CentraLog sources were exported from their local Git objects into separate temporary directories at the exact cited commits. IsdaLog's cited commit was fetched into a separate temporary repository. No existing application checkout was reset or edited.

Commands and runtime details are recorded in the maintained JSON. DormFix reused the portfolio's installed TypeScript compiler through a temporary dependency junction for its existing transpilation helper. PharmaLink used Node.js 24.12.0's TypeScript stripping. These tests operate on synthetic records or helper functions; they do not contact real payment or stock systems.

IsdaLog used PHP 8.2.12, PHPUnit 11.5.56, SQLite `:memory:`, a synthetic 32-byte application key, and the committed PHPUnit configuration. Composer installed the committed lockfile without running application setup scripts; it warned that the lockfile does not match composer.json. The unavailable Windows `ext-pcntl` requirement was ignored for installation. Worker/signal behavior was not tested. Notifications were faked by the suite. An initial invalid test-key length was corrected before the recorded application run; the final failure below persisted with a valid key.

CentraLog's three dashboard tests use unique EF Core in-memory databases. The controller fixture normally resets the hard-coded `db58833_test` database. For the single referenced integration assertion, only the database name in the temporary fixture was replaced with a unique task-owned schema, verified absent beforehand. The application code and test assertions stayed at the cited commit. After the test returned HTTP 422, the temporary schema was removed and its absence verified. The original database was untouched. Other controller tests were not executed.

For reproduction, prepare equivalent isolated environments before running the recorded commands. Never run the original MySQL fixture against a database that must be preserved.

## Historical failure discovered

`CargoHandshakeTest::test_order_creation_generates_cryptographic_handshake_otps` received HTTP 500 instead of a redirect. The historical route invokes `App\Http\Controllers\OrderController::store`, but that method does not exist in the cited commit. The pickup rejection, valid pickup, delivery, and settlement tests passed. Fixing the application requires checking its current routing and controller ownership in the IsdaLog repository; this portfolio batch records the failure without altering historical source or claiming current live behavior.

The displayed expected outcomes remain descriptions of inspected assertions. Execution cards separately show what actually ran, including this failure and the fixture adjustment. No throughput, inference accuracy, production reliability, or full-suite coverage is inferred from these checks.
