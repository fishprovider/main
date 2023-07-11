import ProviderCard from './ProviderCard';

interface Props {
  providerIds: string[];
}

export default function ProviderCards({ providerIds }: Props) {
  return (
    <>
      {providerIds.map((providerId) => (
        <ProviderCard key={providerId} providerId={providerId} />
      ))}
    </>
  );
}
