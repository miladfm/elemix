export const toHaveNotDeepInstances = function (obj1: unknown, obj2: unknown) {
  const deepReferenceCompare = (node1: any, node2: any) => {
    if (node1 === node2) {
      return true;
    }

    if (typeof node1 !== 'object' || node1 === null || typeof node2 !== 'object' || node2 === null) {
      return false; // If either is not an object or is null, they are not the same
    }

    const node1Keys = Object.keys(node1);
    const node2Keys = Object.keys(node2);

    for (const key of node1Keys) {
      if (node2Keys.includes(key)) {
        if (typeof node1[key] === 'object' && typeof node2[key] === 'object') {
          if (deepReferenceCompare(node1[key], node2[key])) {
            return true;
          }
        }
      }
    }

    return false;
  };

  const sameReference = deepReferenceCompare(obj1, obj2);

  if (!sameReference) {
    return {
      message: () => `expected and actual objects have no same deep reference`,
      pass: true,
    };
  } else {
    return {
      message: () => `expected and actual objects have at list one same deep reference`,
      pass: false,
    };
  }
};
