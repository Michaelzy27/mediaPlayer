const getErrorDescription = (error: any) => {
  if (typeof error === 'string') {
    return error;
  } else if (error instanceof Array) {
    return error.join(', ');
  }
  return undefined;
};

const getErrorDescriptions = (errorObj: any) => {
  if (!errorObj?.errors) {
    return;
  }

  const errors = Object.values(errorObj.errors)?.map((e: any) => {
    return getErrorDescription(e);
  });

  if (errors && errors.length) {
    return (
      <ul className="notification-error-list">
        {errors.map((e: any, i: number) => {
          return <li key={`notification-error-${i}`}>{e}</li>;
        })}
      </ul>
    );
  }
  return null;
};

export const getErrorMessageObj = (error: any) => {
  // increase notification duration if additional errors are displayed
  const duration = error.errors ? 9 : 4.5;
  return {
    message: (error as any).errorMessage || 'An error occurred',
    description: getErrorDescriptions(error),
    duration,
  };
};
