import { setConfig } from "@faustwp/core";
import templates from "@/wp-templates/index.js";
import possibleTypes from "./possibleTypes.json";

/**
 * @type {import('@faustwp/core').FaustConfig}
 **/
export default setConfig({
  templates,
  experimentalPlugins: [],
  possibleTypes,
});
