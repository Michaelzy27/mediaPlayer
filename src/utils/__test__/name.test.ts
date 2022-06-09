import { getInitials, deriveFirstLastName } from '../name';

describe('getInitials', () => {
  test.each([
    ['joey', 'tribbiani', 'JT'],
    ['RACHAEL', 'GREEN', 'RG'],
    ['Ross', '', 'R'],
    ['', 'Bing', 'B'],
  ])('returns initials from first/last name', (first, last, result) => {
    expect(getInitials(first, last)).toEqual(result);
  });

  test('returns empty string when no first or last name', () => {
    expect(getInitials('', '')).toEqual('');
  });
});

describe('deriveFirstLastName', () => {
  test('splits first and last name from display name', () => {
    expect(deriveFirstLastName({ displayName: 'Homer Jay Simpson' })).toEqual({
      first: 'Homer',
      last: 'Simpson',
    });
    expect(deriveFirstLastName({ displayName: 'Madonna' })).toEqual({
      first: 'Madonna',
      last: '',
    });
  });

  test('returns givenName and familyName when no display name', () => {
    expect(
      deriveFirstLastName({
        displayName: '',
        givenName: 'Walt',
        familyName: 'Disney',
      })
    ).toEqual({ first: 'Walt', last: 'Disney' });
  });

  test('returns empty strings when no user provided', () => {
    expect(deriveFirstLastName(null)).toEqual({ first: '', last: '' });
  });
});
