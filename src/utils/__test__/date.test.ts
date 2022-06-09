import * as dateUtil from '../date';

describe('formatLastActiveDate', () => {
  test('returns "Today" for today', () => {
    const today = new Date().getTime();
    expect(dateUtil.formatLastActiveDate(today)).toEqual('Today');
  });

  test('returns "Yesterday" for yesterday\'s date', () => {
    const myDate = new Date();
    myDate.setDate(myDate.getDate() - 1);
    expect(dateUtil.formatLastActiveDate(myDate.getTime())).toEqual(
      'Yesterday'
    );
  });

  test.each([
    ['2022-01-01', '01 Jan 2022'],
    ['2024-02-29', '29 Feb 2024'],
    ['1999-12-10', '10 Dec 1999'],
    ['2122-04-05', '05 Apr 2122'], // will this still be around in 100 years?
  ])('%s returns date formatted as %s', (testDate, expResult) => {
    const epochNumber = new Date(testDate).getTime();
    const result = dateUtil.formatLastActiveDate(epochNumber);
    expect(result).toEqual(expResult);
  });
});

describe('formatDateTime', () => {
  test('Returns date time in DD MMM YYYY hh:mm:ss format', () => {
    const testDate = '2022-04-22T04:48:37';
    expect(dateUtil.formatDateTime(testDate)).toEqual('22 Apr 2022 04:48:37');
    const epoch = new Date(testDate).getTime();
    expect(dateUtil.formatDateTime(epoch)).toEqual('22 Apr 2022 04:48:37');

    // null state
    expect(dateUtil.formatDateTime()).toEqual('');
  });
});

describe('formatDate', () => {
  test('Returns date in DD MMM YYYY format', () => {
    const testDate = '2022-04-22T04:48:37';
    expect(dateUtil.formatDate(testDate)).toEqual('22 Apr 2022');
    const epoch = new Date(testDate).getTime();
    expect(dateUtil.formatDate(epoch)).toEqual('22 Apr 2022');

    // null state
    expect(dateUtil.formatDate()).toEqual('');
  });
});
