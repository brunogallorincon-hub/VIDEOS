/**
 * Note: When using the Node.JS APIs, the config file
 * doesn't apply. Instead, pass options directly to the APIs.
 *
 * All configuration options: https://remotion.dev/docs/config
 */

import { Config } from "@remotion/cli/config";

Config.setRspack(true);
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setDefaultPremountInSeconds(2);

// En este entorno en la nube no se puede descargar Chrome Headless Shell,
// así que usamos el Chromium que ya viene instalado. En tu compu esto no aplica.
import fs from "node:fs";
const localChromium = "/opt/pw-browsers/chromium-1243/chrome-linux64/chrome";
if (fs.existsSync(localChromium)) {
  Config.setBrowserExecutable(localChromium);
}
