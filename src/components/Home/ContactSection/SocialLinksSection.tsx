import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SocialLink } from '@/lib/contactUtils';

interface SocialLinksSectionProps {
  socialLinks: SocialLink[];
  isChristmasTheme?: boolean;
}

export function SocialLinksSection({ socialLinks, isChristmasTheme = false }: SocialLinksSectionProps) {
  return (
    <div className="lg:col-span-1">
      <h3 className="text-xl font-semibold mb-6">Suivez-Nous</h3>

      {/* Réseaux sociaux */}
      <div className="space-y-4 mb-8">
        {socialLinks.map((social) => (
          <a
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-4 p-4 bg-card rounded-xl border border-border hover-lift transition-all duration-300"
          >
            <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
              {social.faIcon && <FontAwesomeIcon icon={social.faIcon} className="h-6 w-6 text-primary-foreground" />}
            </div>
            <div>
              <div className="font-semibold text-foreground">{social.name}</div>
              <div className="text-sm text-muted-foreground">{social.handle}</div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}