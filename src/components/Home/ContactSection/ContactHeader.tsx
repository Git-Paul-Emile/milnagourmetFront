import { cn } from '@/lib/utils';

interface ContactHeaderProps {
  title: string;
  description: string;
  isChristmasTheme?: boolean;
}

export function ContactHeader({ title, description, isChristmasTheme = false }: ContactHeaderProps) {
  return (
    <div className="text-center mb-12">
      <h2 className="text-3xl md:text-4xl font-bold mb-4">
        <span className="bg-gradient-primary bg-clip-text text-transparent">
          {title}
        </span>
      </h2>
      <p className={cn("text-lg max-w-2xl mx-auto", "text-muted-foreground")}>
        {description}
      </p>
    </div>
  );
}