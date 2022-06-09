import { Rule } from 'antd/lib/form';
import dayjs from 'dayjs';

export const requiredRule: Rule = {
  validator: (_: any, str: any) => {
    if (!str || str.toString().trim() === '') {
      return Promise.reject('Required');
    }
    return Promise.resolve();
  },
};

export const emailRule = {
  validator: (_: any, email: string) => {
    if (!email) {
      return Promise.resolve();
    }

    const emailValidatorRegEx =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailValidatorRegEx.test(email)) {
      return Promise.reject(`${email} is not a valid email`);
    }
    return Promise.resolve();
  },
  transform: (email: string) => {
    if (!email) {
      return '';
    }
    return email.trim();
  },
};

export const arrayOfEmailsRule: Rule = {
  required: false,
  type: 'array',
  transform: (items: string[]) => {
    if (!items) {
      return [];
    }
    return items.filter((item) => !!item);
  },
  defaultField: {
    /// custom validator to indicate which value is invalid
    validator: emailRule.validator,
  },
  message: 'Not a valid array',
};

export const urlRule = {
  validator: (_: any, str: string) => {
    if (!str) {
      return Promise.resolve();
    }

    const expression =
      /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,})/gi;
    const regex = new RegExp(expression);

    if (!regex.test(str)) {
      return Promise.reject(
        'URL must prefix with http:// or https:// and must contain a valid domain name'
      );
    }

    try {
      new URL(str);
      return Promise.resolve();
    } catch {
      return Promise.reject('Url is not valid.');
    }
  },
};

export const nameRule = {
  validator: (_: any, str: string) => {
    if (!str) {
      return Promise.resolve();
    }
    const names = str.trim().split(' ');
    if (
      names.every((name: string) => {
        return /^[a-zA-Z][^0-9_!¡?÷?¿/\\+=@#$%&*(){}|~<>;:[\]^"`,]{0,}$/.test(
          name
        );
      })
    ) {
      return Promise.resolve();
    }
    return Promise.reject('Name contains characters that are not allowed');
  },
};

export const numericRule: Rule = {
  pattern: /^[0-9]*$/,
  message: 'Only numeric characters allowed',
};

export const futureDateRule: Rule = {
  validator: (_: any, date: Date | string) => {
    return !date || dayjs(date) >= dayjs().startOf('day')
      ? Promise.resolve()
      : Promise.reject('Expiry date must be in the future');
  },
};
