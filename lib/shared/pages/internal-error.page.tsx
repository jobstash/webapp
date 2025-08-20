interface Props {
  title?: string;
  description?: string;
  cta?: React.ReactNode;
}

export const InternalErrorPage = (props: Props) => {
  const {
    title = 'Something went wrong',
    description = 'An unexpected error occurred.',
    cta,
  } = props;

  return (
    <div className='flex min-h-screen items-center justify-center'>
      <div className='flex flex-col gap-2 text-center'>
        <h1 className='text-2xl font-bold'>{title}</h1>
        <p className='mb-6 text-gray-600'>{description}</p>
        {cta}
      </div>
    </div>
  );
};
