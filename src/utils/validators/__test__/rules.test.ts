import * as rules from '../rules';

describe('required rule', () => {
  test.each([
    ['string', 'yes yes yes'],
    ['date', new Date()],
    ['number', 111],
  ])('resolves when value %s passed', async (_, val) => {
    await expect(
      (rules.requiredRule as any).validator(null, val)
    ).resolves.toBeUndefined();
  });

  test.each([
    ['empty', ''],
    ['null', null],
    ['spaces', '   '],
  ])('returns error when %s', async (_, invalidVal) => {
    await expect(
      (rules.requiredRule as any).validator(null, invalidVal)
    ).rejects.toEqual('Required');
  });
});

describe('urlRule', () => {
  test.each([
    'http://www.google.com',
    'https://www.amazon.com.au',
    'https://somewhere.co.uk',
    'https://99-Bikes.com.au/store?q=google+this&oq=google+this&aqs=chrome.0.0i512l10.1373j0j7&sourceid=chrome&ie=UTF-8',
    '',
  ])('allows valid urls', async (validUrl: string) => {
    await expect(
      rules.urlRule.validator(null, validUrl)
    ).resolves.toBeUndefined();
  });

  test.each(['nowhere', 'www.gmail.com', 'https://www.ayyye.b'])(
    'returns error for invalid urls',
    async (invalidVal) => {
      await expect(rules.urlRule.validator(null, invalidVal)).rejects.toEqual(
        'URL must prefix with http:// or https:// and must contain a valid domain name'
      );
    }
  );
});

describe('nameRule', () => {
  test.each([
    'Simon The Likeable',
    'Lord Fetherington-son Jr. III',
    'Joseph',
    'joseph smith',
    "Tim O'Connel",
  ])('allows valid name, %s', async (name: string) => {
    await expect(rules.nameRule.validator(null, name)).resolves.toBeUndefined();
  });

  test.each([
    'Ahm3d',
    '!deli',
    '0mar',
    '-Cant Start with Dash',
    "' or single quote",
  ])('returns error for invalid characters', async (invalidVal) => {
    await expect(rules.nameRule.validator(null, invalidVal)).rejects.toEqual(
      'Name contains characters that are not allowed'
    );
  });
});

describe('numericRule', () => {
  test.each(['1', '12', '0328', ''])(
    'allows numbers only, %s',
    (validNumber: string) => {
      expect((rules.numericRule as any).pattern.test(validNumber)).toBeTruthy();
    }
  );

  test.each([' ', 'Four', '9teen', 'e'])(
    'returns error for invalid numbers',
    (invalidVal) => {
      expect(
        (rules.numericRule as any).pattern.test(null, invalidVal)
      ).toBeFalsy();
    }
  );
});

describe('futureDateRule', () => {
  test('allows today', async () => {
    const today = new Date();
    await expect(
      (rules.futureDateRule as any).validator(null, today)
    ).resolves.toBeUndefined();
  });

  test.each(['', '2199-02-22'])(
    'future dates or empty',
    async (validNumber: string) => {
      await expect(
        (rules.futureDateRule as any).validator(null, validNumber)
      ).resolves.toBeUndefined();
    }
  );

  test('returns error for past dates', async () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    await expect(
      (rules.futureDateRule as any).validator(null, yesterday)
    ).rejects.toEqual('Expiry date must be in the future');

    await expect(
      (rules.futureDateRule as any).validator(null, '1999-03-22')
    ).rejects.toEqual('Expiry date must be in the future');
  });
});
