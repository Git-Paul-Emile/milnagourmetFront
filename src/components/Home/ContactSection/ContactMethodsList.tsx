import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ContactMethod } from '@/lib/contactUtils';

interface ContactMethodsListProps {
  methods: ContactMethod[];
  address: string;
}

export function ContactMethodsList({ methods, address }: ContactMethodsListProps) {
  return (
    <div className="lg:col-span-1">
      <h3 className={cn("text-xl font-semibold mb-6", "text-[#212121]")}>Nous Contacter</h3>
      <div className="space-y-4">
        {methods.map((method) => (
          <button
            key={method.title}
            onClick={method.action}
            className="w-full p-4 rounded-xl transition-all duration-300 hover-lift flex items-start space-x-3 text-left text-foreground"
          >
            {method.faIcon && <FontAwesomeIcon icon={method.faIcon} className="h-5 w-5 text-primary mt-1" />}
            <div>
              <h4 className="font-semibold mb-1">{method.title}</h4>
              <p className="text-muted-foreground text-sm">
                {method.description}
              </p>
            </div>
          </button>
        ))}

        <a
          href="https://urlr.me/RVykJH"
          target="_blank"
          rel="noopener noreferrer"
          className="block p-4 rounded-xl hover-lift"
        >
          <div className="flex items-start space-x-3">
            <MapPin className="h-5 w-5 text-primary mt-1" />
            <div>
              <h4 className="font-semibold text-foreground mb-1">Notre Adresse</h4>
              <p className="text-muted-foreground text-sm">
                {address}
              </p>
            </div>
          </div>
        </a>
      </div>
    </div>
  );
}