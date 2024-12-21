import { performance } from "perf_hooks";

type Color = "red" | "green" | "yellow" | "blue" | "magenta" | "cyan";

const colors = {
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  reset: "\x1b[0m",
};

export function Logger(color: Color = "cyan") {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const className = this.constructor.name;
      const methodName = propertyKey;
      const startTime = performance.now();

      console.log(
        `${colors[color]}[${className}] Calling method: ${methodName}${colors.reset}`
      );

      try {
        const result = await originalMethod.apply(this, args);
        const endTime = performance.now();
        const duration = (endTime - startTime).toFixed(2);

        console.log(
          `${colors[color]}[${className}] Method ${methodName} completed in ${duration}ms${colors.reset}`
        );

        return result;
      } catch (error: any) {
        const endTime = performance.now();
        const duration = (endTime - startTime).toFixed(2);

        console.error(
          `${colors.red}[${className}] Method ${methodName} failed after ${duration}ms\nError: ${error.message}${colors.reset}`
        );
        throw error;
      }
    };

    return descriptor;
  };
}
