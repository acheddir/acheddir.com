export const withLineBreaks = (text: string) =>
  text.split('\n').map(line => {
    return (
      <>
        {line}
        <br />
      </>
    );
  });

