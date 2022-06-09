export const getInitials = (firstName: string, lastName: string | null) => {
  if (!firstName && !lastName) {
    return '';
  }

  return `${firstName?.charAt(0).toUpperCase() || ''}${
    lastName?.charAt(0).toUpperCase() || ''
  }`;
};

export const deriveFirstLastName = (user: any) => {
  if (user) {
    if (user.displayName) {
      const names = user.displayName.split(' ');
      return {
        first: names[0],
        last: names.length > 1 ? names[names.length - 1] : '',
      };
    }
    return { first: user.givenName, last: user.familyName };
  }
  return { first: '', last: '' };
};
