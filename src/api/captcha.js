import {load} from 'recaptcha-v3';
import { CAPTCHA_SITE_KEY } from '../utils/constants';

export const getCaptchaInstance = async () => {
  const c = await load(CAPTCHA_SITE_KEY);
  c.hideBadge();
  return c;
}

export const getCaptcha = async (name) => {
  const i = await getCaptchaInstance()
  const r = await i.execute(name)
  i.hideBadge();
  return r;
}
