export function HeroLoading() {
  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden -mt-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    </section>
  );
}