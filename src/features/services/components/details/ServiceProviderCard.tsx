import { Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import type { BasicUser } from '@/types/user.types';

interface Props {
  provider: BasicUser;
  thumbnail?: string | null;
}

function ServiceProviderCard({
  provider,
  thumbnail,
}: Props) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6">
      <h3 className="text-headline-sm font-bold text-on-surface mb-6">
        Service Provider
      </h3>

      <div className="flex items-center gap-4">
        {provider.profile_picture || thumbnail ? (
          <img
            src={provider.profile_picture || thumbnail || ''}
            alt={provider.username}
            className="w-16 h-16 rounded-full object-cover"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-primary text-on-primary flex items-center justify-center text-title-lg font-bold">
            {provider.username[0].toUpperCase()}
          </div>
        )}

        <div className="flex-1">
          <h4 className="font-bold text-on-surface">
            {provider.username}
          </h4>

          <Link
            to={`/profile/${provider.username}`}
            className="text-primary hover:underline text-body-sm"
          >
            View Profile
          </Link>
        </div>

        <Link
          to={`/messages?userId=${provider.id}&username=${provider.username}&profile_picture=${provider.profile_picture ?? ''}`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg hover:brightness-110 transition-all"
        >
          <MessageCircle size={18} />
          Chat
        </Link>
      </div>
    </div>
  );
}

export default ServiceProviderCard;