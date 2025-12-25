import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { cn } from '@/lib/utils';
import { ContactMethod } from '@/lib/contactUtils';

interface ContactMethodsListProps {
  methods: ContactMethod[];
  isChristmasTheme?: boolean;
}

export function ContactMethodsList({ methods, isChristmasTheme = false }: ContactMethodsListProps) {
  return (
    <div className="lg:col-span-1">
      <h3 className={cn("text-xl font-semibold mb-6", "text-foreground")}>Nous Contacter</h3>
      <div className="space-y-4">
        {methods.map((method, index) => (
          <button
            key={method.title}
            onClick={method.action}
            className={cn(
              'w-full p-4 rounded-xl transition-all duration-300',
              'hover-lift flex items-center space-x-4',
              'border border-border ' + (method.primary
                ? 'bg-gradient-primary text-primary-foreground hover:shadow-glow'
                : 'bg-card text-foreground hover:bg-primary/5')
            )}
          >
            <div className={cn(
              'w-12 h-12 rounded-lg flex items-center justify-center',
              method.primary
                ? 'bg-primary-foreground/20'
                : 'bg-primary/10'
            )}>
              {method.faIcon && <FontAwesomeIcon icon={method.faIcon} className={cn(
                  'h-6 w-6',
                  method.primary ? 'text-primary-foreground' : 'text-primary'
                )} />}
            </div>
            <div className="text-left">
              <div className={cn("font-semibold", "")}>{method.title}</div>
              <div className={cn(
                'text-sm',
                method.primary ? 'text-primary-foreground/80' : 'text-muted-foreground'
              )}>
                {method.description}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}