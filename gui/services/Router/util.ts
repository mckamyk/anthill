import {Subject} from 'rxjs';
import {routeTo} from '../Router';

export interface RoutePath {
  path: string;
  protected: boolean;
  listener: Subject<boolean>;
  children: RoutePath[];
}

let checkAuth: () => Promise<boolean>;
export const setCheckAuth = (authFunction: () => Promise<boolean>) => {
  checkAuth = authFunction;
};

export const pathToParts = (path: string) => {
  const parts = path.split('/');
  return ['/', ...parts.filter((part) => part)];
};

export const getAttrs = (path: string) => {
  const parts = pathToParts(path);
  return parts.map((part) => part[0] === ':' ? part.slice(1) : undefined);
};

export const getWinnerRoute = async (routes: RoutePath[], path: string, notFound?: string, auth?: string): Promise<RoutePath | undefined> => {
  notFound = notFound || '/404';
  auth = auth || '/login';
  let winner: RoutePath | undefined;
  let bestIndex = 0;
  const parts = pathToParts(path);

  routes.forEach((child) => {
    const childRoute = child.path;
    if (!childRoute) return;
    const childParts = pathToParts(childRoute);

    let potentialWinner = false;
    let winningIndex = 0;

    if (childParts.length > parts.length) return;

    parts.every((part, index) => {
      const cp = childParts[index];
      const attrs = getAttrs(childRoute);
      if (part === cp && index >= bestIndex) {
        potentialWinner = true;
        winningIndex = index;
        return true;
      } else if (attrs[index] && index > bestIndex) {
        potentialWinner = true;
        winningIndex = index;
        return true;
      } else if (part !== cp) {
        potentialWinner = false;
        return false;
      } else {
        return true;
      }
    });

    if (potentialWinner) {
      winner = child;
      bestIndex = winningIndex;
    }
  });

  if (!winner) {
    routeTo(notFound);
    return;
  };

  if (await isAllowed(winner)) {
    return winner;
  } else {
    routeTo(auth);
  }
};

export const isAllowed = async (route: RoutePath) => {
  const isProtected = route.protected;
  if (!isProtected) return true;
  try {
    if (checkAuth && await checkAuth()) {
      return true;
    } else {
      return false;
    }
  } catch {
    return false;
  }
};

export const drainNode = (node: Node): void => {
  if (!node.hasChildNodes()) return;
  node.removeChild(node.childNodes[0]);
  return drainNode(node);
};
