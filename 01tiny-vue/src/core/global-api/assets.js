import { ASSET_TYPES } from "../../shared/constants";
import { isPlainObject } from "../util/lang";

export function initAssetsRegisters(Vue) {
  /**
   * Create asset registration methods.
   */
  ASSET_TYPES.forEach((type) => {
    Vue[type] = function (id, definition) {
      if (!definition) {
        return this.options[type + "s"][id];
      } else {
        if (type === "component" && isPlainObject(definition)) {
          definition.name = definition.name || id;
          // 继承Vue
          definition = this.options._base.extend(definition);
        }
        // TODO:暂时先不实现directive
        // if (type === 'directive' && typeof definition === 'function') {
        //   definition = { bind: definition, update: definition }
        // }
        this.options[type + "s"][id] = definition;
        return definition;
      }
    };
  });
}
