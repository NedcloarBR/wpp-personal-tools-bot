import { dirname, sep } from "node:path";
import { globSync } from "glob";

export class BaseHandler {
  public isClass(input) {
    return (
      typeof input === "function" &&
      typeof input.prototype === "object" &&
      input.toString().substring(0, 5) === "class"
    );
  }

  public findClass(module) {
    if (module.__esModule) {
      const def = Reflect.get(module, "default");
      if (this.isClass(def)) {
        return def;
      }

      let _class = null;
      for (const prop of Object.keys(module)) {
        const ref = Reflect.get(module, prop);
        if (this.isClass(ref)) {
          _class = ref;
          break;
        }
      }

      return _class;
    }

    return this.isClass(module) ? module : null;
  }

  public get directory() {
    if (!require.main) {
      throw new Error("require.main is not defined");
    }
    return `${dirname(require.main.filename)}${sep}`;
  }

  public async getFiles(handler: string): Promise<string[]> {
    const Files = globSync(`${this.directory}${handler}/**/*.ts`);
    for(const file of Files) {
      delete require.cache[require.resolve(file)];
    }
    return Files;
  }
}
