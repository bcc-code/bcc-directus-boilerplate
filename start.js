import { startServer } from '@directus/api/server';
import env from '@directus/api/env';

if (env['APPLICATIONINSIGHTS_CONNECTION_STRING']) {
  let appInsights = require("applicationinsights");
  appInsights.setup()
    .setDistributedTracingMode(appInsights.DistributedTracingModes.AI_AND_W3C)
    .setAutoCollectConsole(true, true) // Generate Trace telemetry for winston/bunyan and console logs
    .start();
}
  
startServer();
