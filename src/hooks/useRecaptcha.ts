import { useCallback, useState, useEffect } from 'react';
import { load } from 'recaptcha-v3';

const useRecaptcha = (autoInit: boolean = true) => {
  const [recaptcha, setRecaptchaInstance] = useState<any>();
  const initRecaptcha = useCallback(async () => {
    const recaptcha = await load(process.env.REACT_APP_RECAPTCHA_SITEKEY!);
    setRecaptchaInstance(recaptcha);
  }, []);

  useEffect(() => {
    if (autoInit) {
      initRecaptcha();
    }
  }, [autoInit, initRecaptcha]);

  const recaptchaDone = useCallback(() => {
    setTimeout(() => {
      document.querySelector('.grecaptcha-badge')?.remove();
    }, 500);
  }, []);

  return { recaptcha, recaptchaDone, initRecaptcha };
};

export default useRecaptcha;
