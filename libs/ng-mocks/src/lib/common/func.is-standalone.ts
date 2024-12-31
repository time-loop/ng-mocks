import { isStandalone as isNgStandalone } from '@angular/core';

/**
 * Checks whether a class has been decorated with the standalone flag.
 */
export function isStandalone(declaration: any): boolean {
  return isNgStandalone(declaration);
}
