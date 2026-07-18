import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        /* Bouton d'action : bleu #43A2F2 au repos, vert #4bb069 au survol.
           Libellé en encre foncée (obligatoire : du blanc échouerait sur ces
           deux teintes claires) et bordure soutenue pour que le contour du
           bouton reste perceptible sur un fond clair. */
        default:
          "border border-button-border bg-button text-button-foreground hover:border-button-hover-border hover:bg-button-hover hover:text-button-hover-foreground",
        secondary:
          "border border-button-border bg-button text-button-foreground hover:border-button-hover-border hover:bg-button-hover hover:text-button-hover-foreground",
        outline:
          "border border-input bg-background hover:border-button-hover-border hover:bg-button-hover hover:text-button-hover-foreground",
        ghost: "hover:bg-button-hover hover:text-button-hover-foreground",
        /* Le rouge reste réservé aux actions destructrices : le remplacer
           ferait perdre le signal de danger. */
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-11 w-11", /* 44px : taille minimale de cible tactile (WCAG 2.5.8 / iOS HIG) */
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading && <Loader2 className="animate-spin" />}
        {children}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
