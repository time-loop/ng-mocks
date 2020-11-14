import { NG_MOCKS_GUARDS } from '../common/core.tokens';
import ngMocksUniverse from '../common/ng-mocks-universe';

const replaceWithMocks = (value: any): any => {
  if (ngMocksUniverse.cacheDeclarations.has(value)) {
    return ngMocksUniverse.cacheDeclarations.get(value);
  }
  if (typeof value !== 'object') {
    return value;
  }

  let mock: any;
  let updated = false;

  if (Array.isArray(value)) {
    mock = [];
    for (const valueItem of value) {
      if (
        ngMocksUniverse.builtDeclarations.has(valueItem) &&
        ngMocksUniverse.builtDeclarations.get(valueItem) === null
      ) {
        updated = updated || true;
        continue;
      }
      mock.push(replaceWithMocks(valueItem));
      updated = updated || mock[mock.length - 1] !== valueItem;
    }
  } else if (value) {
    mock = {};
    for (const key of Object.keys(value)) {
      if (
        ngMocksUniverse.builtDeclarations.has(value[key]) &&
        ngMocksUniverse.builtDeclarations.get(value[key]) === null
      ) {
        updated = updated || true;
        continue;
      }
      mock[key] = replaceWithMocks(value[key]);
      updated = updated || mock[key] !== value[key];
    }

    // Removal of guards.
    for (const section of ['canActivate', 'canActivateChild', 'canDeactivate', 'canLoad']) {
      if (!Array.isArray(mock[section])) {
        continue;
      }

      const guards: any[] = [];
      for (const guard of mock[section]) {
        if (ngMocksUniverse.builtDeclarations.has(guard) && ngMocksUniverse.builtDeclarations.get(guard) !== null) {
          guards.push(guard);
          continue;
        }
        if (
          ngMocksUniverse.builtDeclarations.has(NG_MOCKS_GUARDS) &&
          ngMocksUniverse.builtDeclarations.get(NG_MOCKS_GUARDS) === null
        ) {
          continue;
        }
        guards.push(guard);
      }
      if (mock[section].length !== guards.length) {
        updated = updated || true;
        mock = {
          ...mock,
          [section]: guards,
        };
      }
    }
  }

  if (updated) {
    Object.setPrototypeOf(mock, Object.getPrototypeOf(value));
    return mock;
  }
  return value;
};

export default (() => replaceWithMocks)();
