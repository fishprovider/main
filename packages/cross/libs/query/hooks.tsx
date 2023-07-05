import type { QueryKey as ReactQueryKey } from '@tanstack/react-query';
import { useMutation, useQuery as useReactQuery } from '@tanstack/react-query';

interface QueryParams<Data, QueryKey> {
  queryFn: () => Data | Promise<Data>,
  queryKey: QueryKey,
  enabled?: boolean,
  refetchInterval?: number, // in milliseconds
  refetchIntervalInBackground?: boolean,
  staleTime?: number, // in milliseconds
  // TODO: add more if needed one by one
}

interface QueryResult<Data, Error> {
  data: Data | undefined,
  error: Error | null,
  isLoading: boolean,
  // TODO: add more if needed one by one
}

interface MutateParams<Data, Variables> {
  mutationFn: (vars: Variables) => Promise<Data>,
  // TODO: add more if needed one by one
}

interface MutateCallbacks<Data, Variables, Error> {
  onSuccess?: (data: Data, variables: Variables) => void,
  onError?: (err: Error, variables: Variables) => void,
}

interface MutateResult<Data, Variables, Error> {
  data: Data | undefined,
  error: Error | null,
  isLoading: boolean,
  mutate: (vars?: Variables, callbacks?: MutateCallbacks<Data, Variables, Error>) => void,
  // TODO: add more if needed one by one
}

function useQuery<
  Data = unknown,
  Error = unknown,
  QueryKey extends readonly unknown[] = ReactQueryKey,
>({
  enabled = true,
  ...rest
}: QueryParams<Data, QueryKey>): QueryResult<Data, Error> {
  const reactQueryParams = {
    enabled,
    ...rest,
  };
  return useReactQuery<Data, Error, Data, QueryKey>(reactQueryParams);
}

function useMutate<
  Data = unknown,
  Error = unknown,
  Variables = unknown,
  >({
  ...rest
}: MutateParams<Data, Variables>): MutateResult<Data, Variables, Error> {
  const reactQueryParams = {
    ...rest,
  };
  const { mutate, ...restRes } = useMutation<Data, Error, Variables>(reactQueryParams);
  return {
    mutate: (
      variables: Variables = undefined as Variables,
      callbacks: MutateCallbacks<Data, Variables, Error> = {},
    ) => mutate(variables, {
      ...callbacks,
      onSuccess: (data, vars) => {
        if (callbacks.onSuccess) {
          callbacks.onSuccess(data, vars);
        }
      },
      onError: (err: any, vars) => {
        if (callbacks.onError) {
          callbacks.onError(err, vars);
        } else {
          // eslint-disable-next-line no-alert
          alert(err);
        }
      },
    }),
    ...restRes,
  };
}

export { useMutate, useQuery };
