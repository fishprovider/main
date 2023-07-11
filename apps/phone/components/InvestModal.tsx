import Button from '~ui/Button';
import { useToast } from '~ui/ToastProvider';

interface Props {
  toast: ReturnType<typeof useToast>,
  providerId: string;
}

export default function InvestModal({ toast, providerId }: Props) {
  return (
    <Button
      onPress={() => {
        toast.show('Coming soon');
      }}
    >
      {providerId}
    </Button>
  );
}
