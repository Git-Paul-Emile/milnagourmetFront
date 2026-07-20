import { cn } from '@/lib/utils';

interface ContactHeaderProps {
  title: string;
  description: string;
}

export function ContactHeader({ title, description }: ContactHeaderProps) {
  return (
    <div className="text-center mb-12">
      {/* Titre de section entièrement en #212121 (plus de dégradé). */}
      <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#212121]">
        {title}
      </h2>
      <p className={cn("text-lg max-w-2xl mx-auto", "text-muted-foreground")}>
        {description}
      </p>
    </div>
  );
}