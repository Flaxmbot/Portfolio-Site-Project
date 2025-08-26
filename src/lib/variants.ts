import { cn } from "./utils";

type VariantConfig<T extends Record<string, Record<string, string>>> = {
  variants: T;
  defaultVariants?: Partial<{
    [K in keyof T]: keyof T[K];
  }>;
};

type VariantProps<T extends Record<string, Record<string, string>>> = Partial<{
  [K in keyof T]: keyof T[K];
}>;

export function cva<T extends Record<string, Record<string, string>>>(
  base: string,
  config?: VariantConfig<T>
) {
  return (props?: VariantProps<T> & { className?: string }) => {
    if (!config) return cn(base, props?.className);

    const { variants, defaultVariants } = config;
    const classes: string[] = [base];

    // Apply variant classes
    Object.keys(variants).forEach((variantKey) => {
      const variantValue = props?.[variantKey as keyof typeof props] || 
                          defaultVariants?.[variantKey as keyof typeof defaultVariants];
      
      if (variantValue && variants[variantKey][variantValue as string]) {
        classes.push(variants[variantKey][variantValue as string]);
      }
    });

    return cn(...classes, props?.className);
  };
}

export type { VariantProps };