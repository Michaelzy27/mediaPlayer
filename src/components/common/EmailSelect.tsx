import { Select, notification } from 'antd';
import { useEffect, useState, useCallback } from 'react';

interface IEmailSelectProps {
  onChange?: (selected: string[]) => void;
  value?: string[];
  id?: string;
}

const EmailSelect = ({ onChange, value = [], id }: IEmailSelectProps) => {
  const [internalValue, setInternalValue] = useState<string>('');
  const [emailList, setEmailList] = useState<Array<string>>(value);

  // handle onchange of email text detect when an email should be added
  const handleSearchChanged = useCallback(
    (val: string) => {
      const delimiters = [',', ';', ' '];
      if (val && delimiters.some((d: string) => val.indexOf(d) !== -1)) {
        const sanitisedString = val.replace(/["'()<>]/g, '');
        const pastedEmails = sanitisedString
          .split(/[,; ]/)
          .filter((v: string) => !!v);

        // filter out duplicates
        const newEmails = new Set([...emailList, ...pastedEmails]);

        const diff = emailList.length + pastedEmails.length - newEmails.size;
        if (diff > 0) {
          notification['warning']({
            message: `${diff} duplicate email${
              diff > 1 ? 's were' : ' was'
            } not added`,
          });
        }
        setEmailList([...newEmails]);
        setInternalValue('');
      } else {
        setInternalValue(val);
      }
    },
    [emailList]
  );

  const tryAddEmail = useCallback(
    (e: any, emailList: string[], internalValue: string) => {
      // commit
      if (emailList.indexOf(internalValue) === -1) {
        setEmailList([...emailList, internalValue]);
      } else {
        notification['warning']({
          message: `${internalValue} already added`,
        });
      }
      setInternalValue('');

      // prevent tabbing to next field
      e.preventDefault();
    },
    [setEmailList, setInternalValue]
  );

  // handle tab and enter to commit current email
  const handleKeyDown = useCallback(
    (e: any) => {
      const key = e.key.toLowerCase();
      const selectKeys = ['tab', 'enter'];
      if (selectKeys.indexOf(key) !== -1 && internalValue) {
        tryAddEmail(e, emailList, internalValue);
      }
    },
    [emailList, internalValue, tryAddEmail]
  );

  const handleBlur = useCallback(
    (e: any) => {
      if (internalValue) {
        tryAddEmail(e, emailList, internalValue);
      }
    },
    [emailList, internalValue, tryAddEmail]
  );

  // sync email list when item removed
  const handleDeselect = (val: any) => {
    setEmailList(emailList.filter((e: string) => e !== val));
  };

  // bubble changes up to parent form
  useEffect(() => {
    if (onChange && emailList?.length !== value?.length) {
      onChange(emailList);
    }
  }, [emailList, onChange, value]);

  return (
    <Select
      id={id}
      mode="tags"
      notFoundContent={'Type to add emails.'}
      onInputKeyDown={handleKeyDown}
      onSearch={handleSearchChanged}
      searchValue={internalValue}
      onDeselect={handleDeselect}
      onBlur={handleBlur}
      value={emailList}
      open={false}
    />
  );
};

export default EmailSelect;
