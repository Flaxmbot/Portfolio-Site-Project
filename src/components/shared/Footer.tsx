"use client";

import { useEffect, useState } from 'react';

export function Footer() {
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="py-8 mt-12 border-t border-border">
      <div className="container mx-auto px-4 text-center text-muted-foreground">
        <p>&copy; {year} Aether Portfolio. All Rights Reserved.</p>
        <p className="text-sm mt-2">
          Crafted with passion, powered by AI.
        </p>
      </div>
    </footer>
  );
}
